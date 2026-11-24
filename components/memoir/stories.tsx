"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { metrics } from "@/lib/memoir";
import { MemoirIcon } from "./brand";

const stories = [
  {
    slug: "builder",
    title: "For the builder",
    summary: "The old decision is still attached.",
    text: "When the invite flow comes up again, the meeting excerpt explains why the team kept the first run to three steps.",
    alt: "Three isometric drafting proofs held by a drawing clamp",
  },
  {
    slug: "lead",
    title: "For the team lead",
    summary: "Know who owns the next step.",
    text: "Ahead of the check-in, pull up the one decision Jules owns and the note that set Thursday’s deadline.",
    alt: "Three indexed meeting cards standing in a low archive tray",
  },
  {
    slug: "researcher",
    title: "For the curious mind",
    summary: "An observation finds its other half.",
    text: "A note about citations sits beside a research debrief about dates. Together they suggest how to make an answer easier to check.",
    alt: "A reading loupe resting over an open field notebook",
  },
] as const;

export function Stories() {
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLElement>(null);
  const pointer = useRef<{ x: number; scroll: number; id: number }>(null);
  const reduced = useReducedMotion();
  const settled = useRef<number>(null);

  useEffect(
    () => () => {
      if (settled.current !== null) window.clearTimeout(settled.current);
    },
    [],
  );

  function syncScroll() {
    if (settled.current !== null) window.clearTimeout(settled.current);
    settled.current = window.setTimeout(() => {
      settled.current = null;
      setIndex(position());
    }, 100);
  }

  function position() {
    const el = rail.current;
    if (!el) return 0;
    const end = el.scrollWidth - el.clientWidth;
    if (end > 0 && el.scrollLeft >= end - 4) return stories.length - 1;
    return Math.max(
      0,
      Math.min(
        stories.length - 1,
        Math.round(
          el.scrollLeft /
            Math.max(
              1,
              (el.children[1] as HTMLElement).offsetLeft -
                (el.children[0] as HTMLElement).offsetLeft,
            ),
        ),
      ),
    );
  }

  function move(next: number) {
    const clamped = Math.max(0, Math.min(stories.length - 1, next));
    const el = rail.current;
    const item = el?.children[clamped] as HTMLElement | undefined;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!item || !el || !first) return;
    setIndex(clamped);
    el.scrollTo({
      left: item.offsetLeft - first.offsetLeft,
      behavior: reduced ? "instant" : "smooth",
    });
  }

  function start(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    pointer.current = {
      x: event.clientX,
      scroll: event.currentTarget.scrollLeft,
      id: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  }
  function drag(event: PointerEvent<HTMLElement>) {
    if (pointer.current?.id !== event.pointerId) return;
    event.currentTarget.scrollLeft =
      pointer.current.scroll + pointer.current.x - event.clientX;
  }
  function finish(event: PointerEvent<HTMLElement>) {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    delete event.currentTarget.dataset.dragging;
    move(position());
  }
  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    move(
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? stories.length - 1
          : index + (event.key === "ArrowRight" ? 1 : -1),
    );
  }

  return (
    <section
      className="mm-shell mm-section mm-stories"
      id="memoir-stories"
      aria-labelledby="memoir-stories-title"
    >
      <div className="mm-heading">
        <div>
          <p className="mm-label">Illustrative stories</p>
          <h2 id="memoir-stories-title">What stays with you.</h2>
        </div>
        <div className="mm-carousel-controls">
          <span className="mm-label" aria-live="polite">
            {index + 1} / {stories.length}
          </span>
          <button
            className="mm-icon-button"
            aria-label="Previous story"
            type="button"
            disabled={index === 0}
            onClick={() => move(index - 1)}
          >
            <MemoirIcon name="left" />
          </button>
          <button
            className="mm-icon-button"
            aria-label="Next story"
            type="button"
            disabled={index === stories.length - 1}
            onClick={() => move(index + 1)}
          >
            <MemoirIcon name="arrow" />
          </button>
        </div>
      </div>
      <section
        className="mm-story-rail"
        ref={rail}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: The scroll container supports arrow and Home/End navigation.
        tabIndex={0}
        aria-label="Story carousel"
        onScroll={syncScroll}
        onKeyDown={keyboard}
        onPointerDown={start}
        onPointerMove={drag}
        onPointerUp={finish}
        onPointerCancel={finish}
        onLostPointerCapture={finish}
      >
        {stories.map(({ slug, title, summary, text, alt }) => (
          <article className="mm-story" key={slug} data-story={slug}>
            <div className="mm-story-image">
              <Image
                src={`/showcase/memoir/${slug}.svg`}
                alt={alt}
                fill
                sizes="(max-width: 700px) 76vw, 29vw"
                unoptimized
                draggable={false}
              />
            </div>
            <div className="mm-story-copy">
              <p className="mm-label">{title}</p>
              <h3>{summary}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

export function MemoryMetrics() {
  const [progress, setProgress] = useState(1);
  const scene = useRef<HTMLDListElement>(null);
  const visible = useInView(scene, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!visible || reduced) return;
    const animation = animate(0, 1, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setProgress,
    });
    return () => animation.stop();
  }, [visible, reduced]);

  return (
    <section
      className="mm-shell mm-section mm-metrics"
      aria-labelledby="memoir-metrics-title"
    >
      <div className="mm-heading">
        <div>
          <p className="mm-label">Example memory library</p>
          <h2 id="memoir-metrics-title">Small moments add up.</h2>
        </div>
        <p>A look inside the same sample archive you’ve been exploring.</p>
      </div>
      <dl ref={scene}>
        {metrics.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              <span aria-hidden="true">
                {String(
                  reduced ? value : Math.round(value * progress),
                ).padStart(2, "0")}
              </span>
              <span className="mm-sr">{value}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
