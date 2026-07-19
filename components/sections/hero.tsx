"use client";
import { TextAnimate } from "../ui/text-animate";
import { Scales } from "../core/scales";



const Hero = () => {
    return (
        <div className="mx-auto max-w-5xl border-x border-dashed border-neutral-400/50 p-4 flex flex-col text-left  relative  ">
            <div className="p-4">
                <TextAnimate className="font-hand text-sm text-neutral-100/40" by="character" animation="scaleUp">01</TextAnimate>
                <div className="flex flex-col text-left pt-24 ">
                    <TextAnimate
                        by="line"
                        animation="slideRight"
                        className="font-display text-3xl ml-2 -mb-8"
                    >
                        Hi, I'm
                    </TextAnimate>
                    <TextAnimate
                        className="font-display text-[10rem]  "
                        by="character"
                        animation="slideUp"
                    >
                        fluxorr.
                    </TextAnimate>

                </div>


                <div className="flex justify-between items-center font-syne p-4 text-foreground/55 " >
                    <div className="">
                        <TextAnimate by="line" animation="slideRight">
                            Software Engineer.
                        </TextAnimate>

                        <TextAnimate by="line" animation="slideRight">
                            Interface, Backend & Systems.
                        </TextAnimate>


                    </div>
                    <TextAnimate by="line" animation="slideLeft" className="text-sm mt-2">20, Pune, IND
                    </TextAnimate>
                </div>

                <div className="absolute inset-y-[-30%] -left-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
                    <Scales size={8} className="rounded-lg " />
                </div>
                <div className="absolute inset-y-[-30%] -right-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
                    <Scales size={8} className="rounded-lg" />
                </div>

            </div>
        </div>
    );
};

export default Hero;
