import Header from "@/components/Header";
import SubFooter from "@/components/SubFooter";
import AboutHero from "./component/hero";
import MissionVision from "./component/missionVision";
import Team from "./component/team";

export default function AboutPage() {
  return (
    <main>
      <Header />
      <AboutHero />
      <MissionVision />
      <Team />
      <SubFooter />
    </main>
  );
}
