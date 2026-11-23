"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";
import { Arrow } from "../links";
import { usePointerPosition } from "./use-pointer-position";

const files = [
  {
    id: "platform",
    name: "Platform frame",
    kind: "Still",
    image: "/showcase/night-signal-platform.webp",
    note: "Opening frame for Night Signal, set on a rain-soaked railway platform.",
  },
  {
    id: "street",
    name: "Street frame",
    kind: "Still",
    image: "/showcase/night-signal-street.webp",
    note: "The second frame moves from the platform to the city outside.",
  },
  {
    id: "treatment",
    name: "Director’s notes",
    kind: "Text",
    image: null,
    note: "Follow the reflections and let each cut shift the point of view.",
  },
  {
    id: "palette",
    name: "Color study",
    kind: "Swatches",
    image: null,
    note: "Ink shadows, night teal, and brake-light red set the palette.",
  },
] as const;

export function GlassFolder() {
  const stageRef = usePointerPosition<HTMLDivElement>();
  const [mode, setMode] = useState<"closed" | "hover" | "pinned">("closed");
  const [active, setActive] = useState<(typeof files)[number]>();
  const open = mode !== "closed";

  function close() {
    setMode("closed");
    setActive(undefined);
  }

  return (
    <div className="demo-folder-stage" ref={stageRef}>
      <div
        className="demo-folder"
        data-open={open}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && mode === "closed") {
            setMode("hover");
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse" && mode === "hover") close();
        }}
      >
        <div aria-hidden="true" className="demo-folder-back" />
        <div className="demo-folder-pocket">
          <div>
            <h4>Project files</h4>
            <p>{files.length} files</p>
          </div>
          <button
            aria-controls="glass-folder-files"
            aria-expanded={open}
            aria-label={open ? "Close project folder" : "Open project folder"}
            className="demo-folder-toggle"
            onClick={() => {
              if (open) close();
              else setMode("pinned");
            }}
            type="button"
          >
            <Arrow direction="down" />
          </button>
        </div>
        <div
          aria-hidden={!open}
          className="demo-folder-files"
          id="glass-folder-files"
          inert={!open}
        >
          {files.map((file, index) => (
            <button
              aria-pressed={active?.id === file.id}
              className={`demo-folder-file demo-folder-file--${file.id}`}
              key={file.id}
              onClick={() => {
                setMode("pinned");
                setActive(file);
              }}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) {
                  setMode("pinned");
                }
              }}
              style={{ "--file-order": index } as CSSProperties}
              type="button"
            >
              <span aria-hidden="true" className="demo-folder-file-icon">
                {file.image ? (
                  <Image alt="" fill sizes="34px" src={file.image} />
                ) : null}
              </span>
              <span className="demo-folder-file-name">{file.name}</span>
              <span className="demo-folder-file-type">{file.kind}</span>
            </button>
          ))}
        </div>
      </div>
      <output className="demo-folder-status">
        {open ? (
          <span key={active?.id ?? "open"}>
            {active?.note ?? "Select a file to see its details."}
          </span>
        ) : null}
      </output>
    </div>
  );
}
