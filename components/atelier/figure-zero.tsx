"use client";

import {
  type PointerEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { downloadFile } from "@/lib/atelier/browser";
import {
  constrain,
  controlsFor,
  defaultShape,
  type Family,
  polar,
  presets,
  type Shape,
  type ShapeKey,
  symbolSVG,
} from "@/lib/atelier/geometry";
import { Mark } from "./visuals";
import "./study-common.css";
import "./figure-zero.css";

type History = {
  shape: Shape;
  past: Shape[];
  future: Shape[];
  starting?: Shape;
};
type Edit =
  | { type: "change" | "drag"; shape: Shape }
  | { type: "undo" | "redo" | "start" | "finish" | "cancel" };

function updateHistory(state: History, action: Edit): History {
  if (action.type === "start") return { ...state, starting: state.shape };
  if (action.type === "drag") return { ...state, shape: action.shape };
  if (action.type === "cancel")
    return {
      ...state,
      shape: state.starting ?? state.shape,
      starting: undefined,
    };
  if (action.type === "finish") {
    if (!state.starting || state.starting === state.shape)
      return { ...state, starting: undefined };
    return {
      shape: state.shape,
      past: [...state.past.slice(-59), state.starting],
      future: [],
    };
  }
  if (action.type === "undo") {
    const previous = state.past.at(-1);
    return previous
      ? {
          shape: previous,
          past: state.past.slice(0, -1),
          future: [state.shape, ...state.future],
        }
      : state;
  }
  if (action.type === "redo") {
    const next = state.future[0];
    return next
      ? {
          shape: next,
          past: [...state.past, state.shape],
          future: state.future.slice(1),
        }
      : state;
  }
  if (
    action.type === "change" &&
    JSON.stringify(state.shape) !== JSON.stringify(action.shape)
  ) {
    return {
      shape: action.shape,
      past: [...state.past.slice(-59), state.shape],
      future: [],
    };
  }
  return state;
}

export function FigureZero({
  initialShape = defaultShape,
  onMarkChange,
}: {
  initialShape?: Shape;
  onMarkChange?: (shape: Shape) => void;
}) {
  const [{ shape, past, future, starting }, dispatch] = useReducer(
    updateHistory,
    { shape: initialShape, past: [], future: [] },
  );
  const [guides, setGuides] = useState(false);
  const [proof, setProof] = useState(false);
  const [size, setSize] = useState(1024);
  const [notice, setNotice] = useState("");
  const [invalid, setInvalid] = useState<ShapeKey>();
  const drawing = useRef<SVGSVGElement>(null);
  const pointer = useRef<{ key: ShapeKey; id: number } | null>(null);
  useEffect(() => onMarkChange?.(shape), [onMarkChange, shape]);

  function handleDown(event: PointerEvent<SVGCircleElement>, key: ShapeKey) {
    if (!event.isPrimary || event.button !== 0) return;
    pointer.current = { key, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    dispatch({ type: "start" });
  }
  function handleMove(event: PointerEvent<SVGCircleElement>) {
    const current = pointer.current;
    const transform = drawing.current?.getScreenCTM();
    if (current?.id !== event.pointerId || !transform) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      transform.inverse(),
    );
    const value =
      current.key === "radius"
        ? Math.hypot(point.x, point.y)
        : (Math.atan2(point.y, point.x) * 180) / Math.PI;
    dispatch({ type: "drag", shape: constrain(shape, current.key, value) });
  }
  function handleEnd(event: PointerEvent<SVGCircleElement>, finish: boolean) {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    dispatch({ type: finish ? "finish" : "cancel" });
  }
  function change(next: Shape) {
    dispatch({ type: "change", shape: next });
    setNotice("");
    setInvalid(undefined);
  }

  async function copySVG() {
    try {
      await navigator.clipboard.writeText(symbolSVG(shape));
      setNotice("SVG copied");
    } catch {
      setNotice("Clipboard unavailable. Export SVG to save the mark.");
    }
  }

  async function exportPNG() {
    const url = URL.createObjectURL(
      new Blob([symbolSVG(shape)], { type: "image/svg+xml" }),
    );
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(image, 0, 0, size, size);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("PNG unavailable");
      downloadFile(
        blob,
        "image/png",
        `figure-zero-${shape.family.toLowerCase()}-${size}.png`,
      );
      setNotice(`Transparent ${size} px PNG exported`);
    } catch {
      setNotice("PNG export was unavailable. SVG export remains available.");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const [rotationX, rotationY] = polar(115, shape.rotation);
  const [radiusX, radiusY] = polar(shape.radius, -95);
  const nodes = [
    { key: "radius" as const, x: radiusX, y: radiusY },
    { key: "rotation" as const, x: rotationX, y: rotationY },
  ];

  return (
    <div
      className="figure-press"
      onKeyDownCapture={(event) => {
        if (
          !(event.metaKey || event.ctrlKey) ||
          !["z", "y"].includes(event.key.toLowerCase()) ||
          (event.target instanceof HTMLInputElement &&
            event.target.type === "number")
        )
          return;
        event.preventDefault();
        dispatch({
          type:
            event.shiftKey || event.key.toLowerCase() === "y" ? "redo" : "undo",
        });
      }}
    >
      <div className="figure-mast">
        <span className="study-code">
          Figure / Zero <span>· symbol press</span>
        </span>
        <div>
          <button
            type="button"
            aria-pressed={guides}
            onClick={() => setGuides(!guides)}
          >
            Guides
          </button>
          <button
            type="button"
            aria-pressed={proof}
            onClick={() => setProof(!proof)}
          >
            Night proof
          </button>
        </div>
      </div>
      <div className="figure-workspace">
        <div className="figure-families">
          <p className="study-code">Families</p>
          {(Object.keys(presets) as Family[]).map((family) => (
            <button
              key={family}
              type="button"
              aria-pressed={shape.family === family}
              onClick={() => change(presets[family][0].shape)}
            >
              <svg aria-hidden="true" viewBox="-128 -128 256 256">
                <Mark shape={presets[family][0].shape} />
              </svg>
              {family}
            </button>
          ))}
          <label className="figure-presets">
            <span className="study-code">Preset</span>
            <select
              value={
                presets[shape.family].find(
                  (preset) =>
                    JSON.stringify(preset.shape) === JSON.stringify(shape),
                )?.name ?? ""
              }
              onChange={(event) => {
                const preset = presets[shape.family].find(
                  ({ name }) => name === event.target.value,
                );
                if (preset) change(preset.shape);
              }}
            >
              <option value="" disabled>
                Custom
              </option>
              {presets[shape.family].map(({ name }) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
        <div
          className="figure-sheet"
          data-guides={guides || starting !== undefined}
          data-proof={proof}
        >
          <div className="figure-sheet-corner study-code">
            Construction plate <span>/ {shape.family}</span>
          </div>
          <svg
            ref={drawing}
            viewBox="-140 -140 280 280"
            aria-label={`${shape.family} symbol drawing`}
            role="img"
          >
            <g className="figure-construction">
              <path d="M-136 0h272M0-136v272M-130-130l260 260m0-260-260 260" />
              <circle r={shape.radius} />
              <circle r={shape.radius * 0.5} />
              <path
                d={
                  "M0 0L" +
                  rotationX +
                  " " +
                  rotationY +
                  "M0 0L" +
                  radiusX +
                  " " +
                  radiusY
                }
              />
            </g>
            {starting && (
              <g className="figure-ghost">
                <Mark shape={starting} />
              </g>
            )}
            <g key={shape.family} className="figure-mark">
              <Mark shape={shape} />
            </g>
            <g className="figure-construction figure-handles">
              {nodes.map((node) => (
                <g key={node.key}>
                  <circle cx={node.x} cy={node.y} r="5" />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="15"
                    className="figure-hit"
                    onPointerDown={(event) => handleDown(event, node.key)}
                    onPointerMove={handleMove}
                    onPointerUp={(event) => handleEnd(event, true)}
                    onPointerCancel={(event) => handleEnd(event, false)}
                    onLostPointerCapture={(event) => handleEnd(event, false)}
                  />
                </g>
              ))}
            </g>
          </svg>
          <div className="figure-sheet-end study-code">
            <span>R {shape.radius}</span>
            <span>θ {shape.rotation}°</span>
          </div>
        </div>
        <div className="figure-controls">
          <h2>Set the geometry.</h2>
          {controlsFor(shape).map((control) => (
            <div className="figure-parameter" key={shape.family + control.key}>
              <label className="figure-range">
                <span>{control.label}</span>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  value={shape[control.key]}
                  onChange={(event) =>
                    change(
                      constrain(
                        shape,
                        control.key,
                        event.currentTarget.valueAsNumber,
                      ),
                    )
                  }
                />
              </label>
              <input
                key={shape[control.key]}
                className="figure-number"
                type="number"
                aria-label={`${control.label} value`}
                aria-invalid={invalid === control.key}
                min={control.min}
                max={control.max}
                defaultValue={shape[control.key]}
                onBlur={(event) => {
                  if (event.target.validity.valid && event.target.value !== "")
                    change(
                      constrain(shape, control.key, event.target.valueAsNumber),
                    );
                  else {
                    setInvalid(control.key);
                    setNotice(
                      control.label +
                        " must be between " +
                        control.min +
                        " and " +
                        control.max +
                        ".",
                    );
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="figure-foot">
        <div className="figure-history">
          <button
            type="button"
            disabled={!past.length}
            onClick={() => dispatch({ type: "undo" })}
          >
            Undo
          </button>
          <button
            type="button"
            disabled={!future.length}
            onClick={() => dispatch({ type: "redo" })}
          >
            Redo
          </button>
          <button type="button" onClick={() => change(initialShape)}>
            Reset
          </button>
        </div>
        <div className="figure-exports">
          <button type="button" onClick={() => void copySVG()}>
            Copy SVG
          </button>
          <button
            type="button"
            onClick={() => {
              downloadFile(
                symbolSVG(shape),
                "image/svg+xml",
                `figure-zero-${shape.family.toLowerCase()}.svg`,
              );
              setNotice("SVG exported");
            }}
          >
            Export SVG
          </button>
          <label>
            <span className="study-sr">PNG size</span>
            <select
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            >
              {[512, 1024, 2048].map((value) => (
                <option key={value} value={value}>
                  {value} px
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => void exportPNG()}>
            Export PNG ↗
          </button>
        </div>
        <output>{notice}</output>
      </div>
    </div>
  );
}
