import Hero from "@/components/sections/hero";
import Navbar from "@/components/sections/navbar";
import Contact from "@/components/sections/contact";
import ContriGraph from "@/components/sections/ContributionGraph";
import React from "react";
import Greeting from "@/components/sections/greeting";
import ProjectShowcase from "@/components/sections/project-showcase";

const Home = () => {
  return (
    <div className="  relative  ">
      <DashedBorder children={<Navbar />} />
      <DashedBorder children={<Hero />} />
      <DashedBorder children={<Contact />} />
      <DashedBorder children={<Greeting />} />
      <DashedBorder children={<ProjectShowcase />} />
      <DashedBorder children={<ContriGraph />} />

    </div>
  );
};

export default Home;

const DashedBorder = ({ children }: { children: React.JSX.Element }) => {
  return (
    <div className="w-full z-50 backdrop-blur-xl border-b border-dashed dark:border-neutral-400/30">
      {children}
      <div className="border-dashed h-2  border-y w-full border-neutral-400/30 dark:bg-black  " />
    </div>
  );
};
