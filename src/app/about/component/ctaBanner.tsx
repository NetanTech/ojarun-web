import Link from "next/link";
import Image from "next/image";

export default function CtaBanner() {
  return (
    <section className="w-full px-6 py-15">
      <div className="mx-auto w-full max-w-330">
        {/* Card — Figma: 1320×529, padding 60/90, rounded-3xl, bg yellow-100 */}
        <div className="relative flex flex-col items-center justify-between gap-10 overflow-hidden rounded-3xl bg-[#FFF2B8] px-8 py-15 sm:flex-row sm:px-22.5">
          {/* Decorative bg — sits only behind/around the groceries on the right side */}
          <Image
            src="/assets/subfooterbg.png"
            alt=""
            aria-hidden
            width={700}
            height={500}
            className="pointer-events-none absolute bottom-0 right-0 z-0 h-full w-[70%] object-contain object-right-bottom"
          />

          {/* Text + CTA — Figma: 506×232, gap 24 */}
          <div className="relative z-10 flex w-full max-w-[506px] flex-shrink-0 flex-col gap-6 text-center sm:text-left">
            {/* Heading — Figma: 506×88, DM Sans 600, 36/44, -2% */}
            <h2 className="text-[36px] font-semibold leading-11 tracking-[-0.02em] text-black">
              Skip the Market And Get the Fresh Items With Ease
            </h2>

            {/* Subtitle — DM Sans 400, 16/24, -2% */}
            <p className="text-base leading-6 tracking-[-0.02em] text-black/70">
              Let us handle the sourcing for your kitchen, home or business,
              while you focus on your day.
            </p>

            {/* Get started button — Figma: 132×48, padding 12/24, radius 8 */}
            <Link
              href="/"
              className="inline-flex items-center justify-center self-center rounded-lg bg-primary px-6 py-3 text-base font-medium leading-6 tracking-[-0.02em] text-white sm:self-start"
            >
              Get started
            </Link>
          </div>

          {/* Groceries illustration — drop PNG at /assets/groceries.png */}
          <div className="relative z-10 h-70 w-full max-w-100 sm:h-85">
            <Image
              src="/assets/groceries.png"
              alt="Bag of fresh groceries"
              fill
              className="object-contain object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
