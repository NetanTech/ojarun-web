"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function MissionVision() {
  return (
    <section className="w-full">
      {/* Figma: 1240×272, top 1007, left 100 (so 100px gutter each side), pt 60, pb 40, gap 24 between cards */}
      <motion.div
        variants={stagger(0.12, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto flex w-full max-w-310 flex-col gap-6 px-6 pt-15 pb-10 sm:flex-row sm:px-0 sm:pt-25"
      >
        {/* Our Mission — dark green card */}
        <motion.div variants={fadeUp} className="flex flex-1 flex-col gap-2.5 rounded-3xl bg-primary p-6">
          <h2 className="text-xl font-semibold text-white">Our Mission</h2>
          <p className="text-base leading-6 tracking-[-0.02em] text-white/70">
            To simplify everyday food shopping by combining trusted human
            sourcing with technology, making it easier for people to access
            fresh, affordable market goods without the stress of going to the
            market themselves.
          </p>
        </motion.div>

        {/* Our Vision — yellow card */}
        <motion.div variants={fadeUp} className="flex flex-1 flex-col gap-2.5 rounded-3xl bg-[#FFF2B8] p-6">
          <h2 className="text-xl font-semibold text-black">Our Vision</h2>
          <p className="text-base leading-6 tracking-[-0.02em] text-black/70">
            To become Africa&apos;s most trusted platform for accessing fresh
            food from local markets while preserving the authenticity, culture,
            and quality of traditional market shopping.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
