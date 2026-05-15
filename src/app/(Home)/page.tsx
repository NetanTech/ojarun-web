import Header from "@/components/Header";
import SubFooter from "@/components/SubFooter";
import HeroFull from "./component/herofull";
import WhyUs from "./component/whyus";
import Steps from "./component/steps";
import HowItWorks from "./component/howitworks";
import Faq from "./component/faq";

export default function Home() {
  return (
    <main className=" ">
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