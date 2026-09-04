"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerSession } from "@/lib/customerAuth";
import { fetchFavorites, addFavorite, removeFavorite } from "@/lib/favorites";

type FavoritesContextValue = {
  products: ProductCardProps[];
  loading: boolean;
  isFavorited: (id: string) => boolean;
  toggle: (product: ProductCardProps) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { customer, ready } = useCustomerSession();
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!customer) {
      setProducts([]);
      setLoading(false);
      return;
    }
    fetchFavorites()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [ready, customer]);

  const isFavorited = (id: string) => products.some((p) => p.id === id);

  const toggle = (product: ProductCardProps) => {
    if (!customer) {
      router.push("/login");
      return;
    }

    const wasFavorited = isFavorited(product.id);
    // Optimistic update so the heart responds instantly.
    setProducts((prev) =>
      wasFavorited ? prev.filter((p) => p.id !== product.id) : [...prev, product],
    );

    const request = wasFavorited ? removeFavorite(product.id) : addFavorite(product.id);
    request.then(setProducts).catch(() => {
      // Revert on failure.
      setProducts((prev) =>
        wasFavorited ? [...prev, product] : prev.filter((p) => p.id !== product.id),
      );
    });
  };

  return (
    <FavoritesContext.Provider value={{ products, loading, isFavorited, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside a FavoritesProvider");
  return ctx;
}
