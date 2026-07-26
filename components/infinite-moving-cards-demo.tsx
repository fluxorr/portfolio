"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="flex flex-col items-center justify-center antialiased">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="fast"
      />
    </div>
  );
}

const testimonials = [
  {
    content:
      "beauty!!! 🧡 ",
    name: "Sasha",
    username: "@aleksksaa",
    avatar: "https://pbs.twimg.com/profile_images/2008919046385717248/YkhFE0Ql_x96.jpg",
    url: "https://x.com/aleksksaa",
  },
  {
    content:
      "Super Clean",
    name: "Alvaro Diaz",
    username: "@alvarostudio_",
    avatar: "https://pbs.twimg.com/profile_images/2026749171735072770/ah5Xocid_400x400.jpg",
    url: "https://x.com/alexcodes",
  },
  // {
  //   content:
  //     "One of the cleanest portfolios I've seen. The halftone effect is a really nice touch.",
  //   name: "Emma Wilson",
  //   username: "@emmaw",
  //   avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Emma%20Wilson&backgroundColor=374151",
  //   url: "https://x.com/emmaw",
  // },
  // {
  //   content:
  //     "the greeting changes based on time of day?? little details like this make all the difference.",
  //   name: "Marcus",
  //   username: "@marcus_dev",
  //   avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Marcus&backgroundColor=6b7280",
  //   url: "https://x.com/marcus_dev",
  // },
  // {
  //   content:
  //     "infinite scroll cards for testimonials is such a clean pattern. stealing this for my site.",
  //   name: "Priya",
  //   username: "@priyacodes",
  //   avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Priya&backgroundColor=4b5563",
  //   url: "https://x.com/priyacodes",
  // },
];
