const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type ChatRole = "user" | "assistant";

export type ChatHistoryMessage = {
  role: ChatRole;
  content: string;
};

export type OrderDraftItem = {
  name: string;
  quantity: number;
  unit: string;
};

export type AiChatResponse =
  | { type: "text"; content: string }
  | {
      type: "draft_update";
      items: OrderDraftItem[];
      deliveryAddress: string | null;
    }
  | { type: "confirm_order" };

export async function sendChatMessage(
  message: string,
  history: ChatHistoryMessage[],
): Promise<AiChatResponse> {
  const res = await fetch(`${API_URL}/customer-chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMessage = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Something went wrong. Please try again.";
    throw new Error(errorMessage);
  }

  return data as AiChatResponse;
}

/**
 * Order-only chat: sends the customer's typed list to the Ojarun admins
 * (it lands in the admin Messages inbox). Needs the customer to be logged in.
 */
export async function submitChatList(
  entries: string[],
  token: string,
): Promise<{ id: string; message: string }> {
  const res = await fetch(`${API_URL}/customer-chat/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ entries }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMessage = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Could not send your list. Please try again.";
    throw new Error(errorMessage);
  }

  return data as { id: string; message: string };
}
