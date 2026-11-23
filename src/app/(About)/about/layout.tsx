import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About us",
  description: "Who we are: Ojarun agents shop local markets in Ibadan for you and riders deliver to your doorstep.",
};

// Sets the browser-tab / search title for this page only.
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
