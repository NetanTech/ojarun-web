import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Shop fresh fruits, vegetables, protein, soup ingredients, grains and more from Ibadan markets.",
};

// Sets the browser-tab / search title for this page only.
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
