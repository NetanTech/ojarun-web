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
    byName.set(item.name.toLowerCase(), item);
  }
  return Array.from(byName.values());
}

function formatDraftList(items: OrderDraftItem[]): string {
  return items
    .map((item) => `• ${item.quantity} ${item.unit} ${item.name}`)
    .join("\n");
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
      } else {
        const list = formatDraftList(draftItemsRef.current);
        appendMessage(
          "assistant",
          list
            ? `Here's your final list:\n${list}\n\nHead to checkout to complete your order, or keep chatting if you'd like to add more.`
            : `Let's get your list started first — tell me what you'd like to buy.`,
        );
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
