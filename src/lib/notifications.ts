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

export function fetchNotifications(): Promise<NotificationProps[]> {
  return authedRequest<NotificationProps[]>("/customer-notifications");
}

export function markNotificationRead(id: string): Promise<NotificationProps> {
  return authedRequest<NotificationProps>(`/customer-notifications/${id}/read`, "POST");
}

export function markAllNotificationsRead(): Promise<{ message: string }> {
  return authedRequest<{ message: string }>("/customer-notifications/read-all", "POST");
}
