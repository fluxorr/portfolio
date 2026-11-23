"use client";

import { useEffect, useRef } from "react";

export function usePointerPosition<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const surface = ref.current;
    if (!surface) return;

    const motion = matchMedia(
      "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    let x = 0;
    let y = 0;

    function update() {
      frame = 0;
      const bounds = surface?.getBoundingClientRect();
      if (!surface || !bounds?.width || !bounds.height) return;

      const horizontal = ((x - bounds.left) / bounds.width) * 2 - 1;
      const vertical = ((y - bounds.top) / bounds.height) * 2 - 1;
      surface.style.setProperty(
        "--pointer-x",
        String(Math.max(-1, Math.min(1, horizontal))),
      );
      surface.style.setProperty(
        "--pointer-y",
        String(Math.max(-1, Math.min(1, vertical))),
      );
      surface.dataset.pointerActive = "true";
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !motion.matches) return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    }

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      surface?.style.removeProperty("--pointer-x");
      surface?.style.removeProperty("--pointer-y");
      if (surface) delete surface.dataset.pointerActive;
    }

    surface.addEventListener("pointermove", move, { passive: true });
    surface.addEventListener("pointerleave", reset);
    surface.addEventListener("pointercancel", reset);
    motion.addEventListener("change", reset);

    return () => {
      reset();
      motion.removeEventListener("change", reset);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", reset);
      surface.removeEventListener("pointercancel", reset);
    };
  }, []);

  return ref;
}
