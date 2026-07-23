import type { ReactNode } from "react";
import ContriGraph from "@/components/sections/ContributionGraph";
import Contact from "@/components/sections/contact";
import Greeting from "@/components/sections/greeting";
import Hero from "@/components/sections/hero";
import Navbar from "@/components/sections/navbar";
import ProjectShowcase from "@/components/sections/project-showcase";

const Home = () => {
  return (
    <div className="relative">
      <DashedBorder>
        <Navbar />
      </DashedBorder>
      <DashedBorder>
        <Hero />
      </DashedBorder>
      <DashedBorder>
        <Contact />
      </DashedBorder>
      <DashedBorder>
        <Greeting />
      </DashedBorder>
      <DashedBorder>
        <ProjectShowcase />
      </DashedBorder>
      <DashedBorder>
        <ContriGraph />
      </DashedBorder>
    </div>
  );
};

export default Home;

const DashedBorder = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full z-50 backdrop-blur-xl border-b border-dashed dark:border-neutral-400/30">
      {children}
      <div className="border-dashed h-2  border-y w-full border-neutral-400/30 dark:bg-black  " />
    </div>
  );
};
