"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import { type CSSProperties, useId, useRef, useState } from "react";
import { Arrow } from "../links";
import "./image-accordion.css";

const frames = [
  {
    name: "The platform",
    image: "/showcase/night-signal-platform.webp",
    alt: "A passenger on a rain-soaked railway platform",
    crop: "70% center",
    caption:
      "A pause on the platform, with red signal lights reflected across the wet concrete.",
  },
  {
    name: "Through the glass",
    image: "/showcase/night-signal-street.webp",
    alt: "A city street seen through a rain-covered window",
    crop: "72% center",
    caption:
      "Across a rain-streaked window, a passing figure breaks the reflected traffic lights.",
  },
  {
    name: "Last light",
    image: "/showcase/commonhour-studio.webp",
    alt: "A warmly lit studio behind glass against a deep blue evening sky",
    crop: "64% center",
    caption:
      "A corner studio stays lit as the rest of the street slips into blue hour.",
  },
] as const;

export function ImageAccordion() {
  const id = useId();
  const stage = useRef<HTMLDivElement>(null);
  const revealed = useInView(stage, { once: true, amount: 0.38 });
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [{ frame, expanded }, setScene] = useState({
    frame: 0,
    expanded: true,
  });

  function choose(index: number) {
    setScene({ frame: index, expanded: true });
  }

  function step(offset: number) {
    setScene((current) => ({
      frame: (current.frame + offset + frames.length) % frames.length,
      expanded: true,
    }));
  }

  return (
    <div className="image-accordion" ref={stage} data-revealed={revealed}>
      <div className="image-accordion-visual">
        {frames.map(({ name, image, alt, crop }, index) => (
          <Image
            key={name}
            src={image}
            alt={frame === index ? alt : ""}
            aria-hidden={frame !== index}
            fill
            sizes="(max-width: 720px) 94vw, 1100px"
            data-active={frame === index}
            style={{ objectPosition: crop }}
          />
        ))}
      </div>
      <div className="image-accordion-panel">
        <header>
          <p className="image-accordion-caption">A short photo sequence</p>
          <p className="image-accordion-name">After hours.</p>
        </header>
        <div className="image-accordion-list">
          {frames.map(({ name, caption }, index) => {
            const open = expanded && index === frame;
            return (
              <div
                key={name}
                data-open={open}
                className="image-accordion-item"
                style={{ "--frame-order": index } as CSSProperties}
              >
                <h4>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${id}-frame-${index}`}
                    ref={(node) => {
                      triggers.current[index] = node;
                    }}
                    onClick={() => {
                      if (open) setScene({ frame: index, expanded: false });
                      else choose(index);
                    }}
                    onKeyDown={(event) => {
                      const last = frames.length - 1;
                      const target =
                        event.key === "ArrowDown"
                          ? (index + 1) % frames.length
                          : event.key === "ArrowUp"
                            ? (index + last) % frames.length
                            : event.key === "Home"
                              ? 0
                              : event.key === "End"
                                ? last
                                : null;
                      if (target === null) return;
                      event.preventDefault();
                      triggers.current[target]?.focus();
                    }}
                  >
                    <span className="image-accordion-index">0{index + 1}</span>
                    {name}
                    <span className="image-accordion-plus" aria-hidden="true" />
                  </button>
                </h4>
                <div
                  className="image-accordion-reveal"
                  aria-hidden={!open}
                  id={`${id}-frame-${index}`}
                >
                  <div>
                    <p>{caption}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <footer className="image-accordion-nav">
          <output>
            <span className="image-accordion-count" key={frame}>
              {String(frame + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true"> / </span>
            {String(frames.length).padStart(2, "0")}
          </output>
          <div>
            <button
              type="button"
              aria-label="Previous photograph"
              onClick={() => step(-1)}
            >
              <Arrow />
            </button>
            <button
              type="button"
              aria-label="Next photograph"
              onClick={() => step(1)}
            >
              <Arrow />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
