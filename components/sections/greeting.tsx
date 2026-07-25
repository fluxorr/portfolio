import { Scales } from "../core/scales";
import { TextAnimate } from "../ui/text-animate";

const Greeting = () => {
  return (
    <div className="mx-auto max-w-4xl  p-4 flex flex-col text-left  relative  ">
      <TextAnimate
        by="character"
        animation="blurIn"
        className="px-8 font-syne text-2xl "
      >
        Good Morning.
      </TextAnimate>
      <TextAnimate
        by="line"
        animation="blurIn"
        className="p-4 px-8 text-muted-foreground "
      >
        My focus lies at the intersection of product design and backend systems.
        I design interfaces that reduce complexity for users while engineering
        the services, APIs, and system architecture that make those experiences
        dependable at scale. Rather than separating frontend, backend, and
        design into different roles, I approach them as a single engineering
        problem—balancing usability, performance, maintainability, and long-term
        reliability.
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
