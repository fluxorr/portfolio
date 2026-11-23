"use client";

import { type PointerEvent, useId, useState } from "react";
import {
  type AssetRecord,
  type EvidenceStage,
  sampleRecord,
} from "@/lib/atelier/provenance";
import "./study-common.css";
import "./palimpsest.css";

const pins = {
  origin: { x: 391, y: 260, index: "01" },
  revisions: { x: 445, y: 380, index: "02" },
  custody: { x: 560, y: 99, index: "03" },
} as const;

export function Palimpsest({
  record = sampleRecord,
  onStageChange,
  onRevisionSelect,
  onCopy,
  onOpenSource,
}: {
  record?: AssetRecord;
  onStageChange?: (id: EvidenceStage["id"]) => void;
  onRevisionSelect?: (id: string) => void;
  onCopy?: (hash: string) => void;
  onOpenSource?: (href: string) => void;
}) {
  const id = useId();
  const [stageId, setStageId] = useState<EvidenceStage["id"] | undefined>(
    record.stages[0]?.id,
  );
  const [revisionId, setRevisionId] = useState(record.revisions.at(-1)?.id);
  const [drawer, setDrawer] = useState(false);
  const [notice, setNotice] = useState("");
  const [split, setSplit] = useState(50);
  const [missingImage, setMissingImage] = useState<string>();
  const selected =
    record.stages.find((stage) => stage.id === stageId) ?? record.stages[0];
  const revision =
    record.revisions.find((entry) => entry.id === revisionId) ??
    record.revisions.at(-1);
  const pin = selected ? pins[selected.id] : null;

  function select(stage: EvidenceStage) {
    setStageId(stage.id);
    setDrawer(true);
    setNotice("");
    onStageChange?.(stage.id);
  }

  function moveLens(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      !matchMedia("(prefers-reduced-motion: no-preference)").matches
    )
      return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 780;
    const y = ((event.clientY - box.top) / box.height) * 565;
    event.currentTarget.style.setProperty(
      "--lens-x",
      `${event.clientX - box.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--lens-y",
      `${event.clientY - box.top}px`,
    );
    const nearest = record.stages.reduce<EvidenceStage | undefined>(
      (best, stage) => {
        const distance = (item: EvidenceStage) =>
          Math.hypot(pins[item.id].x - x, pins[item.id].y - y);
        return !best || distance(stage) < distance(best) ? stage : best;
      },
      undefined,
    );
    const leader = event.currentTarget.querySelector("line");
    const annotation = event.currentTarget.querySelector(".archive-lens-note");
    if (nearest) {
      const point = pins[nearest.id];
      leader?.setAttribute("x1", String(x));
      leader?.setAttribute("y1", String(y));
      leader?.setAttribute("x2", String(point.x));
      leader?.setAttribute("y2", String(point.y));
      if (annotation)
        annotation.textContent = `${point.index} / ${nearest.title}`;
    }
  }

  async function copyHash(hash: string) {
    try {
      await navigator.clipboard.writeText(hash);
      setNotice("Hash copied");
      onCopy?.(hash);
    } catch {
      setNotice("Clipboard unavailable. Select the hash to copy it.");
    }
  }

  return (
    <div className="archive">
      <div className="archive-top">
        <span className="study-code">Archive / Object {record.id}</span>
        <span className="study-code">
          {record.sample ? "Sample record" : "Evidence system"}
        </span>
      </div>
      <div className="archive-exhibit">
        <div className="archive-description">
          <p className="archive-edition">The Asterion Register</p>
          <p className="archive-headline">
            The image, and everything behind it.
          </p>
          <dl>
            <div>
              <dt>Asset</dt>
              <dd>{record.title}</dd>
            </div>
            <div>
              <dt>Attribution</dt>
              <dd>{record.contributor}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{record.created}</dd>
            </div>
            <div>
              <dt>License claim</dt>
              <dd>{record.license}</dd>
            </div>
          </dl>
        </div>
        <div className="archive-object" onPointerMove={moveLens}>
          {/* biome-ignore lint/performance/noImgElement: Original vector is drawn at its native aspect ratio. */}
          <img
            src="/studies/asterion.svg"
            alt="An engraved armillary register with offset rings, a landscape lens, and a ribbon of record marks."
            width="780"
            height="565"
            fetchPriority="high"
          />
          <div className="archive-lens" aria-hidden="true" />
          {pin && (
            <svg
              className="archive-leader"
              aria-hidden="true"
              viewBox="0 0 780 565"
            >
              <line x1={pin.x} y1={pin.y} x2={pin.x} y2={pin.y} />
            </svg>
          )}
          <span className="archive-lens-note study-code" aria-hidden="true" />
          {selected && drawer && (
            <svg
              className="archive-trace"
              viewBox="0 0 780 565"
              aria-hidden="true"
            >
              <path
                key={selected.id}
                pathLength="1"
                d={
                  selected.id === "origin"
                    ? "M203 345c42-15 72-11 100-1"
                    : selected.id === "revisions"
                      ? "M305 346c47 15 81 34 144 22"
                      : "M450 368c59-6 101-35 126-65"
                }
              />
            </svg>
          )}
          {record.stages.map((stage) => {
            const point = pins[stage.id];
            return (
              <button
                key={stage.id}
                type="button"
                className="archive-pin"
                aria-label={`Inspect ${stage.title}`}
                aria-pressed={selected?.id === stage.id}
                style={{
                  left: `${(point.x / 780) * 100}%`,
                  top: `${(point.y / 565) * 100}%`,
                }}
                onClick={() => select(stage)}
              >
                <span>{point.index}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="archive-register">
        {record.stages.map((stage) => (
          <button
            type="button"
            key={stage.id}
            aria-pressed={selected?.id === stage.id && drawer}
            onClick={() => select(stage)}
          >
            <small>{pins[stage.id].index}</small>
            {stage.title}
          </button>
        ))}
      </div>
      <div className="archive-drawer">
        <button
          className="archive-drawer-toggle"
          aria-expanded={drawer}
          aria-controls={id}
          type="button"
          onClick={() => setDrawer(!drawer)}
        >
          <span>Evidence drawer</span>
          <small>{record.stages.length} recorded stages</small>
          <span aria-hidden="true">{drawer ? "−" : "+"}</span>
        </button>
        <div id={id} className="archive-drawer-body" hidden={!drawer}>
          {selected ? (
            <div className="archive-evidence" key={selected.id}>
              <div>
                <p className="study-code">
                  E / {pins[selected.id].index} · {selected.date}
                </p>
                <h2>{selected.title}</h2>
                <p>{selected.text}</p>
                <p className="archive-claim" data-status={selected.status}>
                  {selected.status} <span>· {selected.by}</span>
                </p>
                {selected.source && (
                  <a
                    className="study-textlink"
                    href={selected.source.href}
                    onClick={() => {
                      if (selected.source) onOpenSource?.(selected.source.href);
                    }}
                  >
                    {" "}
                    {selected.source.label} ↗
                  </a>
                )}
                {selected.hash && (
                  <div className="archive-checksum">
                    <span className="study-code">SHA-256 · source bytes</span>
                    <code>{selected.hash}</code>
                    <button
                      type="button"
                      onClick={() => {
                        if (selected.hash) void copyHash(selected.hash);
                      }}
                    >
                      Copy hash
                    </button>
                  </div>
                )}
              </div>
              <div className="archive-history">
                {record.image && missingImage !== record.image ? (
                  // biome-ignore lint/performance/noImgElement: Records may supply remote or local artwork.
                  <img
                    src={record.image}
                    alt={`${record.title} cover artwork`}
                    loading="lazy"
                    width="72"
                    height="90"
                    onError={() => setMissingImage(record.image)}
                  />
                ) : (
                  <p className="study-code">Artwork unavailable</p>
                )}
                {revision && (
                  <>
                    <p className="study-code">Revision history</p>
                    <div className="archive-versions">
                      {record.revisions.map((entry) => (
                        <button
                          key={entry.id}
                          aria-pressed={revision.id === entry.id}
                          type="button"
                          onClick={() => {
                            setRevisionId(entry.id);
                            setSplit(50);
                            onRevisionSelect?.(entry.id);
                          }}
                        >
                          <strong>{entry.id}</strong>
                          <small>{entry.date}</small>
                        </button>
                      ))}
                    </div>
                    <p aria-live="polite">{revision.note}</p>
                    {revision.versions && (
                      <div className="archive-diff">
                        {/* biome-ignore lint/performance/noImgElement: Revision URLs come from the supplied record. */}
                        <img
                          src={revision.versions.after}
                          alt="Artwork after revision"
                        />
                        {/* biome-ignore lint/performance/noImgElement: Revision URLs come from the supplied record. */}
                        <img
                          src={revision.versions.before}
                          alt="Artwork before revision"
                          style={{
                            clipPath: `inset(0 ${100 - split}% 0 0)`,
                          }}
                        />
                        <label>
                          Compare before and after
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={split}
                            onChange={(event) =>
                              setSplit(event.currentTarget.valueAsNumber)
                            }
                          />
                        </label>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="archive-empty">
              This asset has no recorded evidence yet.
            </p>
          )}
          <output className="archive-notice">{notice}</output>
        </div>
      </div>
    </div>
  );
}
