"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { WhatsAppIcon } from "../../public/svg/svg";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function SubFooter({ className = "" }: { className?: string }) {
  return (
    <section className={`relative z-20 -mb-27.5 w-full px-6 py-15 ${className}`}>
      <div className="mx-auto w-full max-w-330">
        {/* Card — Figma: 1320×529, padding 60/90, rounded-3xl, bg yellow-100 */}
        <motion.div
          variants={stagger(0.12, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative flex flex-col items-center justify-between gap-10 overflow-hidden rounded-3xl bg-[#FFF2B8] px-8 py-15 sm:flex-row sm:px-22.5"
        >
          {/* Decorative bgd — sits only behind/around the groceries on the right side */}
          <Image
            src="/assets/subfooterbg.png"
            alt=""
            aria-hidden
            width={700}
            height={500}
            className="pointer-events-none absolute bottom-0 right-0 z-0 h-full w-[80%] object-contain object-bottom-right"
          />

          {/* Text + CTA — Figma: 506×232, gap 24 */}
          <motion.div variants={fadeUp} className="relative z-10 flex w-full max-w-126.5 shrink-0 flex-col gap-5 text-center sm:gap-6 sm:text-left">
            {/* Heading — Figma: 506×88, DM Sans 600, 36/44, -2% */}
            <h2 className="text-2xl font-semibold leading-8 tracking-[-0.02em] text-black sm:text-[36px] sm:leading-11">
              Skip the Market And Get the Fresh Items With Ease
            </h2>

            {/* Subtitle — DM Sans 400, 16/24, -2% */}
            <p className="text-sm leading-5 tracking-[-0.02em] text-black/70 sm:text-base sm:leading-6">
              Let us handle the sourcing for your kitchen, home or business,
              while you focus on your day.
            </p>

            {/* Get started button — Figma: padding 12/24, radius 8 */}
            <Link
              href="https://wa.me/YOURNUMBER"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 self-center rounded-lg bg-primary px-6 py-3 text-base font-medium leading-6 tracking-[-0.02em] text-white sm:self-start"
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
              Get started on WhatsApp
            </Link>
          </motion.div>

          {/* Groceries illustration — /assets/Groceries.png */}
          <motion.div variants={fadeUp} className="relative z-10 h-60 w-full max-w-100 sm:h-85">
            <Image
              src="/assets/Groceries.png"
              alt="Bag of fresh groceries"
              fill
              sizes="(max-width: 640px) 90vw, 400px"
              className="object-contain object-center"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
