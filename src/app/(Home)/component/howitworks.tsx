import { Phone, Basket, Car } from "../../../../public/svg/svg";


type Step = {
  icon: React.ReactNode;
  title: string;
  description: string[];
};

const steps: Step[] = [
  {
    icon: <Phone className="w-12 h-12" />,
    title: "Place Your Order",
    description: [
      "Search for individual items or simply type what you want to cook.",
      "We provide a complete ingredient list in familiar market quantities, so you don't have to figure out what to buy or how much.",
    ],
  },
  {
    icon: <Basket className="w-12 h-12" />,
    title: "We Source It",
    description: [
      "A trained Ojarun agent goes to the market on your behalf, selects each item, and checks for freshness, quality, and correct quantity.",
      "If something isn't available or doesn't meet standard, it's flagged and handled based on your preferences.",
    ],
  },
  {
    icon: <Car className="w-12 h-12" />,
    title: "Packed & Delivered",
    description: [
      "Your items are carefully packed to preserve freshness and prevent damage, then handed over to a rider for delivery.",
      "You receive updates along the way, so you always know the status of your order until it gets to your doorstep.",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full px-4 sm:px-8 py-16">
      <div className="mx-auto max-w-[1100px] rounded-3xl bg-primary p-8 sm:p-12 border-2 border-dashed border-white/20">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/60">
            Simple from Start to Delivery
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:divide-x sm:divide-white/15">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 sm:px-8 first:pl-0 last:pr-0"
            >
              {/* Icon */}
              <div>{step.icon}</div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {step.title}
              </h3>

              {/* Description paragraphs */}
              <div className="flex flex-col gap-2">
                {step.description.map((para, j) => (
                  <p key={j} className="text-sm sm:text-base leading-relaxed text-white/60">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}