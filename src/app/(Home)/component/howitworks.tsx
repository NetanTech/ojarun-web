"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Basket, Car } from "../../../../public/svg/svg";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";


type Step = {
  icon: React.ReactNode;
  title: string;
  description: string[];
};

const steps: Step[] = [
  {
    icon: <Phone className="w-12 h-12" />,
    title: "Place Your Order",
    description: [
      "Search for individual items or simply type what you want to cook.",
      "We provide a complete ingredient list in familiar market quantities, so you don't have to figure out what to buy or how much.",
    ],
  },
  {
    icon: <Basket className="w-12 h-12" />,
    title: "We Source It",
    description: [
      "A trained Ojarun agent goes to the market on your behalf, selects each item, and checks for freshness, quality, and correct quantity.",
      "If something isn't available or doesn't meet standard, it's flagged and handled based on your preferences.",
    ],
  },
  {
    icon: <Car className="w-12 h-12" />,
    title: "Packed & Delivered",
    description: [
      "Your items are carefully packed to preserve freshness and prevent damage, then handed over to a rider for delivery.",
      "You receive updates along the way, so you always know the status of your order until it gets to your doorstep.",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="relative w-full px-6 py-12 sm:px-15">
    

      {/* Card — Figma: 1320×509, padding 60/40, rounded-3xl, bg primary, gap 10 between children */}
      <motion.div
        variants={stagger(0.12, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative mx-auto flex w-full max-w-330 flex-col gap-2.5 rounded-3xl bg-primary px-6 py-15 sm:px-10"
      >

        {/* Heading */}
        <motion.div variants={fadeUp} className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/60">
            Simple from Start to Delivery
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={stagger(0.12, 0)}
          className="grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col gap-4">
              {/* Icon */}
              <div>{step.icon}</div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {step.title}
              </h3>

              {/* Description paragraphs */}
              <div className="flex flex-col gap-2">
                {step.description.map((para, j) => (
                  <p
                    key={j}
                    className="text-sm leading-relaxed tracking-[-0.02em] text-white/60 sm:text-base"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}