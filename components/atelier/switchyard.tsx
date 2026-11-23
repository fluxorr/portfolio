"use client";

import { useEffect, useId, useState } from "react";
import { downloadFile } from "@/lib/atelier/browser";
import {
  defaultRouting,
  type RoutingSettings,
  routingPolicy,
  tasks,
} from "@/lib/atelier/routing";
import { RoutePlate } from "./visuals";
import "./study-common.css";
import "./switchyard.css";

const complexities = ["Compact", "Typical", "Heavy"] as const;
const checks = ["Off", "Standard", "Strict"] as const;

export function Switchyard({
  initialSettings = defaultRouting,
  onPolicyChange,
}: {
  initialSettings?: RoutingSettings;
  onPolicyChange?: (policy: ReturnType<typeof routingPolicy>) => void;
}) {
  const taskId = useId();
  const [settings, setSettings] = useState(initialSettings);
  const [preview, setPreview] = useState(-1);
  const [notice, setNotice] = useState("");
  const policy = routingPolicy(settings);
  const liveStages = policy.stages.filter((stage) => stage.weight > 0);
  const liveIndex = policy.stages.findIndex(
    (stage) => stage.stage === liveStages[preview]?.stage,
  );
  const isRunning = preview >= 0 && preview < liveStages.length;
  const json = JSON.stringify(policy, null, 2);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setTimeout(() => setPreview(preview + 1), 490);
    return () => clearTimeout(timer);
  }, [isRunning, preview]);

  function update(next: RoutingSettings) {
    setSettings(next);
    setPreview(-1);
    setNotice("");
    onPolicyChange?.(routingPolicy(next));
  }

  async function copyPolicy() {
    try {
      await navigator.clipboard.writeText(json);
      setNotice("Policy JSON copied");
    } catch {
      setNotice("Clipboard unavailable. Download the policy instead.");
    }
  }

  return (
    <div className="switchyard">
      <div className="switch-mast">
        <span className="study-code">
          Switchyard <span>/ local simulation</span>
        </span>
        <button
          type="button"
          className="switch-reset"
          onClick={() => update(initialSettings)}
        >
          Reset policy
        </button>
      </div>
      <div className="switch-machine">
        <div className="switch-inputs">
          <h2>Set the request.</h2>
          <label htmlFor={taskId} className="study-code">
            Task
          </label>
          <select
            id={taskId}
            value={settings.task}
            onChange={(event) =>
              update({
                ...settings,
                task: event.target.value as RoutingSettings["task"],
              })
            }
          >
            {Object.entries(tasks).map(([value, task]) => (
              <option key={value} value={value}>
                {task.label}
              </option>
            ))}
          </select>
          <p>{tasks[settings.task].note}</p>
          <fieldset>
            <legend className="study-code">Complexity</legend>
            {complexities.map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={settings.complexity === value}
                onClick={() => update({ ...settings, complexity: value })}
              >
                {value}
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend className="study-code">Verification</legend>
            {checks.map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={settings.verification === value}
                onClick={() => update({ ...settings, verification: value })}
              >
                {value}
              </button>
            ))}
          </fieldset>
        </div>
        <div className="switch-center">
          <div className="switch-board">
            <RoutePlate policy={policy} active={liveIndex} />
            <div className="switch-mobile-route">
              {policy.stages.map((stage, index) => (
                <div
                  key={stage.stage}
                  data-run={index === liveIndex}
                  data-mode={stage.mode}
                >
                  <i />
                  <span>{stage.stage}</span>
                  <code>{stage.weight ? `${stage.weight}%` : "Bypass"}</code>
                </div>
              ))}
            </div>
          </div>
          <label className="switch-strategy">
            <span className="study-code">
              Strategy bias <output>{policy.settings.strategy} / 100</output>
            </span>
            <input
              aria-label="Strategy bias"
              type="range"
              min="0"
              max="100"
              step="5"
              value={policy.settings.strategy}
              onChange={(event) =>
                update({
                  ...settings,
                  strategy: event.currentTarget.valueAsNumber,
                })
              }
            />
            <span className="switch-axis">
              <span>Faster</span>
              <span>More deliberate</span>
            </span>
          </label>
          <div className="switch-run">
            <button
              type="button"
              onClick={() =>
                setPreview(
                  matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? liveStages.length
                    : 0,
                )
              }
            >
              {preview >= 0 ? "Replay route" : "Run preview"}{" "}
              <span aria-hidden="true">▶</span>
            </button>
            <output>
              {isRunning
                ? (preview > 0
                    ? `${liveStages[preview - 1].stage} complete · `
                    : "") +
                  liveStages[preview].stage +
                  " active"
                : preview >= liveStages.length
                  ? "Route complete · policy ready"
                  : "Local stage simulation"}
            </output>
          </div>
        </div>
        <div className="switch-output">
          <h2>Stage allocation.</h2>
          <dl className="switch-weights">
            {policy.stages.map((stage) => (
              <div key={stage.stage} data-mode={stage.mode}>
                <dt>{stage.stage}</dt>
                <dd>{stage.weight}%</dd>
                <span aria-hidden="true">
                  <i style={{ width: `${stage.weight}%` }} />
                </span>
              </div>
            ))}
          </dl>
          <div className="switch-estimates">
            <p className="study-code">Illustrative index points</p>
            <dl>
              <div>
                <dt>Latency</dt>
                <dd>{policy.estimates.latencyIndex}</dd>
              </div>
              <div>
                <dt>Compute</dt>
                <dd>{policy.estimates.computeIndex}</dd>
              </div>
            </dl>
          </div>
          <p className="switch-explanation">
            {tasks[settings.task].label} ·{" "}
            {
              policy.stages.reduce((best, stage) =>
                stage.weight > best.weight ? stage : best,
              ).stage
            }{" "}
            carries the most effort.{" "}
            {settings.verification === "Off"
              ? "Final checking is bypassed."
              : `Verification is ${settings.verification.toLowerCase()}.`}
          </p>
        </div>
      </div>
      <div className="switch-foot">
        <details>
          <summary>How the weights are set</summary>
          <p>
            Each task starts with a preset allocation. Higher complexity
            increases retrieval and reasoning effort. Moving toward deliberate
            shifts effort from interpretation to the later stages. Strict
            verification raises the checking weight. The shares are normalized
            to 100%.
          </p>
        </details>
        <div className="switch-exports">
          <button
            type="button"
            onClick={() =>
              downloadFile(json, "application/json", "switchyard-policy.json")
            }
          >
            Download JSON
          </button>
          <button type="button" onClick={() => void copyPolicy()}>
            Copy policy JSON ↗
          </button>
        </div>
        <output className="switch-notice">{notice}</output>
      </div>
    </div>
  );
}
