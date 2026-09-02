"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Logo, WhatsAppIcon } from "../../public/svg/svg";
import { EASE } from "@/lib/motion";

const navLinks = ["Agents", "Riders", "FAQs", "About", "Contact us"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrance animation helpers
  const fadeFromTop = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: -12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: EASE },
  });
  const fade = (delay: number) => ({
    initial: reduced ? false : { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, delay, ease: EASE },
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-primary/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex py-4 w-full max-w-[1200px] items-center px-6">

        {/* Left — Logo */}
        <motion.div
          {...fade(0.1)}
          className="flex flex-1 items-center"
        >
          <Link
            href="/"
            aria-label="Ojarun home"
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <Logo className="h-12 w-auto sm:h-16" />
          </Link>
        </motion.div>

        {/* Center — Nav links (desktop only) */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-medium text-white/80">
            {navLinks.map((link, i) => (
              <motion.li key={link} {...fadeFromTop(0.2 + i * 0.08)}>
                <Link
                  href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="relative inline-block py-1 transition-colors duration-200 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Right — CTA (desktop) + Hamburger (mobile) */}
        <div className="flex flex-1 justify-end items-center gap-3">
          {/* Log in — hidden on mobile */}
          <motion.div {...fade(0.2 + navLinks.length * 0.08)} className="hidden md:block">
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white"
            >
              Log in
            </Link>
          </motion.div>

          {/* CTA — hidden on mobile */}
          <motion.a
            {...fade(0.25 + navLinks.length * 0.08)}
            href="https://wa.me/2348025957234"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-[10px] border border-white/40 bg-background px-4 py-2.5 text-sm font-medium text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:shadow-md active:translate-y-0"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" />
            Get started
          </motion.a>

          {/* Hamburger — visible on mobile only */}
          <motion.button
            {...fade(0.3)}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9 rounded-md border border-white/20 transition-colors hover:bg-white/10"
          >
            <span
              className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden bg-primary/80 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="px-6 pb-5 pt-1">
          <ul className="flex flex-col gap-1 text-sm font-medium text-white/80">
            {navLinks.map((link) => (
              <li key={link}>
                <Link
                  href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 border-b border-white/10 hover:text-white transition-colors duration-200"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>

          {/* Log in inside mobile menu */}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="block py-2.5 border-b border-white/10 hover:text-white transition-colors duration-200"
          >
            Log in
          </Link>

          {/* CTA inside mobile menu */}
          <a
            href="https://wa.me/2348025957234"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-white/40 bg-background px-4 py-2.5 text-sm font-medium text-primary shadow-sm transition-all duration-200 hover:bg-accent"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" />
            Get started
          </a>
        </nav>
      </div>
    </header>
  );
}