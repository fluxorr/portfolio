import Hero from "@/components/sections/hero";
import Navbar from "@/components/sections/navbar";

const Home = () => {
  return (
    <div className="    ">
      <div className="w-full z-50 backdrop-blur-xl border-b border-dashed dark:border-neutral-800">
        <Navbar />
      </div>
      <div className="w-full z-50 backdrop-blur-xl border-b border-dashed dark:border-neutral-800 h-40vh">
        <Hero />
      </div>
    </div>
  );
};

export default Home;
