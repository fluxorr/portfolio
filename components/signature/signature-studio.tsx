"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { SignatureApprovalCard } from "./approval-card";
import {
  inkSegment,
  isDot,
  type SignatureDocument,
  type SignaturePoint,
  type SignatureStroke,
  signingPlane,
  strokePath,
} from "./document";

type ActiveStroke = {
  pointerId: number | null;
  points: SignaturePoint[];
  path: string;
  positions: SignaturePoint[];
};
const stamp = (event: Event) =>
  event.timeStamp > 1e12
    ? event.timeStamp - performance.timeOrigin
    : event.timeStamp;

export function SignatureStudio({
  initial,
  onSave,
  onCancel,
}: {
  initial?: SignatureDocument | null;
  onSave: (signature: SignatureDocument) => void;
  onCancel: () => void;
}) {
  const help = useId();
  const [name, setName] = useState(initial?.signerName ?? "");
  const [strokes, setStrokes] = useState<SignatureStroke[]>(
    initial?.strokes ?? [],
  );
  const [space, setSpace] = useState(false);
  const [preview, setPreview] = useState(false);
  const [revision, setRevision] = useState(0);
  const pad = useRef<HTMLButtonElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const live = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const origin = useRef<number | undefined>(undefined);
  const active = useRef<ActiveStroke | null>(null);
  const armed = useRef(false);
  const frame = useRef(0);
  const restoredTime = useRef(initial?.strokes.at(-1)?.endedAt ?? 0);
  const previewRecord = useRef<SignatureDocument | null>(null);

  const finish = useCallback((time = performance.now()) => {
    const current = active.current;
    if (!current) return;
    active.current = null;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    live.current?.removeAttribute("d");
    dot.current?.setAttribute("visibility", "hidden");
    const first = current.points[0];
    const last = current.points.at(-1);
    if (first && last) {
      const end = Math.max(last.t, time - (origin.current ?? time));
      restoredTime.current = end;
      setStrokes((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          points: current.points,
          startedAt: first.t,
          endedAt: end,
        },
      ]);
    }
    const element = pad.current;
    if (
      element &&
      current.pointerId !== null &&
      element.hasPointerCapture(current.pointerId)
    ) {
      element.releasePointerCapture(current.pointerId);
    }
  }, []);

  useEffect(() => {
    function stop() {
      armed.current = false;
      setSpace(false);
      finish();
    }
    function visibility() {
      if (document.hidden) stop();
    }
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
      cancelAnimationFrame(frame.current);
    };
  }, [finish]);

  function paint() {
    frame.current = 0;
    const current = active.current;
    const last = current?.positions.at(-1);
    if (!current || !last) return;
    const previous = current.positions.at(-2);
    if (previous) {
      live.current?.setAttribute(
        "d",
        `${current.path}${inkSegment(current.positions.at(-3), previous, last)}`,
      );
      dot.current?.setAttribute("visibility", "hidden");
    } else {
      dot.current?.setAttribute("cx", String(last.x));
      dot.current?.setAttribute("cy", String(last.y));
      dot.current?.removeAttribute("visibility");
    }
  }

  function sample(event: PointerEvent) {
    const current = active.current;
    const matrix = svg.current?.getScreenCTM();
    if (!current || !matrix) return;
    const inverse = matrix.inverse();
    const coalesced = event.getCoalescedEvents?.();
    const samples = coalesced?.length ? coalesced : [event];
    for (const input of samples) {
      const local = new DOMPoint(input.clientX, input.clientY).matrixTransform(
        inverse,
      );
      const previous = current.points.at(-1);
      const time = stamp(input);
      origin.current ??=
        time - (restoredTime.current ? restoredTime.current + 120 : 0);
      const x =
        Math.round(Math.max(0, Math.min(signingPlane.width, local.x)) * 10) /
        10;
      const y =
        Math.round(Math.max(0, Math.min(signingPlane.height, local.y)) * 10) /
        10;
      const pressure = input.pointerType === "pen" ? input.pressure : undefined;
      const t = Math.max(
        previous?.t ?? restoredTime.current,
        time - origin.current,
      );
      const moved = previous?.x !== x || previous.y !== y;
      if (
        previous &&
        !moved &&
        previous.pressure === pressure &&
        previous.t === t
      )
        continue;
      const point = { x, y, t, pressure };
      current.points.push(point);
      if (!moved) continue;
      const positions = current.positions;
      const recent = positions.at(-1);
      const prior = positions.at(-2);
      if (!recent) current.path = `M${x} ${y}`;
      else if (prior)
        current.path += inkSegment(positions.at(-3), prior, recent, point);
      positions.push(point);
    }
    if (!frame.current) frame.current = requestAnimationFrame(paint);
  }

  function begin(
    event: ReactPointerEvent<HTMLButtonElement>,
    pointerId: number | null,
  ) {
    setPreview(false);
    active.current = { pointerId, points: [], path: "", positions: [] };
    sample(event.nativeEvent);
  }

  function record(): SignatureDocument {
    return {
      version: 1,
      canvas: signingPlane,
      strokes,
      signerName: name.trim(),
      createdAt: new Date().toISOString(),
    };
  }

  function changeStrokes(clear: boolean) {
    finish();
    setPreview(false);
    setStrokes((previous) => (clear ? [] : previous.slice(0, -1)));
    if (clear) {
      origin.current = undefined;
      restoredTime.current = 0;
    }
  }

  return (
    <div className="signature-studio">
      <header>
        <div>
          <h2>Your signature</h2>
          <p>Draw with your trackpad, mouse, or finger.</p>
        </div>
        <button
          type="button"
          aria-label="Close signature studio"
          className="signature-close"
          onClick={onCancel}
        >
          ×
        </button>
      </header>
      <label className="signature-input">
        Signer name{" "}
        <input
          type="text"
          value={name}
          maxLength={100}
          onChange={(event) => {
            setName(event.target.value);
            setPreview(false);
          }}
          placeholder="Optional"
          autoComplete="off"
        />
      </label>
      <button
        type="button"
        className="signature-pad"
        aria-label="Signature drawing surface"
        aria-describedby={help}
        ref={pad}
        data-space={space}
        onPointerDown={(event) => {
          if (event.button !== 0 || !event.isPrimary || active.current) return;
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          begin(event, event.pointerId);
        }}
        onPointerMove={(event) => {
          if (active.current && active.current.pointerId === event.pointerId)
            sample(event.nativeEvent);
          else if (
            armed.current &&
            event.pointerType === "mouse" &&
            !event.buttons
          ) {
            if (!active.current) begin(event, null);
            else if (active.current.pointerId === null)
              sample(event.nativeEvent);
          }
        }}
        onPointerUp={(event) => {
          if (active.current?.pointerId === event.pointerId) {
            sample(event.nativeEvent);
            finish(stamp(event.nativeEvent));
          }
        }}
        onPointerCancel={(event) => {
          if (active.current?.pointerId === event.pointerId)
            finish(stamp(event.nativeEvent));
        }}
        onLostPointerCapture={(event) => {
          if (active.current?.pointerId === event.pointerId)
            finish(stamp(event.nativeEvent));
        }}
        onPointerLeave={() => {
          if (active.current?.pointerId === null) finish();
        }}
        onKeyDown={(event) => {
          if (event.code !== "Space") return;
          event.preventDefault();
          if (!event.repeat && !active.current) {
            armed.current = true;
            setSpace(true);
          }
        }}
        onKeyUp={(event) => {
          if (event.code !== "Space") return;
          event.preventDefault();
          armed.current = false;
          setSpace(false);
          if (active.current?.pointerId === null)
            finish(stamp(event.nativeEvent));
        }}
        onBlur={() => {
          armed.current = false;
          setSpace(false);
          if (active.current?.pointerId === null) finish();
        }}
      >
        <svg aria-hidden="true" ref={svg} viewBox="0 0 1000 400">
          <path
            d="M48 292H952"
            stroke="#353538"
            strokeDasharray="2 7"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {strokes.map(({ id, points }) =>
            isDot(points) ? (
              <circle
                key={id}
                cx={points[0].x}
                cy={points[0].y}
                r="2"
                fill="currentColor"
              />
            ) : (
              <path
                key={id}
                d={strokePath(points)}
                className="signature-pad-line"
              />
            ),
          )}
          <path ref={live} className="signature-pad-line" />
          <circle ref={dot} r="2" fill="currentColor" visibility="hidden" />
        </svg>
      </button>
      <p id={help} className="signature-help">
        <span className="signature-mouse-help">
          {space
            ? "Space held. Move the pointer to draw."
            : "Click and drag, or focus the pad and hold Space while moving."}
        </span>
        <span className="signature-touch-help">Draw directly on the pad.</span>
      </p>
      <div className="signature-studio-actions">
        <div>
          <button
            type="button"
            disabled={!strokes.length}
            onClick={() => changeStrokes(false)}
          >
            Undo
          </button>
          <button
            type="button"
            disabled={!strokes.length}
            onClick={() => changeStrokes(true)}
          >
            Clear
          </button>
        </div>
        <div>
          <button
            type="button"
            disabled={!strokes.length}
            onClick={() => {
              previewRecord.current = record();
              setPreview(true);
              setRevision((value) => value + 1);
            }}
          >
            Preview
          </button>
          <button
            type="button"
            className="signature-primary"
            disabled={!strokes.length}
            onClick={() => onSave(record())}
          >
            Use signature
          </button>
        </div>
      </div>
      {preview && (
        <div className="signature-studio-preview">
          <SignatureApprovalCard
            signature={previewRecord.current}
            replay={revision}
          />
        </div>
      )}
    </div>
  );
}
