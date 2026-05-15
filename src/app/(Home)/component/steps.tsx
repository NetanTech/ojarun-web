"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LeftImgBg, RightImgBg } from "../../../../public/svg/svg";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

type Section = {
  id: string;
  tab: string;
  heading: string;
  body: string;
  cta: string;
  image: string;
  alt: string;
  reverse?: boolean;
};

const sections: Section[] = [
  {
    id: "customer",
    tab: "Customer",
    heading: "Market Shopping Made Simple for you",
    body: "Order fresh food and market items without leaving your home or workplace. From weekly household shopping to ingredients for a specific meal, Ojarun helps you shop faster, avoid market stress, and receive quality items sourced directly from trusted local markets.",
    cta: "Get started",
    image: "/assets/StepImg1.png",
    alt: "Woman shopping with a cart at the market",
  },
  {
    id: "agent",
    tab: "Agent",
    heading: "The People Behind Every Fresh Order",
    body: "Ojarun agents are trained market operatives who source, inspect, and pack customer orders with care. They understand local markets, pricing, freshness standards, and market language — ensuring every customer receives items they can trust.",
    cta: "Become an agent",
    image: "/assets/StepImg2.png",
    alt: "Agent holding grocery bag",
    reverse: true,
  },
  {
    id: "rider",
    tab: "Rider",
    heading: "Reliable Delivery From Market to Doorstep",
    body: "Riders handle the final step of the Ojarun experience by delivering orders quickly and efficiently to customers. With clear delivery information, structured routes, and real-time updates, they help ensure every order arrives safely and on time.",
    cta: "Become a rider",
    image: "/assets/StepImg3.png",
    alt: "Rider delivering groceries",
  },
];

export default function Steps() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Scroll-spy: update active tab as sections enter viewport
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Click tab → smooth scroll to section (offset by main header + tab bar)
  const scrollToSection = (index: number) => {
    const el = sectionRefs.current[index];
    if (!el) return;
    const tabHeight = tabsRef.current?.offsetHeight ?? 64;
    const headerHeight =
      document.querySelector("header")?.getBoundingClientRect().height ?? 80;
    const top =
      el.getBoundingClientRect().top + window.scrollY - tabHeight - headerHeight - 24;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="w-full pt-16">
      {/* ── Sticky Tab Bar (sits under the fixed main header) ── */}
      <div
        ref={tabsRef}
        className="sticky top-20 sm:top-24 z-40 flex justify-center py-4 bg-white/80 backdrop-blur-md"
      >
        <div className="flex items-center gap-1 rounded-full bg-[#f2ebc0] p-1.5">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(i)}
              className={`rounded-full px-8 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeIndex === i
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {s.tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 flex flex-col gap-24 py-20">
        {sections.map((s, i) => (
          <motion.div
            key={s.id}
            id={s.id}
            ref={(el) => { sectionRefs.current[i] = el; }}
            variants={stagger(0.15, 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className={`flex flex-col items-center gap-10 md:flex-row md:gap-16 ${
              s.reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Text */}
            <motion.div variants={fadeUp} className="flex-1">
              <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
                {s.heading}
              </h2>
              <p className="mt-5 text-sm sm:text-base leading-relaxed text-gray-500 max-w-md">
                {s.body}
              </p>
              <button className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-primary px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-90 cursor-pointer">
                {s.cta}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </motion.div>

            {/* Image Card */}
            <motion.div variants={fadeUp} className="flex-1 w-full relative">
              {/* Decorative cream + green backing sheet — shorter than the photo,
                  anchored low so it peeks out below it */}
              {s.reverse ? (
                <RightImgBg
                  aria-hidden
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-x-0 -bottom-[8%] h-[95%] w-full"
                />
              ) : (
                <LeftImgBg
                  aria-hidden
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-x-0 -bottom-[8%] h-[95%] w-full"
                />
              )}
              {/* Photo — sits on the flat top of the sheet, narrower than it */}
              <div className="relative z-10 mx-auto aspect-[4/3] w-[88%] overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}