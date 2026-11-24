"use client";

import { getMemory, type Memory, sourceLabels } from "@/lib/memoir";
import { MemoirIcon } from "./brand";

export function SourceInspector({
  memory,
  previewing,
  onSelect,
}: {
  memory: Memory;
  previewing: boolean;
  onSelect: (id: string) => void;
}) {
  const related = getMemory(memory.relatedMemoryIds[0]);
  return (
    <aside className="mm-source-inspector" aria-label="Source inspector">
      <div className="mm-inspector-heading">
        <p className="mm-label">Source inspector</p>
        <span>{previewing ? "Preview" : "Selected"}</span>
      </div>
      <div className="mm-inspected-record" key={memory.id}>
        <p className="mm-label">
          {sourceLabels[memory.sourceType]} · {memory.capturedAt}
        </p>
        <strong>{memory.title}</strong>
        <blockquote>{memory.excerpt}</blockquote>
        <dl className="mm-inspector-meta">
          <div>
            <dt>Project</dt>
            <dd>{memory.tags.join(", ")}</dd>
          </div>
          {memory.people.length > 0 && (
            <div>
              <dt>People</dt>
              <dd>{memory.people.join(", ")}</dd>
            </div>
          )}
        </dl>
      </div>
      <button
        className="mm-inspector-related"
        type="button"
        onClick={() => onSelect(related.id)}
      >
        <MemoirIcon name="threads" />
        <span>{related.title}</span>
        <MemoirIcon name="arrow" />
      </button>
    </aside>
  );
}
