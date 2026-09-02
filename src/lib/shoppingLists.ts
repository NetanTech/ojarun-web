import { getToken } from "@/lib/customerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function authedRequest<T>(
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new Error("You need to be logged in to see this.");
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data as T;
}

export type ShoppingListItemInput = {
  productId: string;
  quantity: number;
};

export function fetchShoppingLists(): Promise<ShoppingList[]> {
  return authedRequest<ShoppingList[]>("/customer-shopping-lists", "GET");
}

export function createShoppingList(name: string, items: ShoppingListItemInput[]): Promise<ShoppingList> {
  return authedRequest<ShoppingList>("/customer-shopping-lists", "POST", { name, items });
}

export function updateShoppingList(
  id: string,
  input: { name?: string; items?: ShoppingListItemInput[] },
): Promise<ShoppingList> {
  return authedRequest<ShoppingList>(`/customer-shopping-lists/${id}`, "PATCH", input);
}

export function deleteShoppingList(id: string): Promise<{ message: string }> {
  return authedRequest<{ message: string }>(`/customer-shopping-lists/${id}`, "DELETE");
}
