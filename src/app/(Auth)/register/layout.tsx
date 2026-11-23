import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Sign up to order fresh market food in Ibadan, delivered to your doorstep.",
};

// Sets the browser-tab / search title for this page only.
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
