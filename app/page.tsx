import Hero from "@/components/sections/hero";
import Navbar from "@/components/sections/navbar";
import Contact from "@/components/sections/contact";

const Home = () => {
  return (
    <div className="  relative  ">
      <div className="w-full z-50 backdrop-blur-xl border-b border-dashed dark:border-neutral-400/30">
        <Navbar />
        <div className="border-dashed h-2  border-y w-full border-neutral-400/30 bg-black " />
      </div>
      <div className="w-full z-50 backdrop-blur-xl border-b border-dashed dark:border-neutral-400/30 h-40vh">
        <Hero />
        <div className="border-dashed h-2  border-y w-full border-neutral-400/30 bg-black " />
      </div>
      <div className="w-full z-50 backdrop-blur-xl border-b border-dashed dark:border-neutral-400/30 h-40vh">
        <Contact />
        <div className="border-dashed h-2  border-y w-full border-neutral-400/30 bg-black " />
      </div>
    </div>
  );
};

export default Home;
