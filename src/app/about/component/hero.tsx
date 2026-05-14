import Image from "next/image";
import { HeroLeft, HeroRight } from "../../../../public/svg/svg";

export default function AboutHero() {
  return (
    <section className="relative w-full">
      {/* Green background — exactly 605px tall per spec, with a curved bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-151.25 overflow-hidden bg-primary rounded-bl-[50%_50px] rounded-br-[50%_50px]">
        {/* Gradient strip overlay across the top (behind the fixed header) */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-22 bg-[linear-gradient(90deg,rgba(51,110,71,0)_12.98%,rgba(51,110,71,0.2)_50%,rgba(51,110,71,0)_85.58%)]"
        />

        {/* Left & right zigzag decorations — Figma Layer_1: 556.57×520.59, opacity 0.6 */}
        <HeroLeft
          aria-hidden
          className="absolute -left-2 -top-42 z-0 w-145 h-140 rotate-180"
        />
        <HeroRight
          aria-hidden
          className="absolute -right-6 -top-20 z-0 w-145 h-140"
        />
      </div>

      {/* Hero text — Figma: width 704, top 148, gap 16 between children */}
      <div className="relative z-10 mx-auto flex w-full max-w-176 flex-col items-center gap-4 px-6 sm:px-0 pt-37 text-center">
        <span className="inline-flex items-center rounded-full border border-[#E6EDE8] px-3 py-1.5 text-base leading-6 tracking-[-0.02em] text-[#E9E9E9]">
          About us
        </span>

        <h1 className="font-semibold text-white text-[40px] leading-12 sm:text-[46px] sm:leading-16 sm:whitespace-nowrap">
          Reimagining How Nigeria Shops <br /> for Fresh Food
        </h1>

        <p className="text-base leading-6 tracking-[-0.02em] text-[#E9E9E9]">
          Ojarun exists to make market shopping easier, more reliable, and more
          accessible by connecting people to fresh food sourced directly from
          trusted local markets and delivered to their doorstep.
        </p>
      </div>

      {/* Hero image — Figma: 1240×535, top 432, rounded-24, overflows past green */}
      <div className="relative z-10 mx-auto mt-10 w-full max-w-310 px-6">
        <div className="relative h-133.75 w-full overflow-hidden rounded-3xl bg-primary/10">
          <Image
            src="/assets/about-hero.png"
            alt="Woman shopping for fresh tomatoes at a local market"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
