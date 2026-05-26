"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

type Section = {
  id: string;
  title: string;
  intro?: string;
  blocks?: Array<
    | { type: "paragraph"; text: string }
    | { type: "list"; items: string[] }
    | { type: "subheading"; text: string }
    | { type: "note"; text: string }
  >;
};

const sections: Section[] = [
  {
    id: "acceptance",
    title: "Acceptance of These Terms of Service",
    blocks: [
      {
        type: "paragraph",
        text: "We go to the market so you don't have to. These Terms & Conditions explain how our service works, what you can expect from us, and what we need from you to make your market shopping effortless.",
      },
      {
        type: "paragraph",
        text: "By accessing or using Ojarun, you agree to be bound by these Terms.",
      },
    ],
  },
  {
    id: "what-is-ojarun",
    title: "1. What is Ojarun?",
    blocks: [
      {
        type: "paragraph",
        text: "Ojarun is a market-access platform that connects you with fresh foodstuffs from local Nigerian markets without you leaving your home or office.",
      },
      { type: "subheading", text: "How It Works" },
      {
        type: "list",
        items: [
          "You place your order via our app, website, or WhatsApp.",
          "Our trained Agents go to the local market (Bodija, Dugbe, Balogun, etc.).",
          "Agents hand-select fresh, quality items just like you would yourself.",
          "Items are inspected, packed, and prepared for delivery.",
          "Our Riders deliver your fresh groceries to your doorstep.",
          "You enjoy market-fresh food without the market stress!",
        ],
      },
    ],
  },
  {
    id: "how-to-order",
    title: "2. How to Order",
    blocks: [
      { type: "subheading", text: "2.1 Creating Your Account" },
      {
        type: "list",
        items: [
          "Provide your name, phone number, and delivery address.",
          "You must be 18 years or older.",
          "Keep your account information accurate and up-to-date.",
        ],
      },
      { type: "subheading", text: "2.2 Placing Orders" },
      {
        type: "list",
        items: [
          "Search for individual items OR use our Meal Templates (e.g., 'Egusi Soup' gives you a ready-to-order ingredient list).",
          "Add items to your cart with quantities in market language (e.g., 'per congo', 'per paint', 'per bunch').",
          "Review your order carefully before checkout.",
          "Provide clear delivery instructions and landmarks.",
          "Minimum order value applies (shown during checkout).",
        ],
      },
      { type: "subheading", text: "2.3 Ordering via WhatsApp" },
      {
        type: "list",
        items: [
          "Send 'Hi' or your shopping list to our WhatsApp number.",
          "We'll confirm your order and delivery details.",
          "You'll receive updates at every stage of your order.",
        ],
      },
    ],
  },
  {
    id: "pricing",
    title: "3. Pricing & Payments",
    blocks: [
      { type: "subheading", text: "3.1 How Pricing Works" },
      {
        type: "paragraph",
        text: "Your total order consists of:",
      },
      {
        type: "list",
        items: [
          "Market price of each item (we show 'Today's Market Prices' for transparency).",
          "Service fee (covers our Agent's time and expertise).",
          "Delivery fee (calculated based on the distance from the sourcing point to your address).",
        ],
      },
      {
        type: "paragraph",
        text: "Prices update daily based on market conditions. The price you see at checkout is the price you pay — no surprises.",
      },
      { type: "subheading", text: "3.2 Payment Methods" },
      {
        type: "list",
        items: [
          "Cash on Delivery (our default payment method when your order arrives).",
          "Bank Transfer on Delivery.",
          "Debit/Credit Card via Paystack or Flutterwave (secure payment).",
        ],
      },
      {
        type: "note",
        text: "For Cash on Delivery: Please have exact or close-to-exact change ready for our Riders.",
      },
    ],
  },
  {
    id: "delivery",
    title: "4. Delivery",
    blocks: [
      { type: "subheading", text: "4.1 Delivery Time" },
      {
        type: "list",
        items: [
          "Standard delivery: within 3 hours of order confirmation.",
          "Delivery times depend on traffic, market availability, and your location.",
        ],
      },
      {
        type: "paragraph",
        text: "You'll receive WhatsApp updates at every stage:",
      },
      {
        type: "list",
        items: [
          "Order Received",
          "Agent Sourcing at Market",
          "Packed & Dispatched",
          "Rider on the Way",
          "Delivered",
        ],
      },
      { type: "subheading", text: "4.2 Delivery Instructions" },
      {
        type: "list",
        items: [
          "Provide a clear address with a landmark (e.g., 'Blue gate opposite Shoprite').",
          "Ensure someone is available to receive the order.",
          "Our Rider will call if they can't find your address.",
        ],
      },
      { type: "subheading", text: "4.3 Failed Deliveries" },
      {
        type: "paragraph",
        text: "If delivery cannot be completed because:",
      },
      {
        type: "list",
        items: [
          "No one is available to receive.",
          "The address is incorrect or inaccessible.",
          "Payment is refused (for Cash on Delivery orders).",
        ],
      },
      {
        type: "paragraph",
        text: "You may be charged a re-delivery fee, or your order may be canceled.",
      },
    ],
  },
  {
    id: "quality",
    title: "5. Product Quality & Substitutions",
    blocks: [
      { type: "subheading", text: "5.1 Our Quality Promise" },
      {
        type: "list",
        items: [
          "Every item is hand-selected by trained Agents.",
          "Agents inspect for freshness before packing.",
          "We photograph items when necessary for quality documentation.",
          "We only deliver items that meet our quality standards.",
        ],
      },
      { type: "subheading", text: "5.2 What If an Item Isn't Available?" },
      {
        type: "paragraph",
        text: "If an item you ordered is out of stock or below the quality standard:",
      },
      {
        type: "list",
        items: [
          "Our Agent will WhatsApp you immediately.",
          "You can choose a substitute item, remove it, or accept it as-is.",
          "We'll never deliver poor-quality items without your approval.",
        ],
      },
      {
        type: "paragraph",
        text: "You can also set substitution preferences in your account (e.g., 'If fresh tomatoes are unavailable, use tinned').",
      },
    ],
  },
  {
    id: "cancellations",
    title: "6. Cancellations & Changes",
    blocks: [
      {
        type: "list",
        items: [
          "Before sourcing starts: We can add/remove items.",
          "During sourcing: Changes may not be possible.",
          "After dispatch: No changes allowed.",
        ],
      },
    ],
  },
  {
    id: "refunds",
    title: "7. Refunds & Complaints",
    blocks: [
      { type: "subheading", text: "7.1 When We'll Refund or Replace" },
      {
        type: "paragraph",
        text: "We'll make it right if:",
      },
      {
        type: "list",
        items: [
          "Wrong item delivered → Full refund or free replacement.",
          "Item below quality standard → Full refund or free replacement.",
          "Missing item → Refund for that item.",
          "Order not delivered → Full refund.",
          "Significantly delayed (>2 hours late) → Partial refund or store credit.",
        ],
      },
      { type: "subheading", text: "7.2 How to Report an Issue" },
      {
        type: "list",
        items: [
          "Take a clear photo of the problem (for quality issues).",
          "Report via our app or WhatsApp within 24 hours of delivery.",
          "We'll respond within 2 hours.",
          "We'll resolve within 24 hours with a refund, replacement, or store credit.",
        ],
      },
      {
        type: "note",
        text: "Important: Fresh foodstuffs cannot be returned once delivered. Quality issues must be reported immediately with photo evidence.",
      },
    ],
  },
  {
    id: "referral",
    title: "8. Referral Program",
    blocks: [
      {
        type: "list",
        items: [
          "Invite friends via your unique referral code.",
          "You both get rewards when your friend places their first order.",
          "No limit on referrals — the more you share, the more you earn!",
          "Fake referrals or self-referrals will result in account suspension.",
        ],
      },
    ],
  },
  {
    id: "recurring",
    title: "9. Recurring Orders",
    blocks: [
      {
        type: "paragraph",
        text: "Save time with auto-delivery:",
      },
      {
        type: "list",
        items: [
          "Schedule weekly or fortnightly orders.",
          "Get a WhatsApp reminder 24 hours before.",
          "Confirm, skip, or cancel each delivery.",
        ],
      },
    ],
  },
  {
    id: "expectations",
    title: "10. What We Expect From You",
    blocks: [
      { type: "subheading", text: "Please:" },
      {
        type: "list",
        items: [
          "Be respectful to our Agents and Riders.",
          "Provide accurate information (address, phone, payment).",
          "Be available to receive your order.",
          "Pay on time (for Cash on Delivery orders).",
          "Report issues honestly with evidence.",
        ],
      },
      { type: "subheading", text: "Don't:" },
      {
        type: "list",
        items: [
          "Place fake orders.",
          "Refuse payment after receiving your order.",
          "Harass or abuse our staff.",
          "Try to manipulate the referral or loyalty system.",
          "Share your account credentials.",
        ],
      },
      {
        type: "paragraph",
        text: "Violation of these expectations may result in account suspension or termination.",
      },
    ],
  },
  {
    id: "reminders",
    title: "11. Important Reminders",
    blocks: [
      { type: "subheading", text: "About Fresh Foodstuffs:" },
      {
        type: "list",
        items: [
          "Shelf life varies (leafy vegetables may last 2–3 days, yams last longer).",
          "Store items properly upon delivery.",
          "We source the freshest available, but natural variations occur.",
        ],
      },
      { type: "subheading", text: "About Delivery:" },
      {
        type: "list",
        items: [
          "Lagos/Ibadan traffic can cause delays — we'll keep you updated.",
          "Extreme weather may affect delivery times.",
          "Market closures on public holidays affect availability.",
        ],
      },
      { type: "subheading", text: "About Pricing:" },
      {
        type: "list",
        items: [
          "Market prices fluctuate daily (especially tomatoes and peppers during scarcity).",
          "We update prices every morning to reflect current market rates.",
          "Major price changes will be communicated before you confirm your order.",
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "12. Privacy & Data",
    blocks: [
      {
        type: "list",
        items: [
          "We protect your personal information (see our Privacy Policy).",
          "Agents and Riders only receive the information needed for your order.",
          "We never sell your data to third parties.",
          "You can request deletion of your data anytime.",
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "13. Contact Us",
    blocks: [
      {
        type: "paragraph",
        text: "Questions? Issues? Feedback?",
      },
      {
        type: "list",
        items: [
          "Customer Support WhatsApp: [Insert Number]",
          "Email: olojarun@gmail.com",
          "App: Use the 'Help' button",
          "Response time: Within 2 hours during business hours.",
        ],
      },
    ],
  },
  {
    id: "agreement",
    title: "14. Agreement",
    blocks: [
      {
        type: "paragraph",
        text: "By using Ojarun, you agree to these Terms & Conditions. We may update these terms from time to time. We'll notify you of significant changes.",
      },
    ],
  },
];

export default function Detail() {
  return (
    <section className="relative w-full bg-white px-4 sm:px-8 py-20">
      <motion.div
        variants={stagger(0.08, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto max-w-[900px]"
      >
        {sections.map((section) => (
          <motion.article
            key={section.id}
            id={section.id}
            variants={fadeUp}
            className="mb-12 scroll-mt-32"
          >
            <h2 className="mb-4 text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {section.title}
            </h2>

            {section.blocks?.map((block, idx) => {
              if (block.type === "paragraph") {
                return (
                  <p
                    key={idx}
                    className="mb-4 text-sm sm:text-base leading-relaxed text-gray-700"
                  >
                    {block.text}
                  </p>
                );
              }

              if (block.type === "subheading") {
                return (
                  <h3
                    key={idx}
                    className="mt-6 mb-3 text-base sm:text-lg font-semibold text-gray-900"
                  >
                    {block.text}
                  </h3>
                );
              }

              if (block.type === "list") {
                return (
                  <ul
                    key={idx}
                    className="mb-4 ml-5 list-disc space-y-2 text-sm sm:text-base leading-relaxed text-gray-700 marker:text-green-600"
                  >
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              }

              if (block.type === "note") {
                return (
                  <div
                    key={idx}
                    className="my-4  border-l-4 border-green-600 p-4 text-sm sm:text-base leading-relaxed text-gray-800"
                  >
                    {block.text}
                  </div>
                );
              }

              return null;
            })}
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}