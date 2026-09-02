import { getToken } from "@/lib/customerAuth";
import { toProductCard, BackendProduct } from "@/lib/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function authedRequest(path: string, method: "GET" | "POST" | "DELETE"): Promise<ProductCardProps[]> {
  const token = getToken();
  if (!token) {
    throw new Error("You need to be logged in to see this.");
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return (data as BackendProduct[]).map(toProductCard);
}

export function fetchFavorites(): Promise<ProductCardProps[]> {
  return authedRequest("/customer-favorites", "GET");
}

export function addFavorite(productId: string): Promise<ProductCardProps[]> {
  return authedRequest(`/customer-favorites/${productId}`, "POST");
}

export function removeFavorite(productId: string): Promise<ProductCardProps[]> {
  return authedRequest(`/customer-favorites/${productId}`, "DELETE");
}
