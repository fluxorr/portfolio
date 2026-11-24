"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function StudyPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.36 });
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (visible) setRevealed(true);
  }, [visible]);

  return (
    <div
      className="atelier-preview"
      data-study="palimpsest"
      ref={ref}
      data-revealed={revealed}
      data-visible={visible}
      aria-hidden="true"
    >
      <div className="atelier-preview-caption study-code">
        <span>Archive / object 014</span>
        <span>Origin · Revisions · Custody</span>
      </div>
      {/* biome-ignore lint/performance/noImgElement: The custom engraving is a responsive native vector. */}
      <img
        src="/studies/asterion.svg"
        alt=""
        width="780"
        height="565"
        loading="lazy"
      />
      <p className="atelier-archive-name">
        The Asterion
        <br />
        Register
      </p>
      <span className="atelier-preview-pin" />
    </div>
  );
}
