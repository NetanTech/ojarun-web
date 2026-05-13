import Image from "next/image";



const reasons = [
  {
    title: "Freshness You Can Trust",
    description:
      "Every item is selected in real time from the market and inspected by trained agents using clear quality standards.",
    image: "/assets/whyUs1.png",
    alt: "Agent inspecting fresh produce at the market",
  },
  {
    title: "Real Market Prices, No Guesswork",
    description:
      "Prices reflect what's happening in the market, and are updated regularly so you're not overpaying.",
    image: "/assets/whyUs2.png",
    alt: "Shopper checking prices in a supermarket",
  },
  {
    title: "Reliable From Start to Finish",
    description:
      "Agents follow clear workflows, and riders deliver with structure so your order arrives complete and on time.",
    image: "/assets/whyUs3.png",
    alt: "Delivery rider picking groceries in store",
  },
];

export default function WhyUs() {
  return (
    <section className="w-[90%] m-auto max-w-[1200px] rounded-4xl bg-accent py-14 px-4 sm:px-16 mt-[-120px] relative z-20">
      

        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Why choose us
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Ojarun makes your shopping life hassle free
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col overflow-hidden rounded-2xl bg-primary pb-5"
            >
              {/* Text block */}
              <div className="px-5 pt-5 pb-4">
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/60">
                  {reason.description}
                </p>
              </div>

              {/* Image — fills the bottom of the card */}
              <div className="relative mt-auto w-full aspect-[4/3] px-5 pb-5">
                <Image
                  src={reason.image}
                  alt={reason.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain object-center"
                />
              </div>
            </div>
          ))}
        </div>

    </section>
  );
}