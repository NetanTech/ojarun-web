import Header from "@/components/Header";
import AboutHero from "./component/hero";
import MissionVision from "./component/missionVision";
import Team from "./component/team";
import CtaBanner from "./component/ctaBanner";

export default function AboutPage() {
  return (
    <main>
      <Header />
      <AboutHero />
      <MissionVision />
      <Team />
      <CtaBanner />
    </main>
  );
}
