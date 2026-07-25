import type { ReactNode } from "react";
import ContriGraph from "@/components/sections/ContributionGraph";
import Contact from "@/components/sections/contact";
import Greeting from "@/components/sections/greeting";
import Hero from "@/components/sections/hero";
import Navbar from "@/components/sections/navbar";
import ProjectShowcase from "@/components/sections/project-showcase";
import HalftoneTrail from "@/components/ui/halftone-trail";

const Home = () => {
  return (
    <div className="relative">
      <HalftoneTrail
        cellSize={10}
        decay={0.965}
        brushSize={0.045}
        hoverBrushSize={0.012}
        opacity={1.0}
        hoverOpacity={0.15}
        speedScale={38.0}
      />
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
    <div className="w-full z-50 backdrop-blur-xl border-b border-dashed border-neutral-400/40 dark:border-neutral-400/10">
      {children}
      <div className="border-dashed h-2  border-y w-full border-neutral-400/40 dark:border-neutral-400/10  " />
    </div>
  );
};
