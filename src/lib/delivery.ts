import { getToken } from "@/lib/customerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type DeliveryQuote = {
  deliveryFee: number;
  serviceFee: number;
  distanceKm: number | null;
  lat: number;
  lng: number;
  formattedAddress: string | null;
  neighborhood: string | null;
  estimated: boolean;
  serviceable: boolean;
  origin: string;
  message: string | null;
};

export type DeliverySelection = {
  address: string;
  lat: number;
  lng: number;
  landmark?: string;
  label?: string;
};

export async function quoteDelivery(input: {
  lat: number;
  lng: number;
  deliveryAddress?: string;
}): Promise<DeliveryQuote> {
  const token = getToken();
  if (!token) {
    throw new Error("You need to be logged in to check delivery fees.");
  }

  const res = await fetch(`${API_URL}/delivery/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Could not calculate delivery fee.";
    throw new Error(message);
  }

  return data as DeliveryQuote;
}
