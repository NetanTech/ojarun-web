"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

type Section = {
  id: string;
  title: string;
  blocks?: Array<
    | { type: "paragraph"; text: string }
    | { type: "list"; items: string[] }
    | { type: "subheading"; text: string }
    | { type: "note"; text: string }
  >;
};

const sections: Section[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    blocks: [
      {
        type: "paragraph",
        text: "Ojarun Nigeria Limited ('Ojarun', 'we', 'us', or 'our') respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our market-access platform (the 'Services').",
      },
      {
        type: "paragraph",
        text: "This Privacy Policy applies to our website (www.ojarun.com) and WhatsApp ordering service.",
      },
      {
        type: "paragraph",
        text: "By using our Services, you consent to the data practices described in this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.",
      },
    ],
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    blocks: [
      { type: "subheading", text: "2.1 Information You Provide Directly" },
      {
        type: "paragraph",
        text: "We collect information you provide when you:",
      },
      {
        type: "list",
        items: [
          "Create an account (name, phone number, email address).",
          "Place an order (delivery addresses with landmarks, payment information).",
          "Contact customer support (inquiry details, correspondence).",
          "Participate in surveys or promotions (responses, feedback).",
          "Rate and review our Services (ratings, comments, photos).",
          "Use our referral program (referral codes, friend contact information).",
        ],
      },
      { type: "subheading", text: "2.2 Information Collected Automatically" },
      {
        type: "paragraph",
        text: "When you use our Services, we automatically collect:",
      },
      {
        type: "list",
        items: [
          "Device information (device type, operating system, unique device identifiers).",
          "Usage data (pages viewed, features used, time spent, app interactions).",
          "Location data (GPS location when placing orders or for delivery tracking).",
          "IP address and browser type (when using our website).",
          "Cookies and similar tracking technologies (see Section 8).",
        ],
      },
      { type: "subheading", text: "2.3 Information from Third Parties" },
      {
        type: "paragraph",
        text: "We may receive information from:",
      },
      {
        type: "list",
        items: [
          "Payment processors (Paystack, Flutterwave): transaction status, payment method details.",
          "Social media platforms (if you choose to link your account).",
          "Identity verification services (for KYC compliance when required).",
          "Marketing partners and analytics providers.",
        ],
      },
      { type: "subheading", text: "2.4 Sensitive Personal Information" },
      {
        type: "paragraph",
        text: "We may collect:",
      },
      {
        type: "list",
        items: [
          "Payment information (processed securely by our payment partners; we do not store full card details).",
          "Precise location data (only when necessary for order delivery).",
          "Dietary preferences or restrictions (if you choose to provide them).",
        ],
      },
    ],
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    blocks: [
      { type: "subheading", text: "3.1 To Provide Our Services" },
      {
        type: "list",
        items: [
          "Process and fulfill your orders.",
          "Connect you with Agents who source your items from local markets.",
          "Coordinate Riders for doorstep delivery.",
          "Send order confirmations and delivery notifications via WhatsApp.",
          "Process payments and issue receipts.",
          "Manage your account and loyalty program.",
        ],
      },
      { type: "subheading", text: "3.2 To Improve Our Services" },
      {
        type: "list",
        items: [
          "Analyze usage patterns to enhance user experience.",
          "Train our Agents on product selection and quality standards.",
          "Optimize delivery routes and timing.",
          "Develop new features and meal templates.",
          "Conduct market research and demand forecasting.",
        ],
      },
      { type: "subheading", text: "3.3 To Communicate With You" },
      {
        type: "list",
        items: [
          "Send transactional messages (order updates, delivery confirmations).",
          "Respond to your inquiries and support requests.",
          "Send promotional offers and updates (with your consent).",
          "Request feedback and reviews.",
          "Notify you of changes to our Terms or Privacy Policy.",
        ],
      },
      { type: "subheading", text: "3.4 For Safety and Security" },
      {
        type: "list",
        items: [
          "Detect and prevent fraud and unauthorized transactions.",
          "Verify identity where required by law.",
          "Protect against security threats and abuse.",
          "Enforce our Terms of Service.",
          "Comply with legal obligations.",
        ],
      },
      { type: "subheading", text: "3.5 For Marketing and Advertising" },
      {
        type: "list",
        items: [
          "Personalize your experience based on your preferences.",
          "Display relevant product recommendations.",
          "Send targeted promotional content (you can opt out anytime).",
          "Measure the effectiveness of our marketing campaigns.",
        ],
      },
    ],
  },
  {
    id: "how-we-share",
    title: "4. How We Share Your Information",
    blocks: [
      { type: "subheading", text: "4.1 With Service Providers" },
      {
        type: "paragraph",
        text: "We share information with third-party service providers who perform services on our behalf:",
      },
      {
        type: "list",
        items: [
          "Payment processors (Paystack, Flutterwave) — to process transactions.",
          "Cloud hosting providers (AWS, Google Cloud) — to store data securely.",
          "SMS and WhatsApp providers — to send notifications.",
          "Analytics providers — to understand user behavior.",
          "Customer support tools — to assist with inquiries.",
        ],
      },
      {
        type: "paragraph",
        text: "These service providers are contractually obligated to protect your information and use it only for the purposes we specify.",
      },
      { type: "subheading", text: "4.2 With Agents and Riders" },
      {
        type: "list",
        items: [
          "Agents receive: your order details (items, quantities, special instructions), first name, and delivery area (not full address).",
          "Riders receive: your delivery address with landmark, phone number (for coordination), and order ID.",
        ],
      },
      {
        type: "paragraph",
        text: "Agents and Riders are trained on data privacy and confidentiality obligations.",
      },
      { type: "subheading", text: "4.3 For Legal Reasons" },
      {
        type: "paragraph",
        text: "We may disclose your information if required to:",
      },
      {
        type: "list",
        items: [
          "Comply with Nigerian laws, regulations, or legal processes.",
          "Respond to lawful requests from public authorities.",
          "Enforce our Terms of Service or other agreements.",
          "Protect our rights, property, or safety, or that of our users.",
          "Investigate fraud or security issues.",
        ],
      },
      { type: "subheading", text: "4.4 Business Transfers" },
      {
        type: "paragraph",
        text: "If Ojarun is involved in a merger, acquisition, or sale of assets, your information may be transferred. We will notify you via email or prominent notice on our Platform before your information becomes subject to a different Privacy Policy.",
      },
      { type: "subheading", text: "4.5 With Your Consent" },
      {
        type: "paragraph",
        text: "We may share your information for purposes not described in this Privacy Policy with your explicit consent.",
      },
    ],
  },
  {
    id: "data-retention",
    title: "5. Data Retention",
    blocks: [
      {
        type: "paragraph",
        text: "We retain your personal information for as long as necessary to:",
      },
      {
        type: "list",
        items: [
          "Provide our Services to you.",
          "Comply with legal obligations (e.g., tax records, financial reporting).",
          "Resolve disputes and enforce our agreements.",
          "Maintain security and prevent fraud.",
        ],
      },
      { type: "subheading", text: "Specific retention periods:" },
      {
        type: "list",
        items: [
          "Account information: Retained while your account is active and for 12 months after account closure.",
          "Order history: Retained for 7 years for tax and accounting purposes.",
          "Payment information: Processed by payment partners; we retain transaction records for 7 years.",
          "Chat and support interactions: Retained for 2 years.",
          "Marketing communications: Until you unsubscribe or request deletion.",
        ],
      },
      {
        type: "paragraph",
        text: "After the retention period, we will securely delete or anonymize your personal information.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "6. Your Data Protection Rights",
    blocks: [
      {
        type: "paragraph",
        text: "Under the Nigeria Data Protection Act (NDPA) 2023 and other applicable data protection laws, you have the following rights:",
      },
      { type: "subheading", text: "6.1 Right to Access" },
      {
        type: "list",
        items: [
          "You may request a copy of the personal information we hold about you.",
          "We will provide this information within 30 days of your request.",
        ],
      },
      { type: "subheading", text: "6.2 Right to Rectification" },
      {
        type: "list",
        items: [
          "You may request the correction of inaccurate or incomplete information.",
          "You can update most information directly in your account settings.",
        ],
      },
      { type: "subheading", text: "6.3 Right to Erasure ('Right to be Forgotten')" },
      {
        type: "list",
        items: [
          "You may request the deletion of your personal information.",
          "We will comply unless we have a legal obligation to retain the data.",
        ],
      },
      { type: "subheading", text: "6.4 Right to Restrict Processing" },
      {
        type: "paragraph",
        text: "You may request that we limit how we use your information in certain circumstances.",
      },
      { type: "subheading", text: "6.5 Right to Data Portability" },
      {
        type: "list",
        items: [
          "You may request your data in a structured, commonly used, machine-readable format.",
          "You may request that we transfer your data to another service provider, where technically feasible.",
        ],
      },
      { type: "subheading", text: "6.6 Right to Object" },
      {
        type: "list",
        items: [
          "You may object to the processing of your information for direct marketing purposes.",
          "You can opt out of marketing communications at any time using the unsubscribe link.",
        ],
      },
      { type: "subheading", text: "6.7 Right to Withdraw Consent" },
      {
        type: "list",
        items: [
          "Where we rely on consent to process your data, you may withdraw consent at any time.",
          "Withdrawal does not affect the lawfulness of processing before withdrawal.",
        ],
      },
      {
        type: "note",
        text: "To exercise any of these rights, please contact our Data Protection Officer through our web app settings.",
      },
    ],
  },
  {
    id: "data-security",
    title: "7. Data Security",
    blocks: [
      {
        type: "paragraph",
        text: "We implement appropriate technical and organizational measures to protect your personal information, including:",
      },
      {
        type: "list",
        items: [
          "Encryption of data in transit and at rest.",
          "Secure Socket Layer (SSL) technology for our website.",
          "Access controls limiting employee access to personal data.",
          "Regular security assessments and vulnerability testing.",
          "Secure payment processing through PCI-DSS compliant providers.",
          "Multi-factor authentication for admin systems.",
          "Employee training on data protection and confidentiality.",
        ],
      },
      {
        type: "note",
        text: "However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.",
      },
    ],
  },
  {
    id: "cookies",
    title: "8. Cookies and Tracking Technologies",
    blocks: [
      { type: "subheading", text: "8.1 What Are Cookies?" },
      {
        type: "paragraph",
        text: "Cookies are small text files placed on your device to collect standard internet log information and visitor behavior. We use cookies and similar technologies to enhance your experience.",
      },
      { type: "subheading", text: "8.2 Types of Cookies We Use" },
      {
        type: "list",
        items: [
          "Essential cookies: Required for the Platform to function (e.g., shopping cart, authentication).",
          "Analytics cookies: Help us understand how you use our Services (e.g., Google Analytics).",
          "Functional cookies: Remember your preferences (e.g., language, location).",
          "Marketing cookies: Track your activity to deliver relevant advertisements.",
        ],
      },
      { type: "subheading", text: "8.3 Managing Cookies" },
      {
        type: "paragraph",
        text: "You can control cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our Services.",
      },
    ],
  },
  {
    id: "third-party-links",
    title: "9. Third-Party Links",
    blocks: [
      {
        type: "paragraph",
        text: "Our Platform may contain links to third-party websites, plugins, or applications. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    title: "10. Children's Privacy",
    blocks: [
      {
        type: "paragraph",
        text: "Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately at olojarun@gmail.com, and we will delete the information promptly.",
      },
    ],
  },
  {
    id: "international-transfers",
    title: "11. International Data Transfers",
    blocks: [
      {
        type: "paragraph",
        text: "Your information may be transferred to and processed in countries other than Nigeria, including servers located in the United States, Europe, or other jurisdictions where our service providers operate.",
      },
      {
        type: "paragraph",
        text: "We ensure that adequate safeguards are in place, including:",
      },
      {
        type: "list",
        items: [
          "Standard contractual clauses approved by the relevant authorities.",
          "Adequacy decisions recognizing equivalent data protection standards.",
          "Other legally recognized transfer mechanisms.",
        ],
      },
    ],
  },
  {
    id: "changes",
    title: "12. Changes to This Privacy Policy",
    blocks: [
      {
        type: "paragraph",
        text: "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes:",
      },
      {
        type: "list",
        items: [
          "We will update the 'Effective Date' at the top of this policy.",
          "Significant changes will be communicated via email, in-app notification, or prominent notice on our Platform.",
          "Continued use of our Services after the effective date constitutes acceptance of the updated policy.",
        ],
      },
      {
        type: "paragraph",
        text: "We encourage you to review this Privacy Policy periodically.",
      },
    ],
  },
  {
    id: "ndpa-compliance",
    title: "13. Nigeria Data Protection Act (NDPA) Compliance",
    blocks: [
      {
        type: "paragraph",
        text: "Ojarun is committed to full compliance with the Nigeria Data Protection Act (NDPA) 2023 and regulations issued by the Nigeria Data Protection Commission (NDPC). We:",
      },
      {
        type: "list",
        items: [
          "Process personal data lawfully, fairly, and transparently.",
          "Collect data only for specified, explicit, and legitimate purposes.",
          "Ensure data is adequate, relevant, and limited to what is necessary.",
          "Maintain accurate and up-to-date records.",
          "Retain data only as long as necessary.",
          "Implement appropriate security measures.",
          "Respect your rights as a data subject.",
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "14. Contact Us & Data Protection Officer",
    blocks: [
      {
        type: "paragraph",
        text: "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact:",
      },
      {
        type: "list",
        items: [
          "Data Protection Officer / General Inquiries: olojarun@gmail.com",
          "Website: www.ojarun.com",
        ],
      },
    ],
  },
  {
    id: "complaints",
    title: "15. Complaints",
    blocks: [
      {
        type: "paragraph",
        text: "If you believe we have not handled your personal information properly, you have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC):",
      },
      {
        type: "list",
        items: [
          "Email: info@ndpc.gov.ng",
          "Website: www.ndpc.gov.ng",
        ],
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
                    className="my-4 border-l-4 border-green-600  p-4 text-sm sm:text-base leading-relaxed text-gray-800"
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