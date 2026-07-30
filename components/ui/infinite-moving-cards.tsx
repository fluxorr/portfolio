"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    content: string;
    name: string;
    username: string;
    avatar: string;
    url: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-4xl overflow-hidden",
        "mask-[linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]",
        className,
      )}
    >
      <ul
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:paused",
        )}
      >
        {[...items, ...items].map((item, idx) => (
          <li
            key={`${item.name}${item.username}-${idx}`}
            className="relative w-80 shrink-0 rounded-sm border border-border/50 bg-background px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={36}
                  height={36}
                  className="rounded-full ring-1 ring-border/50"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.username}
                  </p>
                </div>
              </div>
              <svg
                viewBox="0 0 24 24"
                className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50"
                fill="currentColor"
                role="img"
                aria-label="X (Twitter)"
              >
                <title>X (Twitter)</title>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              {item.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
