import Header from "@/components/Header";
import HeroFull from "./component/herofull";
import WhyUs from "./component/whyus";
import Steps from "./component/steps";
import HowItWorks from "./component/howitworks";
import Faq from "./component/faq";
import SubFooter from "./component/subfooter";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroFull />
      <WhyUs />
      <Steps />
      <HowItWorks />
      <Faq />
      <SubFooter />
    </main>
  );
}