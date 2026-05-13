import Image from "next/image";
import { WhatsAppIcon } from "../../../../public/svg/svg";

export default function Hero() {
  return (
    <section className="relative w-full pb-0 h-[110vh]  flex flex-col items-center justify-top pt-[12rem] overflow-hidden">

      {/* Text block */}
      <div className="relative z-10 mx-auto flex max-w-[500px] flex-col items-center px-6 text-center ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white">
          Bringing the Market to
          <br />
          Your Doorstep
        </h1>
        <p className="mt-4 max-w-[400px] text-sm sm:text-base leading-relaxed text-white/60">
          Fresh food from local markets, sourced by trained agents and delivered
          to you without the stress, time, or guesswork.
        </p>
          
          <a
            href="https://wa.me/YOURNUMBER"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[10px] border border-white/40 bg-background px-4 py-2.5 mt-4 text-sm font-medium text-primary shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md active:translate-y-0"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" />
            Get started
          </a>
        
      </div>

      {/* Image strip */}
      <div className="relative z-10 mx-auto mt-8 flex w-full max-w-5xl items-end justify-end gap-2 px-6">
        
        <div className="relative h-full w-full overflow-hidden rounded-2xl min-h-64 sm:h-96 ">
          <Image
            src="/assets/hero1.png"
            alt="Agent handing over a grocery box"
            fill
            priority
            className="object-cover object-center bg-primary p-2 rounded-2xl"
          />
        </div>

        {/* Trust badge */}
        <div className="absolute bottom-25 left-1/2 z-20 -translate-x-1/2">
          <Image
            src="/assets/hero3.png"
            alt="Agent handing over a grocery box"
            width={80}
            height={80}
            className="w-auto h-auto object-contain "
          />
        </div>

        <div className="relative h-full w-full overflow-hidden rounded-2xl min-h-64 sm:h-96">
          <Image
            src="/assets/hero2.png"
            alt="Delivery rider with fresh produce"
            fill
            priority
            className="object-cover object-top bg-primary p-2 rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}

function TrustBadge() {
  return (
    <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-[3px] border-white/80 bg-[#1a5c30] text-center shadow-xl">
      <svg xmlns="http://www.w3.org/2000/svg" className="mb-0.5 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2 20h2a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H2v9zm19.83-7.12A2 2 0 0 0 20 10h-5l.95-4.57.03-.32a1.5 1.5 0 0 0-.44-1.06L14 3l-6.59 6.59A2 2 0 0 0 7 11v7a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3-7.28c.09-.23.16-.47.16-.72v-1.78l-.01-.01A2 2 0 0 0 21.83 12.88z" />
      </svg>
      <span className="text-[7.5px] font-bold uppercase leading-tight tracking-wide text-white">
        Trusted<br />Service<br />Always
      </span>
    </div>
  );
}

