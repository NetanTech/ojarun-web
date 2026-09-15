"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerSession } from "@/lib/customerAuth";
import { getToken } from "@/lib/customerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type MealFavoriteSummary = {
  id: string;
  name: string;
  imageURL: string;
  servings: string;
  totalPrice: number;
  ingredientCount: number;
};

async function authedRequest(
  path: string,
  method: "GET" | "POST" | "DELETE",
  body?: unknown,
): Promise<MealFavoriteSummary[]> {
  const token = getToken();
  if (!token) throw new Error("You need to be logged in to see this.");

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ([]));

  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data as MealFavoriteSummary[];
}

const fetchMealFavorites = () => authedRequest("/customer-meal-favorites", "GET");
const addMealFavorite = (meal: MealFavoriteSummary) =>
  authedRequest(`/customer-meal-favorites/${meal.id}`, "POST", {
    name: meal.name,
    imageURL: meal.imageURL,
    servings: meal.servings,
    totalPrice: meal.totalPrice,
    ingredientCount: meal.ingredientCount,
  });
const removeMealFavorite = (mealId: string) =>
  authedRequest(`/customer-meal-favorites/${mealId}`, "DELETE");

type MealFavoritesContextValue = {
  meals: MealFavoriteSummary[];
  loading: boolean;
  isFavorited: (id: string) => boolean;
  toggle: (meal: MealFavoriteSummary) => void;
};

const MealFavoritesContext = createContext<MealFavoritesContextValue | null>(null);

export function MealFavoritesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { customer, ready } = useCustomerSession();
  const [meals, setMeals] = useState<MealFavoriteSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!customer) {
      setMeals([]);
      setLoading(false);
      return;
    }
    fetchMealFavorites()
      .then(setMeals)
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  }, [ready, customer]);

  const isFavorited = (id: string) => meals.some((m) => m.id === id);

  const toggle = (meal: MealFavoriteSummary) => {
    if (!customer) {
      router.push("/login");
      return;
    }

    const wasFavorited = isFavorited(meal.id);
    setMeals((prev) =>
      wasFavorited ? prev.filter((m) => m.id !== meal.id) : [...prev, meal],
    );

    const request = wasFavorited ? removeMealFavorite(meal.id) : addMealFavorite(meal);
    request.then(setMeals).catch(() => {
      setMeals((prev) =>
        wasFavorited ? [...prev, meal] : prev.filter((m) => m.id !== meal.id),
      );
    });
  };

  return (
    <MealFavoritesContext.Provider value={{ meals, loading, isFavorited, toggle }}>
      {children}
    </MealFavoritesContext.Provider>
  );
}

export function useMealFavorites(): MealFavoritesContextValue {
  const ctx = useContext(MealFavoritesContext);
  if (!ctx) throw new Error("useMealFavorites must be used inside a MealFavoritesProvider");
  return ctx;
}
