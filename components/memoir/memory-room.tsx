"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useInView } from "motion/react";
import { type CSSProperties, useRef, useState } from "react";
import { decisions, getMemory, memories, sourceLabels } from "@/lib/memoir";
import { MemoirIcon, MemoirMark } from "./brand";

const points = [
  [29, 18],
  [71, 77],
  [17, 72],
  [19, 33],
  [80, 18],
  [82, 64],
  [11, 14],
  [35, 83],
  [88, 84],
  [90, 34],
  [15, 89],
  [68, 35],
] as const;

export function MemoryRoom() {
  const [selected, setSelected] = useState("m-01");
  const [mode, setMode] = useState("connections");
  const map = useRef<HTMLDivElement>(null);
  const entered = useInView(map, { once: true, amount: 0.2 });
  const record = getMemory(selected);
  const linkedDecision = decisions.find(({ sourceMemoryIds }) =>
    sourceMemoryIds.includes(selected),
  );

  function choices() {
    return memories.map((memory, index) => (
      <button
        type="button"
        className="mm-map-node"
        aria-pressed={selected === memory.id}
        key={memory.id}
        onClick={() => setSelected(memory.id)}
        style={
          {
            "--point-x": `${points[index][0]}%`,
            "--point-y": `${points[index][1]}%`,
          } as CSSProperties
        }
      >
        <span data-cluster={memory.cluster} />
        <strong>{memory.title}</strong>
        <small>{memory.capturedAt}</small>
      </button>
    ));
  }

  return (
    <section
      className="mm-room"
      id="memoir-room"
      aria-labelledby="memoir-room-title"
    >
      <div className="mm-shell mm-section">
        <div className="mm-heading mm-room-heading">
          <div>
            <p className="mm-label">The Memory Room</p>
            <h2 id="memoir-room-title">
              A life doesn’t fit
              <br />
              in folders.
            </h2>
          </div>
          <p>
            A meeting, a passing thought, a name. Follow the links between them
            in the sample library.
          </p>
        </div>
        <Tabs.Root
          className="mm-room-console"
          value={mode}
          onValueChange={setMode}
        >
          <div className="mm-room-bar">
            <span>
              <MemoirMark /> Memory library
            </span>
            <Tabs.List aria-label="Library view" className="mm-room-tabs">
              <Tabs.Trigger value="connections">Connections</Tabs.Trigger>
              <Tabs.Trigger value="timeline">Timeline</Tabs.Trigger>
            </Tabs.List>
          </div>
          <div className="mm-room-columns">
            <Tabs.Content
              value="connections"
              className="mm-network"
              ref={map}
              data-entered={entered}
            >
              <svg
                aria-hidden="true"
                className="mm-network-edges"
                viewBox="0 0 700 420"
                preserveAspectRatio="none"
              >
                {memories.map((memory, index) => {
                  const x = points[index][0] * 7;
                  const y = points[index][1] * 4.2;
                  return (
                    <path
                      key={memory.id}
                      d={`M350 210 C ${350 + (x - 350) * 0.75} 210,${x} ${210 + (y - 210) * 0.75},${x} ${y}`}
                      pathLength="1"
                      data-live={
                        record.id === memory.id ||
                        record.relatedMemoryIds.includes(memory.id)
                      }
                    />
                  );
                })}
              </svg>
              <div className="mm-map-center">
                <MemoirMark />
                <span>You</span>
              </div>
              <div className="mm-map-choices">{choices()}</div>
            </Tabs.Content>
            <Tabs.Content value="timeline" className="mm-network-timeline">
              <div className="mm-map-choices">{choices()}</div>
            </Tabs.Content>
            <aside className="mm-map-detail" aria-label="Selected memory">
              <div className="mm-map-record" key={record.id} aria-live="polite">
                <p className="mm-label">
                  <MemoirIcon name={record.sourceType} />
                  {record.cluster} / {sourceLabels[record.sourceType]}
                </p>
                <h3>{record.title}</h3>
                <p className="mm-map-date">{record.capturedAt}</p>
                <blockquote>{record.excerpt}</blockquote>
                {record.people.length > 0 && (
                  <p className="mm-map-people">{record.people.join(" · ")}</p>
                )}
                {linkedDecision && (
                  <div className="mm-map-decision">
                    <MemoirIcon name="check" />
                    <span>{linkedDecision.text}</span>
                  </div>
                )}
              </div>
              <p className="mm-label">Linked memories</p>
              <div className="mm-map-related">
                {record.relatedMemoryIds.slice(0, 3).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelected(id)}
                  >
                    {getMemory(id).title}
                    <MemoirIcon name="arrow" />
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </Tabs.Root>
        <p className="mm-room-caption mm-label">
          The Memory Room · Sample data
        </p>
      </div>
    </section>
  );
}
