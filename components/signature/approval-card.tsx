"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  buildTimeline,
  fitInk,
  inkProgress,
  isDot,
  type SignatureDocument,
  strokePath,
} from "./document";
import "./signature.css";

export function SignatureApprovalCard({
  signature,
  signerName,
  label = "Approved by",
  replay = 0,
  autoplayOnVisible = false,
  playbackRate = 1,
  maxInterStrokePauseMs = 220,
  showPen = true,
  className = "",
  onReplayComplete,
}: {
  signature: SignatureDocument | null;
  signerName?: string;
  label?: string;
  replay?: number;
  autoplayOnVisible?: boolean;
  playbackRate?: number;
  maxInterStrokePauseMs?: number;
  showPen?: boolean;
  className?: string;
  onReplayComplete?: () => void;
}) {
  const card = useRef<HTMLElement>(null);
  const pen = useRef<SVGGElement>(null);
  const ink = useRef<(SVGPathElement | SVGCircleElement | null)[]>([]);
  const complete = useRef(onReplayComplete);
  const played = useRef<{
    signature: SignatureDocument | null;
    replay: number;
  } | null>(null);
  const fit = useMemo(() => fitInk(signature?.strokes ?? []), [signature]);
  const paths = useMemo(
    () =>
      signature?.strokes.map(({ points }) => ({
        d: strokePath(points),
        dot: isDot(points),
        first: points[0],
        last: points.at(-1) ?? points[0],
      })) ?? [],
    [signature],
  );

  const timeline = useMemo(
    () =>
      buildTimeline(
        signature?.strokes ?? [],
        Math.max(0, maxInterStrokePauseMs),
      ),
    [signature, maxInterStrokePauseMs],
  );

  useEffect(() => {
    complete.current = onReplayComplete;
  }, [onReplayComplete]);

  useLayoutEffect(() => {
    const nib = pen.current;
    if (!signature || !nib || !paths.length) return;
    const nodes = ink.current.slice(0, paths.length);
    const drawAll = () => {
      nodes.forEach((node) => {
        node?.removeAttribute("stroke-dasharray");
        node?.removeAttribute("stroke-dashoffset");
        node?.removeAttribute("visibility");
      });
      nib.style.opacity = "0";
    };
    drawAll();
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const rate = Math.max(0.25, Math.min(4, playbackRate || 1));
    const requested =
      replay > 0 &&
      (replay !== played.current?.replay ||
        signature !== played.current?.signature);
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    let last = 0;
    let running = false;

    function animate() {
      observer?.disconnect();
      if (motion.matches) {
        played.current = { signature, replay };
        complete.current?.();
        return;
      }
      const lengths = nodes.map((node) =>
        node instanceof SVGPathElement ? node.getTotalLength() : 0,
      );
      nodes.forEach((node, index) => {
        const length = lengths[index];
        node?.setAttribute("visibility", "hidden");
        if (length) {
          node?.setAttribute("stroke-dasharray", `${length} ${length}`);
          node?.setAttribute("stroke-dashoffset", String(length));
        }
      });
      let state = 0;
      let time = -70;
      let angle = -12;
      running = true;
      const placePen = (
        point: { x: number; y: number },
        offset: number,
        opacity: number,
      ) => {
        if (!nib) return;
        nib.setAttribute(
          "transform",
          `translate(${fit.x + point.x * fit.scale} ${fit.y + point.y * fit.scale - offset}) rotate(${angle})`,
        );
        nib.style.opacity = showPen ? String(opacity) : "0";
      };
      const step = (now: number) => {
        played.current = { signature, replay };
        const delta = last && !document.hidden ? now - last : 0;
        time += delta * rate;
        last = now;
        while (timeline[state] && time >= timeline[state].end) {
          nodes[state]?.removeAttribute("visibility");
          nodes[state]?.removeAttribute("stroke-dashoffset");
          nodes[state]?.removeAttribute("stroke-dasharray");
          state++;
        }
        const part = timeline[state];
        const node = nodes[state];
        if (!part) {
          drawAll();
          running = false;
          complete.current?.();
          return;
        }
        if (time >= part.start && node) {
          const length = lengths[state];
          const distance = inkProgress(part, time - part.start) * length;
          if (node instanceof SVGPathElement) {
            const radius = 3 / fit.scale;
            const before = node.getPointAtLength(
              Math.max(0, distance - radius),
            );
            const after = node.getPointAtLength(
              Math.min(length, distance + radius),
            );
            const rise =
              (after.y - before.y) /
              Math.max(1, Math.hypot(after.x - before.x, after.y - before.y));
            angle += (-12 + rise * 19 - angle) * (1 - Math.exp(-delta / 58));
            node.setAttribute("stroke-dashoffset", String(length - distance));
            placePen(node.getPointAtLength(distance), 0, 1);
          } else placePen(paths[state].first, 0, 1);
          node.removeAttribute("visibility");
        } else if (state > 0) {
          const previous = timeline[state - 1];
          const from = paths[state - 1].last;
          const to = paths[state].first;
          const gap = part.start - previous.end;
          const travel = Math.hypot(to.x - from.x, to.y - from.y) * fit.scale;
          if (gap >= 40 && travel <= 92) {
            const t = (time - previous.end) / gap;
            const ease = t * t * (3 - 2 * t);
            placePen(
              {
                x: from.x + (to.x - from.x) * ease,
                y: from.y + (to.y - from.y) * ease,
              },
              Math.sin(t * Math.PI) * 7,
              1,
            );
          } else if (nib) nib.style.opacity = "0";
        }
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }

    if (requested) animate();
    else if (
      autoplayOnVisible &&
      played.current?.signature !== signature &&
      card.current
    ) {
      if ("IntersectionObserver" in window) {
        if (!motion.matches)
          nodes.forEach((node) => {
            node?.setAttribute("visibility", "hidden");
          });
        observer = new IntersectionObserver(
          (entries) => {
            if (
              entries.some(
                (entry) =>
                  entry.isIntersecting && entry.intersectionRatio >= 0.4,
              )
            )
              animate();
          },
          { threshold: 0.4 },
        );
        observer.observe(card.current);
      } else animate();
    }
    const visibility = () => {
      last = 0;
    };
    const preference = () => {
      if (motion.matches && !running) drawAll();
      if (motion.matches && running) {
        cancelAnimationFrame(frame);
        drawAll();
        running = false;
        complete.current?.();
      }
    };
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", preference);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", preference);
    };
  }, [
    signature,
    replay,
    autoplayOnVisible,
    playbackRate,
    timeline,
    showPen,
    fit,
    paths,
  ]);

  const name = signerName ?? signature?.signerName;
  return (
    <figure
      className={`signature-card ${className}`}
      ref={card}
      aria-label={name ? `Signature by ${name}` : "Approval card"}
    >
      <figcaption>{label}</figcaption>
      <svg
        aria-hidden="true"
        className="signature-card-ink"
        viewBox="0 0 320 140"
        overflow="visible"
      >
        <g transform={fit.transform}>
          {paths.map(({ d, dot, first }, index) =>
            dot ? (
              <circle
                key={signature?.strokes[index].id}
                ref={(node) => {
                  ink.current[index] = node;
                }}
                cx={first.x}
                cy={first.y}
                r={1 / fit.scale}
                fill="currentColor"
              />
            ) : (
              <path
                key={signature?.strokes[index].id}
                ref={(node) => {
                  ink.current[index] = node;
                }}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ),
          )}
        </g>
        <g
          className="signature-nib"
          ref={pen}
          fill="#09090b"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M0 0 2-7 20-25q1.6-1.5 3.2 0l2.2 2.2q1.5 1.6 0 3.2L7-2Z" />
          <path d="m2-7 5 5m9-19 5 5" />
        </g>
      </svg>
      <div className="signature-card-name">{name || "—"}</div>
    </figure>
  );
}
