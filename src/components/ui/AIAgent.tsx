"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MessageIcon,
  Send,
  Logo,
  MessageIconUnread,
} from "../../../public/svg/svg";
import { MinusCircleIcon, X } from "lucide-react";
import { submitChatList } from "@/lib/aiChat";
import { getToken, useCustomerSession } from "@/lib/customerAuth";

/**
 * Order-only chat (owner's request): no AI and no small talk. The customer
 * types or pastes what they want to buy, we read it back, and when they're
 * done the list goes to the admin Messages inbox for a person to take up.
 */

type ChatAction = "add_more" | "browse" | "send" | "login";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
  /** Buttons shown under an assistant message. Only the latest one is live. */
  actions?: ChatAction[];
};

const WELCOME_MESSAGE =
  "Hello! Type what you want to buy, or paste your shopping list, and an Ojarun admin will take up your order.";

const INSTRUCTION =
  "Type what you want to buy or paste your list. One item per line, e.g. “2 cups rice”, “Tomatoes ₦1,000”.";

const NOT_A_LIST =
  "I can only take shopping lists here. Type what you want to buy, e.g. “3 tubers of yam, 1 crate of eggs”.";

const ACTION_LABEL: Record<ChatAction, string> = {
  add_more: "Add more",
  browse: "Browse market",
  send: "That's all, send my order",
  login: "Log in to send",
};

const STORAGE_KEY = "ojarun_chat_list";

// Greetings, thanks and questions aren't shopping items.
const SMALL_TALK =
  /^(hi+|hello+|hey+|good\s*(morning|afternoon|evening|night)|how\s+are\s+you|thanks?|thank\s+you|ok(ay)?|yes|no|please|help)\b[\s!.,?]*$/i;

const DONE =
  /^(no+|nope|nothing(\s+else)?|that'?s\s+all|done|send( it| my order)?|no,?\s+thanks?( you)?)[\s!.]*$/i;

function isSmallTalk(text: string): boolean {
  const t = text.trim();
  return SMALL_TALK.test(t) || (t.endsWith("?") && !t.includes("\n"));
}

/** "rice, beans\n- yam" -> ["rice, beans", "yam"]: one entry per line, bullets dropped. */
function toLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

function now(): string {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readSavedList(): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveList(list: string[]) {
  try {
    if (list.length) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function listText(list: string[]): string {
  return list.map((l) => `• ${l}`).join("\n");
}

const AIAgent = () => {
  const { customer, ready } = useCustomerSession();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [showNudge, setShowNudge] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME_MESSAGE, time: now() },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<string[] | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // The list survives a page change (the chat lives on the marketplace page).
  const getList = (): string[] => {
    if (listRef.current === null) listRef.current = readSavedList();
    return listRef.current;
  };
  const setList = (list: string[]) => {
    listRef.current = list;
    saveList(list);
  };

  const closeChat = () => {
    setOpen(false);
    if (window.history.state?.chatOpen) {
      history.replaceState(null, "");
    }
  };

  const openChat = () => {
    setOpen(true);
    setUnread(false);
    setShowNudge(false);
    try {
      sessionStorage.setItem("ojarun_ai_nudge_seen", "1");
    } catch {
      /* ignore */
    }
    // Picking up a list started earlier in this visit.
    const saved = getList();
    if (saved.length && messages.length === 1) {
      appendMessage(
        "assistant",
        `Your list so far:\n${listText(saved)}\n\nAnything else to add?`,
        ["add_more", "browse", "send"],
      );
    }
  };

  const dismissNudge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNudge(false);
    try {
      sessionStorage.setItem("ojarun_ai_nudge_seen", "1");
    } catch {
      /* ignore */
    }
  };

  // Pop-out tip so the chat is hard to miss on first visit this session.
  useEffect(() => {
    if (open) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("ojarun_ai_nudge_seen") === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const timer = window.setTimeout(() => setShowNudge(true), 1200);
    return () => window.clearTimeout(timer);
  }, [open]);

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

  const appendMessage = (
    role: ChatMessage["role"],
    content: string,
    actions?: ChatAction[],
  ) => {
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role, content, time: now(), actions },
    ]);
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setInput("");

    // "No" to "anything else?" means they're done.
    if (getList().length > 0 && DONE.test(trimmed)) {
      void sendOrder(trimmed);
      return;
    }

    appendMessage("user", trimmed);

    if (isSmallTalk(trimmed)) {
      appendMessage("assistant", NOT_A_LIST);
      return;
    }

    const list = [...getList(), ...toLines(trimmed)];
    setList(list);
    appendMessage(
      "assistant",
      `Got it! Your list so far:\n${listText(list)}\n\nAnything else to add? You can type more, browse the market, or send your order.`,
      ["add_more", "browse", "send"],
    );
  };

  const sendOrder = async (typed?: string) => {
    const list = getList();
    if (sending) return;
    appendMessage("user", typed ?? "That's all, send my order");
    if (list.length === 0) {
      appendMessage("assistant", "Your list is empty. Type what you want to buy first.");
      return;
    }
    const token = getToken();
    if (!token || (ready && !customer)) {
      appendMessage(
        "assistant",
        "Please log in so our admin knows who the order is for. Your list is saved and will be here when you come back.",
        ["login"],
      );
      return;
    }

    setSending(true);
    try {
      const result = await submitChatList(list, token);
      setList([]);
      appendMessage("assistant", `✅ ${result.message}`);
    } catch (err) {
      appendMessage(
        "assistant",
        err instanceof Error
          ? err.message
          : "Sorry, your list didn't go through. Please try again.",
        ["send"],
      );
    } finally {
      setSending(false);
    }
  };

  const handleAction = (action: ChatAction) => {
    if (action === "add_more") {
      inputRef.current?.focus();
    } else if (action === "browse") {
      closeChat();
    } else if (action === "send") {
      void sendOrder();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter adds a new line for a longer list.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

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
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-white capitalize">
                  Ojarun Orders
                </p>
                <p className="text-xs text-white/80">Send us your shopping list</p>
              </div>
            </div>
            <button onClick={closeChat} aria-label="Close chat">
              <X className="block md:hidden" />
              <MinusCircleIcon className="hidden md:block" />
            </button>
          </div>

          <div className="px-3 py-2 bg-green-50 text-primary body-xsmall border-b border-green-100">
            {INSTRUCTION}
          </div>

          <div
            ref={transcriptRef}
            className="flex-1 p-2 bg-[#F8F9FA] w-full overflow-y-auto flex flex-col gap-3"
          >
            {messages.map((message) =>
              message.role === "assistant" ? (
                <div
                  key={message.id}
                  className="flex flex-col h-fit gap-0.5 items-start ml-2 self-start max-w-[80%]"
                >
                  <div className="w-full ml-4 p-3 bg-green-300 rounded-bl-none rounded-2xl">
                    <p className="text-white body-small whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                  {message.actions && message.id === lastAssistantId && (
                    <div className="ml-4 mt-1 flex flex-wrap gap-2">
                      {message.actions.map((action) =>
                        action === "login" ? (
                          <Link
                            key={action}
                            href="/login"
                            onClick={closeChat}
                            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                          >
                            {ACTION_LABEL[action]}
                          </Link>
                        ) : (
                          <button
                            key={action}
                            type="button"
                            disabled={sending}
                            onClick={() => handleAction(action)}
                            className={
                              action === "send"
                                ? "inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                : "inline-flex items-center justify-center rounded-full border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
                            }
                          >
                            {ACTION_LABEL[action]}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-12.5 flex items-center justify-center h-12.5 bg-green-500 rounded-full overflow-hidden">
                      <Logo className="w-7.5 h-7.5" />
                    </div>
                    <p className="text-grey-300 body-xsmall">{message.time}</p>
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
                  <p className="text-white body-small">Sending your list...</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 py-5 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.04)] flex flex-col gap-2">
            <div className="bg-[#F4F4F4] w-full p-4 flex items-end gap-2 rounded-xl">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type what you want to buy..."
                disabled={sending}
                maxLength={2000}
                className="focus-within:outline-0 flex-1 bg-transparent resize-none max-h-32"
              />

              <button
                type="button"
                aria-label="Add to list"
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
        <div className="relative self-end flex flex-col items-end gap-2">
          {showNudge && (
            <div
              role="status"
              className="ai-nudge-pop relative max-w-[220px] rounded-2xl rounded-br-md bg-white px-3.5 py-3 text-left shadow-[0_8px_28px_rgba(0,74,25,0.18)] border border-green-50"
            >
              <button
                type="button"
                aria-label="Dismiss"
                onClick={dismissNudge}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-grey-50 text-grey-400 hover:bg-grey-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={openChat}
                className="w-full text-left"
              >
                <p className="text-xs font-semibold text-primary">Ojarun Orders</p>
                <p className="mt-0.5 text-sm leading-5 text-grey-500">
                  Send us your shopping list and we&apos;ll handle the rest 🛒
                </p>
              </button>
              <span
                aria-hidden
                className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 bg-white border-r border-b border-green-50"
              />
            </div>
          )}

          <div className="ai-fab-float relative">
            <span
              aria-hidden
              className="ai-fab-pulse pointer-events-none absolute inset-0 rounded-full bg-primary"
            />
            <span
              aria-hidden
              className="ai-fab-pulse pointer-events-none absolute inset-0 rounded-full bg-primary"
              style={{ animationDelay: "1.1s" }}
            />
            <button
              type="button"
              aria-label="Open Ojarun order chat"
              className="relative z-10 rounded-full w-14 h-14 flex items-center justify-center bg-primary shadow-[0_10px_28px_rgba(0,74,25,0.35)] ring-2 ring-white/80 transition-transform active:scale-95"
              onClick={openChat}
            >
              {unread ? <MessageIconUnread /> : <MessageIcon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgent;
