import { getToken } from "@/lib/customerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function authedRequest<T>(
  path: string,
  method: "GET" | "POST" = "GET",
  body?: unknown,
): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new Error("You need to be logged in to see this.");
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
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

export type CreateOrderItemInput = {
  name: string;
  unit: string;
  price: number;
  quantity: number;
};

export type CreateOrderInput = {
  items: CreateOrderItemInput[];
  deliveryAddress: string;
  note?: string;
  paymentMethod: "cash" | "card";
  promoCode?: string;
};

export type CreateOrderResult = {
  id: string;
  shortId: string;
  total: number;
  discountAmount: number;
  status: string;
  paymentMethod: "cash" | "card";
  paymentUrl: string | null;
  paymentError: string | null;
};

export type PromoValidation = {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  discountAmount: number;
};

export function validatePromoCode(code: string, subtotal: number): Promise<PromoValidation> {
  return authedRequest<PromoValidation>("/customer-promo-codes/validate", "POST", {
    code,
    subtotal,
  });
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const token = getToken();
  if (!token) {
    throw new Error("You need to be logged in to place an order.");
  }

  const res = await fetch(`${API_URL}/orders`, {
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
      : data.message || "Could not place your order. Please try again.";
    throw new Error(message);
  }

  return data as CreateOrderResult;
}

export function fetchMyOrders(): Promise<OrderProperties[]> {
  return authedRequest<OrderProperties[]>("/customer-orders");
}

export function fetchMyOrder(id: string): Promise<OrderProperties> {
  return authedRequest<OrderProperties>(`/customer-orders/${id}`);
}

export function cancelOrder(id: string): Promise<OrderProperties> {
  return authedRequest<OrderProperties>(`/customer-orders/${id}/cancel`, "POST");
}

export function confirmOrder(id: string): Promise<OrderProperties> {
  return authedRequest<OrderProperties>(`/customer-orders/${id}/confirm`, "POST");
}
