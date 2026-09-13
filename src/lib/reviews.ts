import { getToken } from "@/lib/customerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type Review = {
  id: string;
  orderId: string;
  overallRating: number;
  qualityRating: number;
  deliveryRating: number;
  comment: string | null;
  photoUrls: string[];
  createdAt: string;
};

export type ReviewInput = {
  overallRating: number;
  qualityRating: number;
  deliveryRating: number;
  comment?: string;
};

async function authedRequest<T>(
  path: string,
  method: "GET" | "POST" = "GET",
  body?: unknown,
): Promise<T | null> {
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

  if (res.status === 404) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data as T;
}

export function fetchReviewForOrder(orderId: string): Promise<Review | null> {
  return authedRequest<Review>(`/customer-reviews/order/${orderId}`, "GET");
}

export async function submitReview(orderId: string, input: ReviewInput): Promise<Review> {
  const review = await authedRequest<Review>(`/customer-reviews/order/${orderId}`, "POST", input);
  if (!review) throw new Error("Could not submit your review. Please try again.");
  return review;
}
