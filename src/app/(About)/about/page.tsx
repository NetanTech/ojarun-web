import Header from "@/components/Header";
import SubFooter from "@/components/SubFooter";
import AboutHero from "./component/hero";
import MissionVision from "./component/missionVision";
import Team from "./component/team";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <AboutHero />
        <MissionVision />
        <Team />
      </div>
      <SubFooter />
    </main>
  );
}
