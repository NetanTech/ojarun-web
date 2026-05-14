"use client";

import Image from "next/image";
import { WhatsAppIcon } from "../../public/svg/svg";

type SubFooterProps = {
  className?: string;
};

export default function SubFooter({ className = "" }: SubFooterProps) {
  return (
    <section
      className={`w-full px-4 sm:px-8 py-10 pb-0 mb-[-50px] relative z-10 ${className}`}
    >
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl bg-accent">

        <div className="relative flex flex-col items-center gap-8 px-10 py-14 md:grid md:grid-cols-[55fr_45fr] md:items-center md:gap-8">
          {/* ── Left: Text ── */}
          <div className="w-full">
            <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900 max-w-[500px]">
              Skip the Market And Get the{" "}
              <span className="text-gray-900">Fresh Items With Ease</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-500">
              Let us handle the sourcing for your kitchen, home or business,
              while you focus on your day.
            </p>
            <a
              href="https://wa.me/YOURNUMBER"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-[#1a3c2e] px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Get started on whatsApp
            </a>
          </div>

          {/* ── Right: Illustration ── */}
          <div className="flex w-full justify-center items-end relative min-h-[260px] bg-[url('/assets/subfooterbg.png')] bg-cover bg-no-repeat bg-bottom">
            <Image
              src="/assets/Groceries.png"
              alt="Grocery bag with fresh market items"
              width={280}
              height={200}
              className="max-w-full h-auto object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
