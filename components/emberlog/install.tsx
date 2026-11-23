"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { CopyButton } from "./copy";
import { EmberIcon } from "./mark";

const methods = ["curl", "brew", "npm", "docker"] as const;
const nodeCommand = "node emberlog-replay.mjs 1200";

export function Install({ id = "el-install" }: { id?: string }) {
  const [selected, setSelected] = useState(0);
  const [origin, setOrigin] = useState("https://byflux.me");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => setOrigin(window.location.origin), []);

  const commands = [
    `curl -fLO ${origin}/emberlog/emberlog-replay.mjs\ncurl -fLO ${origin}/emberlog/checkout-take.json\n${nodeCommand}`,
    `brew install node\n${nodeCommand}`,
    "npm exec --offline -c 'node emberlog-replay.mjs 1200'",
    `docker run --rm -v "$PWD:/work:ro" -w /work node:22-alpine ${nodeCommand}`,
  ];
  const method = methods[selected];

  return (
    <div className="el-install">
      <div
        className="el-install-tabs"
        role="tablist"
        aria-label="Ways to run the demo"
        style={{ "--el-tab": selected } as CSSProperties}
      >
        {methods.map((option, index) => (
          <button
            aria-controls={`${id}-panel`}
            aria-selected={index === selected}
            id={`${id}-${option}`}
            key={option}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === "ArrowRight" || event.key === "ArrowLeft")
                next =
                  (index +
                    (event.key === "ArrowRight" ? 1 : -1) +
                    methods.length) %
                  methods.length;
              else if (event.key === "Home" || event.key === "End")
                next = event.key === "Home" ? 0 : methods.length - 1;
              else return;
              event.preventDefault();
              setSelected(next);
              tabs.current[next]?.focus();
            }}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            role="tab"
            tabIndex={index === selected ? 0 : -1}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`${id}-${method}`}
        className="el-install-panel"
        id={`${id}-panel`}
        role="tabpanel"
      >
        <div className="el-command">
          <pre key={method}>
            <code>{commands[selected]}</code>
          </pre>
          <CopyButton text={commands[selected]} />
        </div>
        <p>
          {method === "curl"
            ? "Run the three commands in a folder where you can save the two demo files."
            : "Download both demo files into the same folder, then run this command there."}
        </p>
        <div className="el-downloads">
          <a download href="/emberlog/emberlog-replay.mjs">
            Replay script <EmberIcon name="download" />
          </a>
          <a download href="/emberlog/checkout-take.json">
            Sample take <EmberIcon name="download" />
          </a>
        </div>
      </div>
    </div>
  );
}
