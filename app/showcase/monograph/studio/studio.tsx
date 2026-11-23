"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type BrandDirection,
  directionImage,
  directions,
  monographPath,
  readableInk,
} from "../directions";
import { Icon, Wordmark } from "../identity";
import { studioTools } from "./tools";

type Tool = (typeof studioTools)[number]["id"];
type Face = BrandDirection["type"];
type Layout = "split" | "stack" | "poster";
type Position = { x: number; y: number };
const colorRoles = ["Background", "Accent", "Ink"] as const;

function startingPalette(direction: BrandDirection, paper?: string) {
  const palette: string[] = [...direction.palette];
  const index = paper ? palette.indexOf(paper) : 0;
  if (index > 0) [palette[0], palette[index]] = [palette[index], palette[0]];
  return palette;
}

function center(): Position {
  return { x: 0, y: 0 };
}

function clampPosition(value: number) {
  return Math.max(-28, Math.min(28, value));
}

export function Studio({
  initialSlug,
  initialBrief,
  initialPaper,
  initialTool,
}: {
  initialSlug: BrandDirection["slug"];
  initialBrief: string;
  initialPaper?: string;
  initialTool: Tool;
}) {
  const initial =
    directions.find((direction) => direction.slug === initialSlug) ??
    directions[0];
  const [direction, setDirection] = useState<BrandDirection>(initial);
  const [brief, setBrief] = useState(initialBrief);
  const [headline, setHeadline] = useState<string>(initial.line);
  const [tool, setTool] = useState<Tool>(initialTool);
  const [palette, setPalette] = useState(() =>
    startingPalette(initial, initialPaper),
  );
  const [face, setFace] = useState<Face>(initial.type);
  const [weight, setWeight] = useState(620);
  const [tracking, setTracking] = useState(-6);
  const [layout, setLayout] = useState<Layout>("split");
  const [imageSlug, setImageSlug] = useState(initial.slug);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState(center);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("");
  const drag = useRef<{
    pointer: number;
    x: number;
    y: number;
    start: Position;
    width: number;
    height: number;
  }>(null);
  const command = useRef<HTMLDialogElement>(null);
  const commandTrigger = useRef<HTMLButtonElement>(null);
  const art = directions.find(({ slug }) => slug === imageSlug) ?? direction;

  useEffect(() => {
    function openFromShortcut(event: globalThis.KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k")
        return;
      event.preventDefault();
      if (!command.current?.open) command.current?.showModal();
    }
    window.addEventListener("keydown", openFromShortcut);
    return () => window.removeEventListener("keydown", openFromShortcut);
  }, []);

  function resetImage(slug = direction.slug) {
    setImageSlug(slug);
    setZoom(1);
    setRotation(0);
    setPosition(center());
  }

  function loadDirection(
    next: BrandDirection,
    nextBrief: string,
    paper?: string,
  ) {
    setDirection(next);
    setBrief(nextBrief);
    setHeadline(next.line);
    setPalette(startingPalette(next, paper));
    setFace(next.type);
    setWeight(620);
    setTracking(-6);
    setLayout("split");
    resetImage(next.slug);
  }

  function reset() {
    loadDirection(
      direction,
      direction.slug === initialSlug ? initialBrief : direction.brief,
      direction.slug === initialSlug ? initialPaper : undefined,
    );
    setStatus("Board reset.");
  }

  function downloadNotes() {
    const content = [
      direction.name,
      headline,
      "",
      "Brief",
      brief,
      "",
      "Typography",
      `${face} / weight ${weight} / tracking ${tracking}`,
      "",
      "Palette",
      ...palette.map((color, index) => `${colorRoles[index]} ${color}`),
      "",
      "Composition",
      layout,
      "",
      "Campaign image",
      `${art.name} / zoom ${Math.round(zoom * 100)}% / rotation ${rotation}°`,
      `Position from center: ${Math.round(position.x)}%, ${Math.round(position.y)}%`,
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `monograph-${direction.slug}-direction.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Direction notes downloaded.");
  }

  function startMove(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    setTool("image");
    const bounds = event.currentTarget.getBoundingClientRect();
    drag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      start: position,
      width: bounds.width,
      height: bounds.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function moveArt(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (!start || start.pointer !== event.pointerId) return;
    setPosition({
      x: clampPosition(
        start.start.x + ((event.clientX - start.x) / start.width) * 100,
      ),
      y: clampPosition(
        start.start.y + ((event.clientY - start.y) / start.height) * 100,
      ),
    });
  }

  function endMove() {
    drag.current = null;
    setDragging(false);
  }

  function moveArtWithKeys(event: KeyboardEvent<HTMLButtonElement>) {
    const x =
      event.key === "ArrowRight" ? 3 : event.key === "ArrowLeft" ? -3 : 0;
    const y = event.key === "ArrowDown" ? 3 : event.key === "ArrowUp" ? -3 : 0;
    if (!x && !y) return;
    event.preventDefault();
    setTool("image");
    setPosition((current) => ({
      x: clampPosition(current.x + x),
      y: clampPosition(current.y + y),
    }));
  }

  const boardStyle = {
    "--board-paper": palette[0],
    "--board-accent": palette[1],
    "--board-ink": palette[2],
    "--board-text": readableInk(palette[0], palette[2]),
    "--board-weight": weight,
    "--board-tracking": `${tracking / 100}em`,
    "--photo-x": `${position.x}%`,
    "--photo-y": `${position.y}%`,
    "--photo-zoom": zoom,
    "--photo-rotation": `${rotation}deg`,
  } as CSSProperties;

  return (
    <>
      <a className="mg-skip" href="#studio-board">
        Skip to board
      </a>
      <header className="mg-header mg-shell mg-inner-header">
        <Wordmark />
        <div className="mg-studio-header-actions">
          <button
            ref={commandTrigger}
            type="button"
            className="mg-link"
            onClick={() => command.current?.showModal()}
          >
            <Icon name="command" /> Commands
          </button>
          <button type="button" className="mg-button" onClick={downloadNotes}>
            Download notes <Icon name="down" />
          </button>
        </div>
      </header>
      <main className="mg-shell mg-studio">
        <div className="mg-studio-title">
          <div>
            <p className="mg-kicker">
              <span className="mg-dot" /> Interactive demo
            </p>
            <h1>Studio</h1>
          </div>
          <label className="mg-direction-picker">
            Sample direction
            <select
              value={direction.slug}
              onChange={(event) => {
                const next = directions.find(
                  ({ slug }) => slug === event.target.value,
                );
                if (next) loadDirection(next, next.brief);
              }}
            >
              {directions.map(({ slug, name }) => (
                <option value={slug} key={slug}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mg-workspace">
          <section
            className="mg-stage"
            aria-label="Direction board"
            id="studio-board"
            tabIndex={-1}
          >
            <div className="mg-stage-bar mg-kicker">
              <span>{direction.name} / Direction board</span>
              <span>Live preview</span>
            </div>
            <div
              className="mg-board"
              style={boardStyle}
              data-type={face}
              data-layout={layout}
            >
              <div className="mg-board-copy">
                <button
                  type="button"
                  className="mg-board-name"
                  onClick={() => setTool("type")}
                  title="Edit typography"
                >
                  {direction.name}
                </button>
                <p>{headline}</p>
                <div className="mg-board-palette">
                  {palette.map((color, index) => (
                    <button
                      aria-label={`Edit color ${colorRoles[index]}`}
                      key={colorRoles[index]}
                      type="button"
                      onClick={() => setTool("palette")}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
              <button
                className="mg-board-photo"
                type="button"
                aria-label="Move campaign image with arrow keys, or drag"
                data-dragging={dragging}
                onClick={() => setTool("image")}
                onKeyDown={moveArtWithKeys}
                onPointerDown={startMove}
                onPointerMove={moveArt}
                onPointerUp={endMove}
                onLostPointerCapture={endMove}
                onPointerCancel={endMove}
              >
                <span>
                  <Image
                    alt={art.subject}
                    draggable={false}
                    fill
                    src={directionImage(art.slug)}
                    sizes="(max-width: 900px) 82vw, 40vw"
                  />
                </span>
              </button>
            </div>
          </section>
          <aside className="mg-inspector" aria-label="Editing tools">
            <div className="mg-tools">
              {studioTools.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={tool === id}
                  onClick={() => setTool(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mg-tool-fields">
              <h2>{studioTools.find(({ id }) => id === tool)?.label}</h2>
              {tool === "type" && (
                <>
                  <label>
                    Campaign line
                    <input
                      value={headline}
                      maxLength={72}
                      onChange={(event) => setHeadline(event.target.value)}
                    />
                  </label>
                  <label>
                    Typeface
                    <select
                      value={face}
                      onChange={(event) => setFace(event.target.value as Face)}
                    >
                      <option value="sans">Geist Sans</option>
                      <option value="serif">Editorial serif</option>
                      <option value="mono">Monospace</option>
                    </select>
                  </label>
                  <label>
                    <span>
                      Weight{" "}
                      <span className="mg-field-value" aria-hidden="true">
                        {weight}
                      </span>
                    </span>
                    <input
                      type="range"
                      min={350}
                      max={850}
                      step={10}
                      value={weight}
                      onChange={(event) =>
                        setWeight(event.target.valueAsNumber)
                      }
                    />
                  </label>
                  <label>
                    <span>
                      Tracking{" "}
                      <span className="mg-field-value" aria-hidden="true">
                        {tracking}
                      </span>
                    </span>
                    <input
                      type="range"
                      min={-10}
                      max={12}
                      value={tracking}
                      onChange={(event) =>
                        setTracking(event.target.valueAsNumber)
                      }
                    />
                  </label>
                </>
              )}
              {tool === "palette" &&
                palette.map((color, index) => (
                  <label className="mg-color-field" key={colorRoles[index]}>
                    <span>
                      {colorRoles[index]}
                      <code>{color}</code>
                    </span>
                    <input
                      type="color"
                      value={color}
                      onChange={(event) =>
                        setPalette((current) =>
                          current.map((value, colorIndex) =>
                            colorIndex === index ? event.target.value : value,
                          ),
                        )
                      }
                    />
                  </label>
                ))}
              {tool === "image" && (
                <>
                  <label>
                    Campaign photograph
                    <select
                      value={imageSlug}
                      onChange={(event) => {
                        const next = directions.find(
                          ({ slug }) => slug === event.target.value,
                        );
                        if (next) resetImage(next.slug);
                      }}
                    >
                      {directions.map(({ slug, name }) => (
                        <option value={slug} key={slug}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>
                      Zoom{" "}
                      <span className="mg-field-value" aria-hidden="true">
                        {Math.round(zoom * 100)}%
                      </span>
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={2}
                      step={0.01}
                      value={zoom}
                      onChange={(event) => setZoom(event.target.valueAsNumber)}
                    />
                  </label>
                  <label>
                    <span>
                      Rotation{" "}
                      <span className="mg-field-value" aria-hidden="true">
                        {rotation}°
                      </span>
                    </span>
                    <input
                      type="range"
                      min={-25}
                      max={25}
                      value={rotation}
                      onChange={(event) =>
                        setRotation(event.target.valueAsNumber)
                      }
                    />
                  </label>
                  <p>Drag the photograph or move it with the arrow keys.</p>
                  <button
                    type="button"
                    className="mg-link"
                    onClick={() => setPosition(center())}
                  >
                    <Icon name="reset" /> Center photograph
                  </button>
                </>
              )}
              {tool === "layout" && (
                <fieldset className="mg-layout-options">
                  <legend className="mg-sr-only">Board layout</legend>
                  {(["split", "stack", "poster"] as const).map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name="layout"
                        value={option}
                        checked={layout === option}
                        onChange={() => setLayout(option)}
                      />
                      {option}
                    </label>
                  ))}
                </fieldset>
              )}
              {tool === "brief" && (
                <label>
                  Project brief
                  <textarea
                    rows={5}
                    maxLength={180}
                    value={brief}
                    onChange={(event) => setBrief(event.target.value)}
                  />
                </label>
              )}
            </div>
            <div className="mg-inspector-footer">
              <button type="button" className="mg-link" onClick={reset}>
                <Icon name="reset" /> Reset board
              </button>
            </div>
          </aside>
        </div>
        <footer className="mg-studio-footer">
          <p>Start with a prebuilt direction and make it your own.</p>
          <Link
            className="mg-link"
            href={`${monographPath}/directions/${direction.slug}`}
          >
            View original direction <Icon name="out" />
          </Link>
        </footer>
        <output className="mg-sr-only">{status}</output>
      </main>
      <dialog
        ref={command}
        className="mg-command"
        aria-labelledby="mg-command-title"
        onClose={() => commandTrigger.current?.focus()}
      >
        <div>
          <h2 id="mg-command-title">Commands</h2>
          <button
            type="button"
            aria-label="Close commands"
            onClick={() => command.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        {studioTools.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTool(id);
              command.current?.close();
            }}
          >
            {label}
            <Icon name="right" />
          </button>
        ))}
      </dialog>
    </>
  );
}
