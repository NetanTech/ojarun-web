"use client";

import React, { useEffect, useRef, useState } from "react";
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

const AIAgent = () => {
  const [open, setOpen] = useState(false);
  const unread = true;
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const closeChat = () => {
    setOpen(false);
    if (window.history.state?.chatOpen) {
      history.replaceState(null, "");
    }
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

          <div className="flex-1 p-2 bg-[#F8F9FA] w-full h-full flex flex-col gap-3">
            <div className="flex flex-col h-fit gap-0.5 items-start ml-2 self-start max-w-[75%]">
              <div className="w-full ml-4 p-3 bg-green-300 rounded-bl-none rounded-2xl relative">
                <p className="text-white body-small">
                  Hello, this is Ojarun agent, build to help make your shopping
                  experience with us much easier. Type your question below or
                  use our templates above to get started.
                </p>

                <div className="bg-primary md:flex items-center gap-2 hidden md:-bottom-2 right-2 absolute p-1.5 rounded-xl">
                  <button>
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

                  <p className="text-grey-300 body-xsmall">7:20</p>
                </div>

                <div className="bg-primary flex items-center gap-2 md:hidden p-1.5 rounded-xl">
                  <button>
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
          </div>

          <div className="p-3 py-5 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.04)] flex flex-col gap-2">
            <div
              className="flex items-center gap-3 overflow-x-auto w-full"
              style={{ scrollbarWidth: "none" }}
            >
              <p className="body-xsmall p-1.5 px-2 rounded-lg bg-[#F4F4F4] shrink-0">
                Confirm today&apos;s prices
              </p>
              <p className="body-xsmall p-1.5 px-2 rounded-lg bg-[#F4F4F4] shrink-0">
                Confirm today&apos;s prices
              </p>
              <p className="body-xsmall p-1.5 px-2 rounded-lg bg-[#F4F4F4] shrink-0">
                Confirm today&apos;s prices
              </p>
            </div>
            <div className="bg-[#F4F4F4] w-full p-4 flex items-center gap-2 rounded-xl">
              <input
                type="text"
                placeholder="Type your message here..."
                className="focus-within:outline-0 flex-1"
              />

              <button>
                <Send />
              </button>
            </div>
          </div>
        </div>
      )}
      {!open && (
        <button
          className="rounded-full w-12 h-12 flex items-center justify-center bg-primary self-end"
          onClick={() => setOpen(true)}
        >
          {unread ? <MessageIconUnread /> : <MessageIcon />}
        </button>
      )}
    </div>
  );
};

export default AIAgent;
