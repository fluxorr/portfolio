"use client";

import { memo, useEffect, useRef } from "react";

const textureUrl = "/showcase/commonhour-dither.webp";
const maxResolution = 520;
const cursorRadius = 90;

export const DitherField = memo(function DitherField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const stage = canvas?.closest<HTMLElement>(".ch-stage");
    if (!canvas || !stage) return;

    const motion = matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const image = new Image();
    let stop: (() => void) | undefined;
    let disposed = false;

    function activate() {
      if (
        !canvas ||
        !stage ||
        !motion.matches ||
        !image.naturalWidth ||
        stop ||
        disposed
      )
        return;
      const context = canvas.getContext("2d");
      const source = document.createElement("canvas");
      const sourceContext = source.getContext("2d", {
        willReadFrequently: true,
      });
      if (!context || !sourceContext) return;

      let pixels: Uint8ClampedArray<ArrayBufferLike> | undefined;
      let patch: ImageData | undefined;
      let rate = 1;
      let radius = 1;
      let frame = 0;
      let clientX = 0;
      let clientY = 0;
      let previous: [number, number] | undefined;

      function reset() {
        cancelAnimationFrame(frame);
        frame = 0;
        if (previous && patch)
          context?.clearRect(...previous, patch.width, patch.height);
        previous = undefined;
      }

      function size() {
        if (!canvas || !sourceContext) return;
        reset();
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (width < 1 || height < 1) return;

        rate = Math.min(0.5, maxResolution / width, maxResolution / height);
        canvas.width = Math.ceil(width * rate);
        canvas.height = Math.ceil(height * rate);
        source.width = canvas.width;
        source.height = canvas.height;
        const scale = Math.max(
          source.width / image.naturalWidth,
          source.height / image.naturalHeight,
        );
        const imageWidth = image.naturalWidth * scale;
        const imageHeight = image.naturalHeight * scale;
        sourceContext.imageSmoothingEnabled = false;
        sourceContext.drawImage(
          image,
          (source.width - imageWidth) / 2,
          (source.height - imageHeight) / 2,
          imageWidth,
          imageHeight,
        );
        pixels = sourceContext.getImageData(
          0,
          0,
          source.width,
          source.height,
        ).data;
        radius = Math.max(1, Math.round(cursorRadius * rate));
        patch = new ImageData(radius * 2 + 1, radius * 2 + 1);
      }

      function draw() {
        frame = 0;
        if (!canvas || !context || !pixels || !patch) return;
        const bounds = canvas.getBoundingClientRect();
        const x = Math.round((clientX - bounds.left) * rate);
        const y = Math.round((clientY - bounds.top) * rate);
        const left = x - radius;
        const top = y - radius;
        const side = patch.width;
        const buffer = patch.data;
        buffer.fill(0);

        for (let row = 0; row < side; row++) {
          for (let col = 0; col < side; col++) {
            const dx = col - radius;
            const dy = row - radius;
            const squared = dx * dx + dy * dy;
            if (squared >= radius * radius) continue;

            const distance = Math.sqrt(squared);
            const strength = 1 - distance / radius;
            const displacement = 0.62 * strength * strength;
            const sx = Math.max(
              0,
              Math.min(
                canvas.width - 1,
                Math.round(left + col - dx * displacement),
              ),
            );
            const sy = Math.max(
              0,
              Math.min(
                canvas.height - 1,
                Math.round(top + row - dy * displacement),
              ),
            );
            const sample = (sy * canvas.width + sx) * 4;
            const dest = (row * side + col) * 4;
            const highlight =
              ((row ^ col) & 3) === 0 ? 36 * strength : 5 * strength;
            buffer[dest] = pixels[sample] + highlight;
            buffer[dest + 1] = pixels[sample + 1] + highlight;
            buffer[dest + 2] = pixels[sample + 2] + highlight;
            buffer[dest + 3] = Math.min(255, strength * 520);
          }
        }

        if (previous) context.clearRect(...previous, side, side);
        context.putImageData(patch, left, top);
        previous = [left, top];
      }

      function move(event: PointerEvent) {
        if (event.pointerType !== "mouse" || event.target !== stage) {
          reset();
          return;
        }
        clientX = event.clientX;
        clientY = event.clientY;
        if (!frame) frame = requestAnimationFrame(draw);
      }

      const resize = new ResizeObserver(size);
      resize.observe(canvas);
      stage.addEventListener("pointermove", move, { passive: true });
      stage.addEventListener("pointerleave", reset);
      stage.addEventListener("pointercancel", reset);
      stop = () => {
        reset();
        resize.disconnect();
        stage.removeEventListener("pointermove", move);
        stage.removeEventListener("pointerleave", reset);
        stage.removeEventListener("pointercancel", reset);
        canvas.width = 1;
        canvas.height = 1;
        stop = undefined;
      };
    }

    function sync() {
      if (!motion.matches) {
        stop?.();
        return;
      }
      if (!image.getAttribute("src")) image.src = textureUrl;
      else activate();
    }

    image.addEventListener("load", activate);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      disposed = true;
      motion.removeEventListener("change", sync);
      image.removeEventListener("load", activate);
      stop?.();
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="ch-stage-art" />
      <div aria-hidden="true" className="ch-dither-layer">
        <canvas className="ch-dither-field" height="1" ref={ref} width="1" />
      </div>
    </>
  );
});
