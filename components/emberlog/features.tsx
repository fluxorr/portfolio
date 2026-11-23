"use client";

import { useEffect, useState } from "react";
import { usePointerPosition } from "@/components/portfolio/demos/use-pointer-position";
import { emberlogPath, type features, integrations } from "@/lib/emberlog";
import { copyText } from "./copy";
import { EmberIcon } from "./mark";

export function FeatureCard({
  feature,
}: {
  feature: (typeof features)[number];
}) {
  const ref = usePointerPosition<HTMLElement>();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const { id, title, copy, action, reverse } = feature;

  useEffect(() => {
    if (id !== "ci" || !active || progress >= 5) return;
    const timer = window.setTimeout(() => setProgress(progress + 1), 180);
    return () => window.clearTimeout(timer);
  }, [id, active, progress]);

  async function interact() {
    if (id === "share") {
      const url = `${window.location.origin}${emberlogPath}?t=420#replay`;
      setLink(url);
      const copied = await copyText(url);
      setCopyFailed(!copied);
      setActive(copied);
    } else if (id === "ci") {
      setProgress(
        matchMedia("(prefers-reduced-motion: reduce)").matches ? 5 : 1,
      );
      setActive(true);
    } else {
      setActive(!active);
    }
  }

  return (
    <article
      className={`el-feature el-feature-${id}`}
      data-on={active}
      ref={ref}
    >
      <div className="el-feature-copy">
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
      <div className="el-feature-visual" aria-hidden="true">
        {id === "redact" && (
          <code>
            <span>
              <b>email</b> &quot;
              <i>{active ? "[redacted]" : "dev@example.test"}</i>&quot;
            </span>
            <span>
              <b>token</b> &quot;<i>{active ? "[redacted]" : "demo_590ab"}</i>
              &quot;
            </span>
          </code>
        )}
        {id === "pin" && (
          <div className="el-mini-timeline">
            <div>
              <i />
              <i />
              <i />
              <span>
                <EmberIcon name="pin" />
              </span>
            </div>
            <code>{active ? "Pinned at 420 ms" : "pricing.quote"}</code>
          </div>
        )}
        {id === "diff" && (
          <div className="el-mini-diff">
            <code>
              <b>−</b> status: 504
            </code>
            <code>
              <b>+</b> {active ? "status: 200" : "—"}
            </code>
          </div>
        )}
        {id === "local" && (
          <div className="el-mini-local">
            <EmberIcon name="terminal" />
            <i />
            <EmberIcon name="lock" />
            <code>{active ? "Local replay only" : "On your machine"}</code>
          </div>
        )}
        {id === "share" && (
          <div className="el-mini-share">
            <EmberIcon name="link" />
            <code>
              take_08f3 <i>·</i> 420 ms
            </code>
          </div>
        )}
        {id === "ci" && (
          <div className="el-mini-ci">
            {["Load", "Scrub", "Replay", "Assert", "Pass"].map(
              (label, index) => (
                <div data-done={index < progress} key={label}>
                  <i>
                    {index < progress ? <EmberIcon name="check" /> : index + 1}
                  </i>
                  <span>{label}</span>
                </div>
              ),
            )}
          </div>
        )}
      </div>
      <button
        aria-pressed={id === "ci" || id === "share" ? undefined : active}
        className="el-feature-action"
        disabled={id === "ci" && active && progress < 5}
        onClick={interact}
        type="button"
      >
        {id === "ci" && active && progress < 5
          ? "Running check…"
          : active
            ? reverse
            : action}{" "}
        <EmberIcon name={id === "share" && active ? "check" : "arrow"} />
      </button>
      {id === "share" && (
        <output className="el-feature-result">
          {copyFailed ? <code>{link}</code> : active ? "Link copied." : ""}
        </output>
      )}
      {id === "ci" && (
        <output className="el-sr">
          {progress === 5 ? "Sample check passed." : ""}
        </output>
      )}
    </article>
  );
}

function IntegrationTile({
  adapter,
  selected,
  onSelect,
}: {
  adapter: (typeof integrations)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const ref = usePointerPosition<HTMLButtonElement>();
  const [initial, language, name, status] = adapter;

  return (
    <button
      aria-controls="el-integration-detail"
      aria-pressed={selected}
      className="el-integration"
      onClick={onSelect}
      ref={ref}
      type="button"
    >
      <span className="el-integration-mark" aria-hidden="true">
        {initial}
      </span>
      <span className="el-integration-text">
        <strong>{language}</strong>
        <code>{name}</code>
      </span>
      <span className="el-integration-status" data-stable={status === "Stable"}>
        {status}
      </span>
    </button>
  );
}

export function Integrations() {
  const [selected, setSelected] = useState<(typeof integrations)[number]>(
    integrations[0],
  );
  const [, language, packageName] = selected;

  return (
    <>
      <div className="el-integrations">
        {integrations.map((adapter) => (
          <IntegrationTile
            adapter={adapter}
            key={adapter[1]}
            onSelect={() => setSelected(adapter)}
            selected={selected === adapter}
          />
        ))}
      </div>
      <div className="el-integration-detail" id="el-integration-detail">
        <div aria-live="polite">
          <strong>{language}</strong> <code>{packageName}</code>
        </div>
        <p>
          Adapter names and statuses are part of the product concept. The
          offline demo runs with Node.js.
        </p>
        <a className="el-textlink" href={`${emberlogPath}/docs#download`}>
          Run the local demo <EmberIcon name="arrow" />
        </a>
      </div>
    </>
  );
}
