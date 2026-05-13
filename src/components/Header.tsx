"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo, WhatsAppIcon } from "../../public/svg/svg";

const navLinks = ["Agents", "Riders", "FAQs", "About", "Contact us"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-primary/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex py-4 w-full max-w-[1200px] items-center px-6">

        {/* Left — Logo */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            aria-label="Ojarun home"
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <Logo className="h-12 w-auto sm:h-16" />
          </Link>
        </div>

        {/* Center — Nav links (desktop only) */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-medium text-white/80">
            {navLinks.map((link) => (
              <li key={link}>
                <Link
                  href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="relative inline-block py-1 transition-colors duration-200 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right — CTA (desktop) + Hamburger (mobile) */}
        <div className="flex flex-1 justify-end items-center gap-3">
          {/* CTA — hidden on mobile */}
          <a
            href="https://wa.me/YOURNUMBER"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-[10px] border border-white/40 bg-background px-4 py-2.5 text-sm font-medium text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:shadow-md active:translate-y-0"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" />
            Get started
          </a>

          {/* Hamburger — visible on mobile only */}
          <button
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
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
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

          {/* CTA inside mobile menu */}
          <a
            href="https://wa.me/YOURNUMBER"
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