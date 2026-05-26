import Header from "@/components/Header";

import HeroSection from "./components/heroSectiom";
import Detail from "./components/details";

export default function ContactPage() {
  return (
    <main className="flex flex-col">
      <Header />

      <HeroSection />
      <Detail />
    </main>
  );
}