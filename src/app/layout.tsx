import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { CustomerSessionProvider } from "@/lib/customerAuth";
import { ToastProvider } from "@/components/ui/Toast";
import TermsGate from "@/components/TermsGate";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Colours the phone's browser bar / installed-app title bar in brand green.
export const viewport: Viewport = {
  themeColor: "#004a19",
};

export const metadata: Metadata = {
  // Makes the generated link-preview image URL absolute (WhatsApp needs that).
  metadataBase: new URL("https://www.ojarun.com"),
  title: {
    default: "Ojarun — Bringing the Market to Your Doorstep",
    template: "%s | Ojarun",
  },
  description:
    "Fresh food from local markets, sourced by trained agents and delivered to your doorstep without the stress, time, or guesswork.",
  icons: {
    icon: "/icon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  // iPhone "Add to Home Screen" opens full-screen with this name.
  appleWebApp: {
    capable: true,
    title: "Ojarun",
    statusBarStyle: "default",
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
      <body className="min-h-full flex flex-col overflow-x-clip font-sans">
        <CustomerSessionProvider>
          <ToastProvider>
            {children}
            <TermsGate />
          </ToastProvider>
        </CustomerSessionProvider>
      </body>
    </html>
  );
}
