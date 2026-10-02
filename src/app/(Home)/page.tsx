import Header from "@/components/Header";
import SubFooter from "@/components/SubFooter";
import HeroFull from "./component/herofull";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

// Below-the-fold sections load in separate chunks so first paint stays light.
const WhyUs = dynamic(() => import("./component/whyus"));
const Steps = dynamic(() => import("./component/steps"));
const HowItWorks = dynamic(() => import("./component/howitworks"));
const Faq = dynamic(() => import("./component/faq"));

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <HeroFull />
        <WhyUs />
        <Steps />
        <HowItWorks />
        <Faq />
      </div>
      <SubFooter />
      <Footer />
    </main>
  );
}
