import { getToken } from "@/lib/customerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function authedRequest<T>(path: string, method: "GET" | "POST" = "GET"): Promise<T> {
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

  return data as T;
}

export type RewardTier = "Bronze" | "Silver" | "Gold";

export type RewardsSummary = {
  points: number;
  tier: RewardTier;
  tierIndex: 1 | 2 | 3;
  tierMin: number;
  tierMax: number | null;
  totalEarned: number;
  totalRedeemed: number;
  referralCode: string;
  referralCount: number;
};

export type RewardTransaction = {
  id: string;
  date: string;
  description: string;
  type: "earned" | "redeemed";
  status: "successful" | "failed";
  points: number;
};

export type RewardTransactionsPage = {
  items: RewardTransaction[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function fetchRewardsSummary(): Promise<RewardsSummary> {
  return authedRequest<RewardsSummary>("/customer-rewards");
}

export function fetchRewardTransactions(
  page = 1,
  pageSize = 5,
): Promise<RewardTransactionsPage> {
  return authedRequest<RewardTransactionsPage>(
    `/customer-rewards/transactions?page=${page}&pageSize=${pageSize}`,
  );
}
