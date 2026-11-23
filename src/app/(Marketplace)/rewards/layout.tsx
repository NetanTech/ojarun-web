import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rewards",
};

// Sets the browser-tab / search title for this page only.
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
