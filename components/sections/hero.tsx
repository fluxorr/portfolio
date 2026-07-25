"use client";
import { Scales } from "../core/scales";
import { HalftoneTrail } from "../ui/halftone-trail";
import { TextAnimate } from "../ui/text-animate";

const Hero = () => {
  return (
    <div className="mx-auto max-w-4xl  p-4 flex flex-col text-left  relative  ">


      <div className="p-4 relative z-10">
        <TextAnimate
          className="font-hand text-sm dark:text-neutral-100/40 text-neutral-800/40 "
          by="character"
          animation="scaleUp"
        >
          01
        </TextAnimate>
        <div className="flex flex-col text-left lg:pt-24 md:pt-24 pt-12">
          <TextAnimate
            by="line"
            animation="slideRight"
            className="font-display text-3xl lg:ml-3 ml-1 text-foreground/90 lg:-mb-2 "
          >
            Hi, I'm
          </TextAnimate>
          <TextAnimate
            className="font-display text-6xl sm:text-7xl md:text-8xl  lg:text-[10rem]"
            by="character"
            animation="slideUp"
          >
            fluxorr.
          </TextAnimate>
        </div>

        <div className="flex justify-between items-baseline-last font-syne px-4 pt-4 text-foreground/55 text-sm lg:text-lg -ml-3 lg:ml-0 -mb-2 mt-4 ">
          <div className="">
            <TextAnimate by="line" animation="slideRight">
              Software Engineer.
            </TextAnimate>

            <TextAnimate by="line" animation="slideRight">
              Interface, Backend & Systems.
            </TextAnimate>
          </div>
          <TextAnimate by="line" animation="slideLeft" className="text-xs lg:text-lg ">
            20, Pune, IND
          </TextAnimate>
        </div>

        <div className="absolute inset-y-[-30%] -left-14 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
          <Scales size={8} className="rounded-lg " />
        </div>
        <div className="absolute inset-y-[-30%] -right-14 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
          <Scales size={8} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
