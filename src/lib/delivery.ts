import { getToken } from "@/lib/customerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** Tiered service fee rule from the API: perBand naira per bandSize of items. */
export type ServiceFeeRule = { perBand: number; bandSize: number; edge: number };

/**
 * Same formula as the backend (src/common/service-fee.util.ts), so checkout
 * shows exactly what will be charged as the cart changes.
 */
export function computeServiceFee(subtotal: number, rule: ServiceFeeRule): number {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return rule.perBand;
  const bands = Math.max(1, Math.floor((subtotal - rule.edge) / rule.bandSize) + 1);
  return bands * rule.perBand;
}

export type DeliveryQuote = {
  deliveryFee: number;
  serviceFee: number;
  /** Sent by newer API versions; older ones only send a flat serviceFee. */
  serviceFeeRule?: ServiceFeeRule;
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

export type DeliveryArea = { name: string; lat: number; lng: number };

let areasCache: Promise<DeliveryArea[]> | null = null;

/** Ibadan areas the backend can price (same list it uses for typed addresses). */
export function fetchDeliveryAreas(): Promise<DeliveryArea[]> {
  if (areasCache) return areasCache;
  const token = getToken();
  if (!token) return Promise.reject(new Error("You need to be logged in."));
  areasCache = fetch(`${API_URL}/delivery/areas`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (res) => {
    if (!res.ok) throw new Error("Could not load delivery areas.");
    return (await res.json()) as DeliveryArea[];
  });
  areasCache.catch(() => {
    areasCache = null;
  });
  return areasCache;
}
