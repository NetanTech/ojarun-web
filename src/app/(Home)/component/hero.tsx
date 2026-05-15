"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { WhatsAppIcon } from "../../../../public/svg/svg";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const reduced = useReducedMotion();
  const hidden = reduced ? false : { opacity: 0, y: 24 };
  const shown = { opacity: 1, y: 0 };

  return (
    <section className="relative w-full overflow-hidden pt-32 pb-44 sm:pt-48 sm:pb-52">

      {/* Text block */}
      <div className="relative z-10 mx-auto flex max-w-[550px] flex-col items-center px-6 text-center ">
        {/* H1 — Figma: 550×128, DM Sans 600, 56/64, center */}
        <motion.h1
          initial={hidden}
          animate={shown}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="font-semibold text-white text-[32px] leading-10 sm:text-[56px] sm:leading-16 sm:whitespace-nowrap"
        >
          Bringing the Market to
          <br />
          Your Doorstep
        </motion.h1>
        {/* Subtitle — Figma: 506×48, DM Sans 400, 16/24, -2%, center */}
        <motion.p
          initial={hidden}
          animate={shown}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          className="mt-4 max-w-126.5 text-base leading-6 tracking-[-0.02em] text-white/60"
        >
          Fresh food from local markets, sourced by trained agents and delivered
          to you without the stress, time, or guesswork.
        </motion.p>

        <motion.a
          initial={hidden}
          animate={shown}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          href="https://wa.me/YOURNUMBER"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[10px] border border-white/40 bg-background px-4 py-2.5 mt-4 text-sm font-medium text-primary shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md active:translate-y-0"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          Get started
        </motion.a>
      </div>

      {/* Image strip — two side-by-side images with badge centered.
          Figma — combined: 895.69×334 | each image: 442.06×334 | badge: 157.9×154.78 */}
      <div className="relative z-10 mx-auto mt-10 sm:mt-12 flex w-full max-w-4xl items-stretch justify-center gap-3 px-6">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          animate={shown}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="relative h-60 w-full overflow-hidden rounded-2xl bg-primary p-1.5 sm:h-83.5 sm:p-2"
        >
          <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl">
            <Image
              src="/assets/hero1.png"
              alt="Agent handing over a grocery box"
              fill
              priority
              sizes="(max-width: 640px) 50vw, 442px"
              className="object-cover object-center"
            />
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          animate={shown}
          transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          className="relative h-60 w-full overflow-hidden rounded-2xl bg-primary p-1.5 sm:h-83.5 sm:p-2"
        >
          <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl">
            <Image
              src="/assets/hero2.png"
              alt="Delivery rider with fresh produce"
              fill
              priority
              sizes="(max-width: 640px) 50vw, 442px"
              className="object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Trust badge — centered between the two images. Figma: 157.9×154.78 */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.15, ease: EASE }}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <Image
            src="/assets/hero3.png"
            alt="Safe and secure badge"
            width={158}
            height={155}
            className="h-20 w-20 object-contain sm:h-38.75 sm:w-39.5"
          />
        </motion.div>
      </div>
    </section>
  );
}
