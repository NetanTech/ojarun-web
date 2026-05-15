"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";


const reasons = [
  {
    title: "Freshness You Can Trust",
    description:
      "Every item is selected in real time from the market and inspected by trained agents using clear quality standards.",
    image: "/assets/whyUs1.png",
    alt: "Agent inspecting fresh produce at the market",
  },
  {
    title: "Real Market Prices, No Guesswork",
    description:
      "Prices reflect what's happening in the market, and are updated regularly so you're not overpaying.",
    image: "/assets/whyUs2.png",
    alt: "Shopper checking prices in a supermarket",
  },
  {
    title: "Reliable From Start to Finish",
    description:
      "Agents follow clear workflows, and riders deliver with structure so your order arrives complete and on time.",
    image: "/assets/whyUs3.png",
    alt: "Delivery rider picking groceries in store",
  },
];

export default function WhyUs() {
  return (
    <section className="relative z-20 -mt-28 w-full px-6 sm:-mt-36 sm:px-15">
      {/* Card — Figma: 1320×646, padding 60/40, rounded-3xl, bg yellow-100, gap 10 between children */}
      <motion.div
        variants={stagger(0.12, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto flex w-full max-w-330 flex-col gap-2.5 rounded-3xl bg-accent px-6 py-15 sm:px-10"
      >
        {/* Heading */}
        <motion.div variants={fadeUp} className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Why choose us
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Ojarun makes your shopping life hassle free
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={stagger(0.12, 0)}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={fadeUp}
              className="flex flex-col overflow-hidden rounded-2xl bg-primary pb-5"
            >
              {/* Text block */}
              <div className="px-5 pt-5 pb-4">
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/60">
                  {reason.description}
                </p>
              </div>

              {/* Image — fills the bottom of the card */}
              <div className="relative mt-auto w-full aspect-[4/3] px-5 pb-5">
                <Image
                  src={reason.image}
                  alt={reason.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain object-center"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}