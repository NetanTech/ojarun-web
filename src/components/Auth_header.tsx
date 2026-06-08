"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { GreenLogo } from "../../public/svg/svg";
import { EASE } from "@/lib/motion";

export default function Auth_header() {
  const reduced = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduced ? false : { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, delay, ease: EASE },
  });

  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-[1200px] items-center px-6 py-4">
        <motion.div {...fade(0.1)} className="flex flex-1 items-center">
          <Link
            href="/"
            aria-label="Ojarun home"
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <GreenLogo className="h-12 w-auto sm:h-16" />
          </Link>
        </motion.div>
      </div>
    </header>
  );
}