"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { notes, teams } from "@/lib/emberlog";
import { EmberIcon } from "./mark";

export function TrustStrip() {
  const strip = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = strip.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.inView = String(entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label="Illustrative teams"
      className="el-trust el-shell"
      data-paused={paused}
      ref={strip}
    >
      <span>Illustrative teams</span>
      <div className="el-trust-mask">
        <div className="el-trust-track">
          <ul>
            {teams.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <ul aria-hidden="true">
            {teams.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
      <button
        aria-label={paused ? "Resume team names" : "Pause team names"}
        className="el-icon-button el-trust-pause"
        onClick={() => setPaused(!paused)}
        type="button"
      >
        <EmberIcon name={paused ? "play" : "pause"} />
      </button>
    </section>
  );
}

const metrics = [
  { value: 4.1, digits: 1, unit: " ms", title: "Capture overhead" },
  { value: 0, digits: 0, unit: "", title: "Secrets retained" },
  { value: 38, digits: 0, unit: "k", title: "Weekly replays" },
  { value: 11, digits: 0, unit: " s", title: "To first replay" },
];

export function Stats() {
  const root = useRef<HTMLDListElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const target = root.current;
    if (
      !target ||
      !matchMedia("(prefers-reduced-motion: no-preference)").matches
    )
      return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        function animate(now: number) {
          const elapsed = Math.min(1, (now - start) / 1000);
          setProgress(1 - (1 - elapsed) ** 3);
          if (elapsed < 1) frame = requestAnimationFrame(animate);
        }
        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.32 },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <dl className="el-stats" ref={root}>
      {metrics.map(({ digits, title, unit, value }) => (
        <div key={title}>
          <dt>{title}</dt>
          <dd>
            <span className="el-sr">
              {value.toFixed(digits)}
              {unit}
            </span>
            <span aria-hidden="true">
              {(value * progress).toFixed(digits)}
              <small>{unit}</small>
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Notes() {
  const track = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; left: number; time: number } | undefined>(
    undefined,
  );
  const [progress, setProgress] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  function move(direction: 1 | -1) {
    const node = track.current;
    if (!node) return;
    const card = node.querySelector("figure");
    node.scrollBy({
      left: (card ? card.clientWidth + 16 : node.clientWidth) * direction,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <div className="el-notes">
      <section
        aria-label="Example team notes"
        className="el-note-track"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          const node = event.currentTarget;
          drag.current = {
            x: event.clientX,
            left: node.scrollLeft,
            time: performance.now(),
          };
          node.setPointerCapture(event.pointerId);
          node.dataset.dragging = "true";
        }}
        onPointerMove={(event) => {
          if (drag.current)
            event.currentTarget.scrollLeft =
              drag.current.left + drag.current.x - event.clientX;
        }}
        onPointerUp={(event) => {
          if (!drag.current) return;
          const node = event.currentTarget;
          const change = drag.current.x - event.clientX;
          const velocity =
            change / Math.max(25, performance.now() - drag.current.time);
          drag.current = undefined;
          node.releasePointerCapture(event.pointerId);
          delete node.dataset.dragging;
          if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
            node.scrollBy({
              left: Math.max(-200, Math.min(200, velocity * 140)),
              behavior: "smooth",
            });
        }}
        onLostPointerCapture={(event) => {
          drag.current = undefined;
          delete event.currentTarget.dataset.dragging;
        }}
        onScroll={(event) => {
          const node = event.currentTarget;
          const max = node.scrollWidth - node.clientWidth;
          setProgress(max > 0 ? node.scrollLeft / max : 0);
          setAtEnd(node.scrollLeft >= max - 2);
        }}
        ref={track}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users can scroll the carousel with arrow keys.
        tabIndex={0}
      >
        {notes.map((note) => (
          <figure key={note.name}>
            <blockquote>“{note.quote}”</blockquote>
            <figcaption>
              <i>{note.initials}</i>
              <span>
                <strong>{note.name}</strong>
                <small>{note.role}</small>
              </span>
            </figcaption>
          </figure>
        ))}
      </section>
      <div className="el-note-controls">
        <div
          aria-hidden="true"
          className="el-note-progress"
          style={{ "--el-progress": progress } as CSSProperties}
        >
          <i />
        </div>
        <button
          aria-label="Previous team note"
          className="el-icon-button"
          disabled={progress < 0.002}
          onClick={() => move(-1)}
          type="button"
        >
          <EmberIcon name="left" />
        </button>
        <button
          aria-label="Next team note"
          className="el-icon-button"
          disabled={atEnd}
          onClick={() => move(1)}
          type="button"
        >
          <EmberIcon name="arrow" />
        </button>
      </div>
    </div>
  );
}
