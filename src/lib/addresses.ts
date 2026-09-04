import { getToken } from "@/lib/customerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type SavedAddress = {
  id: string;
  label: string | null;
  address: string;
  landmark: string | null;
  isDefault: boolean;
};

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

export type SaveAddressInput = {
  label?: string;
  address: string;
  landmark?: string;
  isDefault?: boolean;
};

export function fetchAddresses(): Promise<SavedAddress[]> {
  return authedRequest<SavedAddress[]>("/customer-addresses", "GET");
}

export function createAddress(input: SaveAddressInput): Promise<SavedAddress> {
  return authedRequest<SavedAddress>("/customer-addresses", "POST", input);
}

export function updateAddress(
  id: string,
  input: Partial<SaveAddressInput>,
): Promise<SavedAddress> {
  return authedRequest<SavedAddress>(`/customer-addresses/${id}`, "PATCH", input);
}

export function deleteAddress(id: string): Promise<{ message: string }> {
  return authedRequest<{ message: string }>(`/customer-addresses/${id}`, "DELETE");
}

export function formatAddress(a: SavedAddress): string {
  return a.landmark ? `${a.address} (${a.landmark})` : a.address;
}
