import Image from "next/image";
import { HeroLeft, HeroRight } from "../../../../public/svg/svg";

export default function AboutHero() {
  return (
    <section className="relative w-full">
      {/* Green background — responsive height, curved bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-100 sm:h-125 lg:h-151.25 overflow-hidden bg-primary rounded-bl-[50%_24px] rounded-br-[50%_24px] sm:rounded-bl-[50%_50px] sm:rounded-br-[50%_50px]">
        {/* Gradient strip overlay across the top (behind the fixed header) */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-22 bg-[linear-gradient(90deg,rgba(51,110,71,0)_12.98%,rgba(51,110,71,0.2)_50%,rgba(51,110,71,0)_85.58%)]"
        />

        {/* Left & right zigzag decorations — hidden on mobile (too large), shown sm+ */}
        <HeroLeft
          aria-hidden
          className="hidden sm:block absolute -left-2 -top-42 z-0 w-145 h-140 rotate-180"
        />
        <HeroRight
          aria-hidden
          className="hidden sm:block absolute -right-6 -top-20 z-0 w-145 h-140"
        />
      </div>

      {/* Hero text — Figma: width 704, top 148, gap 16 between children */}
      <div className="relative z-10 mx-auto flex w-full max-w-176 flex-col items-center gap-4 px-6 sm:px-0 pt-32 sm:pt-37 text-center">
        <span className="inline-flex items-center rounded-full border border-[#E6EDE8] px-3 py-1.5 text-sm leading-5 tracking-[-0.02em] text-[#E9E9E9] sm:text-base sm:leading-6">
          About us
        </span>

        <h1 className="font-semibold text-white text-[32px] leading-10 sm:text-[46px] sm:leading-16 sm:whitespace-nowrap">
          Reimagining How Nigeria Shops <br /> for Fresh Food
        </h1>

        <p className="text-sm leading-5 tracking-[-0.02em] text-[#E9E9E9] sm:text-base sm:leading-6">
          Ojarun exists to make market shopping easier, more reliable, and more
          accessible by connecting people to fresh food sourced directly from
          trusted local markets and delivered to their doorstep.
        </p>
      </div>

      {/* Hero image — responsive height. Desktop: 535px per Figma */}
      <div className="relative z-10 mx-auto mt-8 sm:mt-10 w-full max-w-310 px-6">
        <div className="relative h-60 sm:h-100 lg:h-133.75 w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-primary/10">
          <Image
            src="/assets/about-hero.png"
            alt="Woman shopping for fresh tomatoes at a local market"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1240px"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
