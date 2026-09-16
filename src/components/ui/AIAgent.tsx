"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  DisLike,
  Like,
  MessageIcon,
  Send,
  ClipBoard,
  Logo,
  MessageIconUnread,
} from "../../../public/svg/svg";
import { MinusCircleIcon, X } from "lucide-react";
import {
  sendChatMessage,
  ChatHistoryMessage,
  OrderDraftItem,
} from "@/lib/aiChat";
import { fetchProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
};

const WELCOME_MESSAGE =
  "Hello, this is Ojarun agent, build to help make your shopping experience with us much easier. Type your question below or use our templates above to get started.";

const SUGGESTIONS = [
  "What's fresh today?",
  "Help me build a shopping list",
  "Suggest ingredients for jollof rice",
];

const MAX_HISTORY_MESSAGES = 20;

function now(): string {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mergeDraftItems(
  prev: OrderDraftItem[],
  incoming: OrderDraftItem[],
): OrderDraftItem[] {
  const byName = new Map(prev.map((item) => [item.name.toLowerCase(), item]));
  for (const item of incoming) {
    const key = item.name.toLowerCase();
    const existing = byName.get(key);
    // Same item, same unit mentioned again — treat it as more of the same
    // rather than losing the earlier quantity (e.g. "2kg tomatoes" then
    // later "1kg tomatoes" should total 3kg, not drop back to 1kg).
    if (existing && existing.unit.toLowerCase() === item.unit.toLowerCase()) {
      byName.set(key, { ...item, quantity: existing.quantity + item.quantity });
    } else {
      byName.set(key, item);
    }
  }
  return Array.from(byName.values());
}

function formatDraftList(items: OrderDraftItem[]): string {
  return items
    .map((item) => `• ${item.quantity} ${item.unit} ${item.name}`)
    .join("\n");
}

type MatchedItem = {
  productId: string;
  productName: string;
  price: number;
  image: string;
  unit: string;
  quantity: number;
};

// The AI only ever knows item names/quantities it inferred from chat — it has
// no idea what's actually in the catalog or what it costs. Real matching and
// pricing has to happen here, against the real product list, not the model's guess.
function parseNairaWorth(unit: string): number | null {
  const match = unit.match(/n\s*([\d,]+)\s*worth/i);
  if (!match) return null;
  const amount = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

async function matchDraftItemsToProducts(
  items: OrderDraftItem[],
): Promise<{ matched: MatchedItem[]; unmatched: OrderDraftItem[] }> {
  const matched: MatchedItem[] = [];
  const unmatched: OrderDraftItem[] = [];

  for (const item of items) {
    let candidates: ProductCardProps[] = [];
    try {
      candidates = await fetchProducts({ search: item.name });
    } catch {
      candidates = [];
    }

    const lowerName = item.name.toLowerCase();
    const best =
      candidates.find((p) => p.name.toLowerCase() === lowerName) ??
      candidates.find(
        (p) =>
          p.name.toLowerCase().includes(lowerName) ||
          lowerName.includes(p.name.toLowerCase()),
      ) ??
      candidates[0];

    if (!best) {
      unmatched.push(item);
      continue;
    }

    const nairaWorth = parseNairaWorth(item.unit);
    const quantity = nairaWorth
      ? Math.max(1, Math.round(nairaWorth / best.price))
      : Math.max(1, Math.round(item.quantity) || 1);

    matched.push({
      productId: best.id,
      productName: best.name,
      price: best.price,
      image: best.imageURL,
      unit: best.more,
      quantity,
    });
  }

  return { matched, unmatched };
}

const AIAgent = () => {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME_MESSAGE, time: now() },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const draftItemsRef = useRef<OrderDraftItem[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const closeChat = () => {
    setOpen(false);
    if (window.history.state?.chatOpen) {
      history.replaceState(null, "");
    }
  };

  const openChat = () => {
    setOpen(true);
    setUnread(false);
  };

  useEffect(() => {
    if (!open) return;

    history.pushState({ chatOpen: true }, "");

    const onPopState = () => setOpen(false);
    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, [open]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!messageContainerRef.current) return;
      if (
        messageContainerRef.current &&
        !messageContainerRef.current.contains(e.target as Node)
      ) {
        closeChat();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") closeChat();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [messageContainerRef, open]);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const appendMessage = (role: ChatMessage["role"], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role, content, time: now() },
    ]);
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const history: ChatHistoryMessage[] = messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content }));

    appendMessage("user", trimmed);
    setInput("");
    setSending(true);

    try {
      const result = await sendChatMessage(trimmed, history);

      if (result.type === "text") {
        appendMessage("assistant", result.content);
      } else if (result.type === "draft_update") {
        draftItemsRef.current = mergeDraftItems(
          draftItemsRef.current,
          result.items,
        );
        const list = formatDraftList(draftItemsRef.current);
        const addressLine = result.deliveryAddress
          ? `\n\nDelivery to: ${result.deliveryAddress}`
          : "";
        appendMessage(
          "assistant",
          `Got it! Here's your list so far:\n${list}${addressLine}\n\nAnything else, or say "that's all" when you're ready?`,
        );
      } else if (draftItemsRef.current.length === 0) {
        appendMessage(
          "assistant",
          `Let's get your list started first — tell me what you'd like to buy.`,
        );
      } else {
        const { matched, unmatched } = await matchDraftItemsToProducts(
          draftItemsRef.current,
        );
        draftItemsRef.current = [];

        for (const item of matched) {
          addItem(
            {
              id: item.productId,
              name: item.productName,
              price: item.price,
              image: item.image,
              unit: item.unit,
            },
            item.quantity,
          );
        }

        const parts: string[] = [];
        if (matched.length > 0) {
          const addedLines = matched
            .map(
              (m) =>
                `• ${m.quantity} x ${m.productName} (₦${m.price.toLocaleString()} each)`,
            )
            .join("\n");
          parts.push(`Added to your cart:\n${addedLines}`);
        }
        if (unmatched.length > 0) {
          const missingLines = unmatched
            .map((i) => `• ${i.name}`)
            .join("\n");
          parts.push(
            `I couldn't find these in our catalog, so please add them yourself from the marketplace:\n${missingLines}`,
          );
        }
        parts.push(
          matched.length > 0
            ? `Head to checkout when you're ready.`
            : `Nothing on your list matched a product we sell — try searching the marketplace directly.`,
        );

        appendMessage("assistant", parts.join("\n\n"));
      }
    } catch (err) {
      appendMessage(
        "assistant",
        err instanceof Error
          ? err.message
          : "Sorry, something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="fixed flex flex-col bottom-3 right-3 z-50">
      {open && (
        <div
          className="bg-white overflow-hidden shadow-[1px_2px_6px_rgba(0,0,0,0.03)] flex flex-col fixed inset-0 z-50 animate-slide-up md:relative md:inset-auto md:w-100 md:h-[75vh] md:rounded-2xl md:animate-none"
          ref={messageContainerRef}
        >
          <div className="flex px-3 pt-5 pb-2 items-center justify-between w-full bg-primary text-white">
            <div className="flex items-center gap-2">
              <div className="w-12.5 flex items-center justify-center h-12.5 bg-green-500 rounded-full overflow-hidden">
                <Logo className="w-7.5 h-7.5" />
              </div>
              <p className="text-lg font-semibold text-white capitalize">
                Ojarun Agent
              </p>
            </div>
            <button onClick={closeChat}>
              <X className="block md:hidden" />
              <MinusCircleIcon className="hidden md:block" />
            </button>
          </div>

          <div
            ref={transcriptRef}
            className="flex-1 p-2 bg-[#F8F9FA] w-full overflow-y-auto flex flex-col gap-3"
          >
            {messages.map((message) =>
              message.role === "assistant" ? (
                <div
                  key={message.id}
                  className="flex flex-col h-fit gap-0.5 items-start ml-2 self-start max-w-[75%]"
                >
                  <div className="w-full ml-4 p-3 bg-green-300 rounded-bl-none rounded-2xl relative">
                    <p className="text-white body-small whitespace-pre-line">
                      {message.content}
                    </p>

                    <div className="bg-primary md:flex items-center gap-2 hidden md:-bottom-2 right-2 absolute p-1.5 rounded-xl">
                      <button
                        onClick={() =>
                          navigator.clipboard?.writeText(message.content)
                        }
                      >
                        <ClipBoard />
                      </button>
                      <button>
                        <Like />
                      </button>
                      <button>
                        <DisLike />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-start gap-3">
                      <div className="w-12.5 flex items-center justify-center h-12.5 bg-green-500 rounded-full overflow-hidden">
                        <Logo className="w-7.5 h-7.5" />
                      </div>

                      <p className="text-grey-300 body-xsmall">{message.time}</p>
                    </div>

                    <div className="bg-primary flex items-center gap-2 md:hidden p-1.5 rounded-xl">
                      <button
                        onClick={() =>
                          navigator.clipboard?.writeText(message.content)
                        }
                      >
                        <ClipBoard />
                      </button>
                      <button>
                        <Like />
                      </button>
                      <button>
                        <DisLike />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={message.id}
                  className="flex flex-col h-fit gap-0.5 items-end mr-2 self-end max-w-[75%]"
                >
                  <div className="w-full p-3 bg-grey-50 rounded-br-none rounded-2xl">
                    <p className="text-black body-small whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                  <p className="text-grey-300 body-xsmall">{message.time}</p>
                </div>
              ),
            )}

            {sending && (
              <div className="flex flex-col h-fit gap-0.5 items-start ml-2 self-start max-w-[75%]">
                <div className="w-full ml-4 p-3 bg-green-300 rounded-bl-none rounded-2xl">
                  <p className="text-white body-small">Typing...</p>
                </div>
              </div>
            )}

            {messages[messages.length - 1]?.content.includes(
              "Head to checkout",
            ) && (
              <Link
                href="/checkout"
                className="ml-6 self-start text-sm font-medium text-primary underline"
              >
                Go to checkout
              </Link>
            )}
          </div>

          <div className="p-3 py-5 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.04)] flex flex-col gap-2">
            <div
              className="flex items-center gap-3 overflow-x-auto w-full"
              style={{ scrollbarWidth: "none" }}
            >
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSend(suggestion)}
                  disabled={sending}
                  className="body-xsmall p-1.5 px-2 rounded-lg bg-[#F4F4F4] shrink-0 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="bg-[#F4F4F4] w-full p-4 flex items-center gap-2 rounded-xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type your message here..."
                disabled={sending}
                className="focus-within:outline-0 flex-1 bg-transparent"
              />

              <button
                type="button"
                onClick={() => handleSend(input)}
                disabled={sending || !input.trim()}
                className="disabled:opacity-50"
              >
                <Send />
              </button>
            </div>
          </div>
        </div>
      )}
      {!open && (
        <button
          className="rounded-full w-12 h-12 flex items-center justify-center bg-primary self-end"
          onClick={openChat}
        >
          {unread ? <MessageIconUnread /> : <MessageIcon />}
        </button>
      )}
    </div>
  );
};

export default AIAgent;
