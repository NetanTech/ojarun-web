import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { CustomerSessionProvider } from "@/lib/customerAuth";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Ojarun — Bringing the Market to Your Doorstep",
    template: "%s | Ojarun",
  },
  description:
    "Fresh food from local markets, sourced by trained agents and delivered to your doorstep without the stress, time, or guesswork.",
  icons: {
    icon: "/icon.png",
  },
  keywords: [
    "Ojarun",
    "market delivery",
    "fresh groceries",
    "Nigeria",
    "local market",
    "grocery delivery",
    "food sourcing",
  ],
  openGraph: {
    title: "Ojarun — Bringing the Market to Your Doorstep",
    description:
      "Fresh food from local markets, sourced by trained agents and delivered to your doorstep.",
    type: "website",
    siteName: "Ojarun",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ojarun — Bringing the Market to Your Doorstep",
    description:
      "Fresh food from local markets, sourced by trained agents and delivered to your doorstep.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden font-sans">
        <CustomerSessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </CustomerSessionProvider>
      </body>
    </html>
  );
}
