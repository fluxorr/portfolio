"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { answers, getMemory, memories, sourceLabels } from "@/lib/memoir";
import { MemoirIcon } from "./brand";
import { GuidedAsk } from "./guided-ask";
import { SourceInspector } from "./source-inspector";
import { WorkspaceFrame } from "./workspace-frame";

const modes = ["Remember", "Connect", "Ask"] as const;
const timelineIds = ["m-01", "m-02", "m-03", "m-04", "m-05"];

export function Thread({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 74"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3 13h46c49 0 54 48 104 48h23c51 0 58-48 107-48h34" />
      <path
        className="mm-thread-draw"
        d="M3 13h46c49 0 54 48 104 48h23c51 0 58-48 107-48h34"
        pathLength="1"
      />
      <circle cx="4" cy="13" r="3" />
      <circle cx="316" cy="13" r="3" />
    </svg>
  );
}

export function MemoryConsole() {
  const [mode, setMode] = useState<string>("Ask");
  const [selected, setSelected] = useState("m-01");
  const [extra, setExtra] = useState(false);
  const [filter, setFilter] = useState("");
  const [hovered, setHovered] = useState<string>();
  const [focused, setFocused] = useState<string>();
  const id = useId();
  const reduced = useReducedMotion();
  const memory = getMemory(selected);
  const related = getMemory(memory.relatedMemoryIds[0]);
  const inspected = getMemory(hovered ?? focused ?? selected);
  const records = extra ? [memories[6].id, ...timelineIds] : timelineIds;
  const query = filter.trim().toLowerCase();
  const visibleRecords = query
    ? memories
        .filter((entry) => entry.id !== "m-07" || extra)
        .filter(({ title, people, tags }) =>
          [title, ...people, ...tags].join(" ").toLowerCase().includes(query),
        )
        .map(({ id }) => id)
    : records.includes(selected)
      ? records
      : [selected, ...records];

  function selectSource(sourceId: string) {
    setSelected(sourceId);
    setHovered(undefined);
    setFocused(undefined);
  }

  return (
    <Tabs.Root value={mode} onValueChange={setMode}>
      <WorkspaceFrame
        controls={
          <Tabs.List
            className="mm-console-tabs"
            aria-label="Memory console mode"
          >
            {modes.map((label) => (
              <Tabs.Trigger key={label} value={label}>
                {!reduced && mode === label && (
                  <motion.span
                    className="mm-tab-indicator"
                    layoutId={id}
                    transition={{ duration: 0.26 }}
                  />
                )}
                <span>{label}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        }
      >
        <div className="mm-console mm-console-main">
          <div className="mm-stream">
            <label className="mm-source-filter">
              <MemoirIcon name="search" />
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter sources"
                placeholder="Filter sources"
              />
            </label>
            <div className="mm-stream-list">
              {visibleRecords.length === 0 && (
                <p className="mm-stream-empty">No matching sources.</p>
              )}
              {visibleRecords.map((sourceId) => {
                const source = getMemory(sourceId);
                return (
                  <button
                    className="mm-stream-source"
                    key={source.id}
                    type="button"
                    aria-pressed={selected === source.id}
                    onClick={() => selectSource(source.id)}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setHovered(source.id);
                    }}
                    onPointerLeave={() => setHovered(undefined)}
                    onFocus={() => setFocused(source.id)}
                    onBlur={() => setFocused(undefined)}
                  >
                    <span
                      className="mm-source-icon"
                      data-type={source.sourceType}
                    >
                      <MemoirIcon name={source.sourceType} />
                    </span>
                    <span>
                      <strong>{source.title}</strong>
                      <small>{source.capturedAt}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mm-console-content">
            <Tabs.Content value="Ask" className="mm-console-panel">
              <GuidedAsk initialAnswer={answers[0]} onSource={selectSource} />
            </Tabs.Content>
            <Tabs.Content
              value="Remember"
              className="mm-console-panel mm-capture-panel"
            >
              <div key={selected} className="mm-capture-record">
                <span className="mm-label">
                  {sourceLabels[memory.sourceType]} · {memory.capturedAt}
                </span>
                <strong>{memory.title}</strong>
                <p>
                  <mark>{memory.excerpt}</mark>
                </p>
              </div>
              <div className="mm-memory-extract">
                <MemoirIcon name="note" />
                <span>
                  <strong>Memory record</strong>
                  <small>
                    {memory.tags.join(" · ")}
                    {memory.people.length > 0 &&
                      ` · ${memory.people.join(", ")}`}
                  </small>
                </span>
              </div>
              <button
                className="mm-small-action"
                type="button"
                disabled={extra}
                onClick={() => {
                  setExtra(true);
                  setFilter("");
                  selectSource("m-07");
                }}
              >
                {extra ? "Sample note captured" : "Capture a sample note"}
                <MemoirIcon name={extra ? "check" : "plus"} />
              </button>
            </Tabs.Content>
            <Tabs.Content
              value="Connect"
              className="mm-console-panel mm-connect-panel"
            >
              <div className="mm-connect-record">
                <MemoirIcon name={memory.sourceType} />
                <span>
                  <strong>{memory.title}</strong>
                  <small>{memory.capturedAt}</small>
                </span>
              </div>
              <Thread className="mm-console-thread" key={selected} />
              <div className="mm-connect-record">
                <MemoirIcon name={related.sourceType} />
                <span>
                  <strong>{related.title}</strong>
                  <small>{related.capturedAt}</small>
                </span>
              </div>
              <p className="mm-connect-context">{related.excerpt}</p>
            </Tabs.Content>
          </div>
          <SourceInspector
            memory={inspected}
            previewing={inspected.id !== selected}
            onSelect={selectSource}
          />
        </div>
      </WorkspaceFrame>
    </Tabs.Root>
  );
}
