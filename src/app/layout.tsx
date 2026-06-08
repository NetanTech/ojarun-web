import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ojarun — Bringing the Market to Your Doorstep",
    template: "%s | Ojarun",
  },
  description:
    "Fresh food from local markets, sourced by trained agents and delivered to your doorstep without the stress, time, or guesswork.",
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
      className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}