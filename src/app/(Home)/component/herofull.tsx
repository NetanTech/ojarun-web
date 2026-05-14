import Hero from "./hero";
import { HeroBackdrop, HeroTop, HeroBottom, HeroLeft, HeroRight } from "../../../../public/svg/svg";

export default function HeroFull() {
  return (
  <div className="relative overflow-hidden">
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
      <HeroBottom
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-40 z-0 h-auto w-full"
      />
      <HeroLeft
        aria-hidden
        className="pointer-events-none hidden sm:block absolute -left-2 -top-42 z-0 w-145 h-140 rotate-180"
      />
      <HeroRight
        aria-hidden
        className="pointer-events-none hidden sm:block absolute -right-6 -top-20 z-0 w-145 h-140"
      />

      <div className="relative z-10">
        <Hero />
      </div>
    </div>
  );
}
