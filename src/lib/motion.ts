import type { Variants } from "framer-motion";

// Soft quint-out: long graceful tail, no perceptible snap at the end.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 1.5, ease: EASE } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.3, ease: EASE } },
};

export const stagger = (
  staggerChildren = 0.09,
  delayChildren = 0.05,
): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

// Reveal a little earlier than default (10% visible) so motion finishes before
// the user has fully scrolled past the section.
export const viewportOnce = { once: true, amount: 0.15 } as const;
