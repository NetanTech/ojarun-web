import Hero from "./hero";
import { HeroTop, HeroBottom, HeroLeft, HeroRight } from "../../../../public/svg/svg";

export default function HeroFull() {
  return (
  <div className="relative overflow-hidden bg-[url('/assets/herobg.png')] bg-cover bg-bottom">
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
        className="pointer-events-none absolute left-[7%] top-[25%] z-0 -translate-y-1/2"
      />
      <HeroRight
        aria-hidden
        className="pointer-events-none absolute right-[7%] top-[25%] z-0 -translate-y-1/2"
      />

      <div className="relative z-10">
        <Hero />
      </div>
    </div>
  );
}
