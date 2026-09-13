"use client";

import { motion } from "framer-motion";
import { HeroBackdrop, HeroTop } from "../../../../../public/svg/svg";
import { fadeUp, stagger } from "@/lib/motion";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-8 pt-40 pb-40">
      {/* Solid green background with a single smooth bottom curve */}
      <HeroBackdrop
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />
      {/* Decorative arc SVGs — non-interactive, z-0 (behind the z-10 content) */}
      <HeroTop
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-auto w-full"
      />


      <motion.div
        variants={stagger(0.1, 0.15)}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-[1200px] md:gap-16 text-center"
      >
  
        <motion.div variants={fadeUp} className="w-full">
         
          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
            Privacy Policy
          </h1>
          <p className="mt-4  text-sm sm:text-base leading-relaxed text-white/60">
            Last updated on May 15, 2026.
          </p>
        </motion.div>

      
      </motion.div>
    </section>
  );
}
