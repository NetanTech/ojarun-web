"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load any saved cart once, on mount (browser-only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed/missing storage
    }
    setHydrated(true);
  }, []);

  // Persist on every change, after the initial load.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.id === item.id ? { ...l, quantity: l.quantity + qty } : l,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const setQuantity: CartContextValue["setQuantity"] = (id, qty) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.id !== id);
      return prev.map((l) => (l.id === id ? { ...l, quantity: qty } : l));
    });
  };

  const removeItem: CartContextValue["removeItem"] = (id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const getQuantity: CartContextValue["getQuantity"] = (id) =>
    lines.find((l) => l.id === id)?.quantity ?? 0;

  const clear = () => setLines([]);

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
