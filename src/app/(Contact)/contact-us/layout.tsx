import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with Ojarun by WhatsApp or email.",
};

// Sets the browser-tab / search title for this page only.
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
