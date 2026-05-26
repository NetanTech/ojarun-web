"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeroBackdrop, HeroTop, HeroBottom, HeroLeft, HeroRight } from "../../../../../public/svg/svg";
import { fadeUp, stagger } from "@/lib/motion";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire to API
    console.log("Contact form submitted", form);
  };

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
        className="relative z-10 mx-auto max-w-[1100px] grid grid-cols-1 gap-12 md:grid-cols-[40fr_60fr] md:gap-16"
      >
        {/* ── Left: Heading + description ── */}
        <motion.div variants={fadeUp} className="flex flex-col">
          <span className="inline-flex w-fit items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80">
            Contact us
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
            Contact us
          </h1>
          <p className="mt-4 max-w-sm text-sm sm:text-base leading-relaxed text-white/60">
            If you have a question, concern, or need assistance, please
            don&apos;t hesitate to reach out or fill out the form and
            we&apos;ll respond as soon as possible.
          </p>
        </motion.div>

        {/* ── Right: Form ── */}
        <motion.form
          variants={stagger(0.08, 0)}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <motion.input
            variants={fadeUp}
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={update("name")}
            className="rounded-xl border border-white/20 bg-white px-4 py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
          />

          <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="email"
              required
              placeholder="Email Address"
              value={form.email}
              onChange={update("email")}
              className="rounded-xl border border-white/20 bg-white px-4 py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
            />
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={form.phone}
              onChange={update("phone")}
              className="rounded-xl border border-white/20 bg-white px-4 py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
            />
          </motion.div>

          <motion.textarea
            variants={fadeUp}
            required
            placeholder="Message"
            rows={6}
            value={form.message}
            onChange={update("message")}
            className="resize-none rounded-xl border border-white/20 bg-white px-4 py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
          />

          <motion.button
            variants={fadeUp}
            type="submit"
            className="mt-2 inline-flex w-fit items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-medium text-primary transition hover:bg-accent cursor-pointer"
          >
            Leave us a message
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  );
}
