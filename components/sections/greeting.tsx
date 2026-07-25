'use client'
import { Scales } from "../core/scales";
import { TextAnimate } from "../ui/text-animate";


const Greeting = () => {
  function getGreeting() {
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 12) return "Good morning"
    if (hour >= 12 && hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="mx-auto max-w-4xl  p-4 flex flex-col text-left  relative  ">
      <TextAnimate
        by="character"
        animation="blurIn"
        className="px-8 font-syne text-2xl "
      >
        {`${getGreeting()}.`}
      </TextAnimate>
      <TextAnimate
        by="line"
        animation="blurIn"
        className="p-4 px-8 text-muted-foreground/80 text-pretty lg:text-lg "
      >
        My focus lies at the intersection of product design and backend systems. I build intuitive interfaces and the APIs and architecture behind them, treating design  and engineering as one discipline to balance usability, performance, and reliability.
      </TextAnimate>

      <div className="absolute inset-y-[-30%] -left-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
      <div className="absolute inset-y-[-30%] -right-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
    </div>
  );
};

export default Greeting;
