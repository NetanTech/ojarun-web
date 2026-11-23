"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  MessageIcon,
  Send,
  Logo,
  MessageIconUnread,
} from "../../../public/svg/svg";
import { Check, Minus, MinusCircleIcon, Plus, X } from "lucide-react";
import { submitChatList } from "@/lib/aiChat";
import { getToken, useCustomerSession } from "@/lib/customerAuth";
import { fetchProducts } from "@/lib/products";
import { useCartActions } from "@/lib/cart";

/**
 * Order-only chat (owner's request): no AI and no small talk. As the customer
 * types, matching products from the catalog pop up; picking one (with a
 * quantity) puts it straight in the cart and on the list. Anything we don't
 * stock stays on the list as typed and goes to the admin Messages inbox.
 */

type ChatAction = "add_more" | "browse" | "send" | "login" | "checkout";

/** A list entry: typed text, or a catalog product already put in the cart. */
type ListItem = { text: string; inCart?: boolean };

const MAX_SUGGESTIONS = 5;

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
  "Start typing a product, e.g. “rice”. Pick it from the list, set the quantity and tap ✓ to add it to your cart. Can't find it? Just send it and an admin will get it for you.";

const NOT_A_LIST =
  "I can only take shopping lists here. Type what you want to buy, e.g. “3 tubers of yam, 1 crate of eggs”.";

const ACTION_LABEL: Record<ChatAction, string> = {
  add_more: "Add more",
  browse: "Browse market",
  send: "That's all, send my order",
  login: "Log in to send",
  checkout: "Go to checkout",
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

function readSavedList(): ListItem[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // Older saves were plain strings.
    return parsed.flatMap((x): ListItem[] =>
      typeof x === "string"
        ? [{ text: x }]
        : x && typeof x.text === "string"
          ? [{ text: x.text, inCart: x.inCart === true }]
          : [],
    );
  } catch {
    return [];
  }
}

function saveList(list: ListItem[]) {
  try {
    if (list.length) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function listText(list: ListItem[]): string {
  return list.map((l) => (l.inCart ? `✓ ${l.text} (in cart)` : `• ${l.text}`)).join("\n");
}

function naira(n: number): string {
  return `₦${n.toLocaleString("en-NG")}`;
}

/** Small Cloudinary thumbnail so suggestions load fast (full photos are 960px). */
function thumb(url: string): string {
  return url.includes("res.cloudinary.com/") && url.includes("/upload/")
    ? url.replace("/upload/", "/upload/c_fill,w_96,h_96,q_auto,f_auto/")
    : url;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Catalog matches for what's being typed on the last line. A leading quantity
 * ("2 rice") is ignored; every typed word must start a word in the name
 * ("ri" finds Rice, not Periwinkles), and names that start with the query
 * come first.
 */
function matchProducts(
  catalog: ProductCardProps[],
  typed: string,
): ProductCardProps[] {
  const lastLine = typed.split(/\r?\n/).pop() ?? "";
  const query = normalize(lastLine.replace(/^\s*\d+(\.\d+)?\s*(x\s+)?/i, ""));
  if (query.length < 2) return [];
  const words = query.split(" ");
  return catalog
    .map((p) => ({ p, name: normalize(p.name) }))
    .filter(({ name }) => {
      const nameWords = name.split(" ");
      return words.every((w) => nameWords.some((nw) => nw.startsWith(w)));
    })
    .sort((a, b) => {
      const as = a.name.startsWith(query) ? 0 : 1;
      const bs = b.name.startsWith(query) ? 0 : 1;
      return as - bs || a.name.length - b.name.length;
    })
    .slice(0, MAX_SUGGESTIONS)
    .map(({ p }) => p);
}

/** Leading number typed before the product, e.g. "3 yam" -> 3. */
function typedQuantity(typed: string): number {
  const lastLine = typed.split(/\r?\n/).pop() ?? "";
  const n = parseInt(lastLine.trim(), 10);
  return Number.isFinite(n) && n > 0 && n < 100 ? n : 1;
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
  const [catalog, setCatalog] = useState<ProductCardProps[]>([]);
  // Quantity chosen in each suggestion row, by product id.
  const [pickQty, setPickQty] = useState<Record<string, number>>({});
  const { addItem } = useCartActions();
  const listRef = useRef<ListItem[] | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // The list survives a page change (the chat lives on the marketplace page).
  const getList = (): ListItem[] => {
    if (listRef.current === null) listRef.current = readSavedList();
    return listRef.current;
  };
  const setList = (list: ListItem[]) => {
    listRef.current = list;
    saveList(list);
  };

  // Load the catalog once the chat is opened (cached by fetchProducts).
  useEffect(() => {
    if (!open || catalog.length) return;
    fetchProducts()
      .then(setCatalog)
      .catch(() => {
        /* no suggestions; typed lists still work */
      });
  }, [open, catalog.length]);

  const suggestions = useMemo(
    () => (sending ? [] : matchProducts(catalog, input)),
    [catalog, input, sending],
  );
  const defaultQty = typedQuantity(input);
  const qtyFor = (id: string) => pickQty[id] ?? defaultQty;

  const changeQty = (id: string, delta: number) => {
    setPickQty((prev) => ({
      ...prev,
      [id]: Math.min(99, Math.max(1, (prev[id] ?? defaultQty) + delta)),
    }));
  };

  /** Puts a suggested product in the cart and on the list, then clears the line. */
  const pickProduct = (product: ProductCardProps) => {
    const qty = qtyFor(product.id);
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageURL,
        unit: product.more,
      },
      qty,
    );

    const label = `${product.name} × ${qty}${product.more ? ` (${product.more})` : ""} – ${naira(product.price * qty)}`;
    const list = [...getList(), { text: label, inCart: true }];
    setList(list);

    // Keep any earlier lines the customer typed; drop the one just matched.
    const lines = input.split(/\r?\n/);
    lines.pop();
    setInput(lines.join("\n"));
    setPickQty({});

    appendMessage("user", `${product.name} × ${qty}`);
    appendMessage(
      "assistant",
      `Added to your cart ✓\n\nYour list so far:\n${listText(list)}\n\nAnything else? Keep typing, or tap "That's all".`,
      ["add_more", "checkout", "send"],
    );
    inputRef.current?.focus();
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

    const list: ListItem[] = [
      ...getList(),
      ...toLines(trimmed).map((text) => ({ text })),
    ];
    setList(list);
    appendMessage(
      "assistant",
      `Got it! Your list so far:\n${listText(list)}\n\nAnything else to add? You can type more, browse the market, or send your order.`,
      list.some((l) => l.inCart)
        ? ["add_more", "checkout", "send"]
        : ["add_more", "browse", "send"],
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

    // Products already in the cart are paid for at checkout; only the items
    // we couldn't match go to an admin, so nothing is ordered twice.
    const forAdmin = list.filter((l) => !l.inCart);
    const inCart = list.filter((l) => l.inCart);
    if (forAdmin.length === 0) {
      setList([]);
      appendMessage(
        "assistant",
        `Your ${inCart.length === 1 ? "item is" : "items are"} in your cart. Tap "Go to checkout" to choose delivery and pay.`,
        ["checkout"],
      );
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
      const result = await submitChatList(
        forAdmin.map((l) => l.text),
        token,
      );
      setList([]);
      if (inCart.length) {
        appendMessage(
          "assistant",
          `✅ ${result.message}\n\nThe items in your cart are separate: tap "Go to checkout" to pay for them.`,
          ["checkout"],
        );
      } else {
        appendMessage("assistant", `✅ ${result.message}`);
      }
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
                        action === "login" || action === "checkout" ? (
                          <Link
                            key={action}
                            href={action === "login" ? "/login" : "/checkout"}
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
            {suggestions.length > 0 && (
              <ul
                aria-label="Matching products"
                className="max-h-64 overflow-y-auto rounded-xl border border-green-100 divide-y divide-grey-50"
              >
                {suggestions.map((p) => {
                  const qty = qtyFor(p.id);
                  return (
                    <li key={p.id} className="flex items-center gap-2 p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb(p.imageURL)}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover bg-grey-50"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-black">
                          {p.name}
                        </p>
                        <p className="truncate body-xsmall text-grey-400">
                          {naira(p.price)}
                          {p.more ? ` / ${p.more}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Fewer ${p.name}`}
                          onClick={() => changeQty(p.id, -1)}
                          disabled={qty <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-grey-100 text-grey-500 disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`More ${p.name}`}
                          onClick={() => changeQty(p.id, 1)}
                          disabled={qty >= 99}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-grey-100 text-grey-500 disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Add ${qty} ${p.name} to cart`}
                          onClick={() => pickProduct(p)}
                          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
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
