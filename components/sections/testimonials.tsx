import { Scales } from "../core/scales";
import InfiniteMovingCardsDemo from "../infinite-moving-cards-demo";

const Testimonials = () => {
  return (
    <div className="mx-auto max-w-4xl p-4 relative">
      <InfiniteMovingCardsDemo />

      <div className="absolute inset-y-[-30%] -left-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
      <div className="absolute inset-y-[-30%] -right-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
    </div>
  );
};

export default Testimonials;
