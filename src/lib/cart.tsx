"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getToken, useCustomerSession } from "@/lib/customerAuth";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartLine, "quantity">, qty?: number) => void;
  setQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  getQuantity: (id: string) => number;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ojarun_cart";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type BackendCartLine = {
  id: string;
  name: string;
  more: string;
  price: number;
  imageURL: string;
  quantity: number;
};

function toCartLine(b: BackendCartLine): CartLine {
  return { id: b.id, name: b.name, price: b.price, image: b.imageURL, unit: b.more, quantity: b.quantity };
}

async function authedRequest(path: string, method: string, body?: unknown): Promise<CartLine[]> {
  const token = getToken();
  if (!token) throw new Error("You need to be logged in to sync your cart.");

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => []);

  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return (data as BackendCartLine[]).map(toCartLine);
}

const fetchCart = () => authedRequest("/customer-cart", "GET");
const putCartItemQuantity = (productId: string, quantity: number) =>
  authedRequest(`/customer-cart/${productId}`, "PUT", { quantity });
const deleteCartItem = (productId: string) =>
  authedRequest(`/customer-cart/${productId}`, "DELETE");
const deleteCart = () => authedRequest("/customer-cart", "DELETE");
const mergeCart = (items: { productId: string; quantity: number }[]) =>
  authedRequest("/customer-cart/merge", "POST", { items });

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { ready, customer } = useCustomerSession();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const syncedForCustomerId = useRef<string | null>(null);

  // Load any saved guest cart once, on mount (browser-only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed/missing storage
    }
    setHydrated(true);
  }, []);

  // Persist the guest cart on every change — skipped once we're syncing a logged-in customer's cart.
  useEffect(() => {
    if (!hydrated || customer) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated, customer]);

  // On login, fold any local guest-cart items into the customer's saved cart (server is
  // the source of truth from here on); on logout, drop back to an empty local cart.
  useEffect(() => {
    if (!ready || !hydrated) return;

    if (!customer) {
      syncedForCustomerId.current = null;
      setLines([]);
      return;
    }

    if (syncedForCustomerId.current === customer.id) return;
    syncedForCustomerId.current = customer.id;

    const guestItems = lines.map((l) => ({ productId: l.id, quantity: l.quantity }));
    const sync = guestItems.length > 0 ? mergeCart(guestItems) : fetchCart();

    sync
      .then((serverLines) => {
        localStorage.removeItem(STORAGE_KEY);
        setLines(serverLines);
      })
      .catch(() => {
        // Couldn't reach the server — keep the local cart, try again next login.
        syncedForCustomerId.current = null;
      });
    // Only re-run when the logged-in customer changes, not on every cart edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, hydrated, customer]);

  const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
    const existingQty = lines.find((l) => l.id === item.id)?.quantity ?? 0;
    const nextQty = existingQty + qty;

    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (existing) {
        return prev.map((l) => (l.id === item.id ? { ...l, quantity: nextQty } : l));
      }
      return [...prev, { ...item, quantity: nextQty }];
    });

    if (customer) {
      putCartItemQuantity(item.id, nextQty).then(setLines).catch(() => {});
    }
  };

  const setQuantity: CartContextValue["setQuantity"] = (id, qty) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.id !== id);
      return prev.map((l) => (l.id === id ? { ...l, quantity: qty } : l));
    });

    if (customer) {
      const request = qty <= 0 ? deleteCartItem(id) : putCartItemQuantity(id, qty);
      request.then(setLines).catch(() => {});
    }
  };

  const removeItem: CartContextValue["removeItem"] = (id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
    if (customer) {
      deleteCartItem(id).then(setLines).catch(() => {});
    }
  };

  const getQuantity: CartContextValue["getQuantity"] = (id) =>
    lines.find((l) => l.id === id)?.quantity ?? 0;

  const clear = () => {
    setLines([]);
    if (customer) {
      deleteCart().catch(() => {});
    }
  };

  const totalItems = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines],
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        totalItems,
        subtotal,
        addItem,
        setQuantity,
        removeItem,
        getQuantity,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
