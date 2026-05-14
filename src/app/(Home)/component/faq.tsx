"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Are the prices the same as the market?",
    answer:
      "Yes. Prices reflect real market rates, updated regularly to stay fair and transparent.",
  },
  {
    question: "How do I know the items will be fresh?",
    answer:
      "Every item is inspected by a trained Ojarun agent at the market using clear freshness standards before it's packed for delivery.",
  },
  {
    question: "What happens if something is unavailable?",
    answer:
      "If an item isn't available or doesn't meet our quality standard, your agent will flag it and handle it based on your stated preferences — substitution or removal.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times vary by location, but most orders are fulfilled and delivered within a few hours of placement during operating hours.",
  },
  {
    question: "Which markets do we pick up from?",
    answer:
      "We source from a network of trusted local markets. The specific market depends on your location and the items in your order.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative w-full overflow-hidden bg-white py-20 px-4">

      {/* Decorative grocery bag — Figma: 193×249, angle 23.81°. Sits beside FAQ accordion on the left, lower portion */}
      <div className="pointer-events-none absolute bottom-0 left-4 hidden sm:left-8 lg:left-18 lg:block">
        <Image
          src="/assets/groceries-bag-left.png"
          alt=""
          width={280}
          height={361}
          className="h-auto w-72 object-contain"
        />
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
      </div>

      {/* Accordion container */}
      <div className="relative z-10 mx-auto max-w-3xl rounded-2xl bg-primary overflow-hidden divide-y divide-gray-100 p-2 pb-0">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="bg-white mb-2 rounded-lg ">
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left cursor-pointer mb-2"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-semibold text-gray-800">
                  {faq.question}
                </span>
                <span
                  className={`ml-4 shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                </span>
              </button>

              {/* Answer — animated expand */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* Answer — Figma: 751×24, DM Sans 400, 16/24, -2%, #242424 */}
                <p className="px-6 pb-5 text-base leading-6 tracking-[-0.02em] text-[#242424]">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}