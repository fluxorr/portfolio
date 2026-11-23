"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePointerPosition } from "@/components/portfolio/demos/use-pointer-position";
import { seekEvent, take, timelineLabels } from "@/lib/emberlog";
import { EmberIcon } from "./mark";

const initialPosition = 384;
const lastPosition = take.durationMs;
const clampPosition = (position: number) =>
  Math.min(lastPosition, Math.max(0, position));
const timecode = (position: number) =>
  `00:0${Math.floor(position / 1000)}.${String(position % 1000).padStart(3, "0")}`;

export function Transport() {
  const panel = usePointerPosition<HTMLDivElement>();
  const positionRef = useRef(initialPosition);
  const preview = useRef<number>(0);
  const touched = useRef(false);
  const [position, setPosition] = useState(initialPosition);
  const [playing, setPlaying] = useState(false);
  const [inspector, setInspector] = useState<"payload" | "replay">("payload");
  const [timeout, setTimeoutValue] = useState(String(take.timeoutMs));
  const [result, setResult] = useState<number>();

  const seek = useCallback((value: number) => {
    const next = clampPosition(value);
    positionRef.current = next;
    setPosition(next);
  }, []);

  const takeControl = useCallback(() => {
    touched.current = true;
    cancelAnimationFrame(preview.current);
    setPlaying(false);
  }, []);

  useEffect(() => {
    function followReader(event: Event) {
      const next = (event as CustomEvent<number>).detail;
      if (typeof next !== "number" || !Number.isFinite(next)) return;
      takeControl();
      seek(next);
    }
    window.addEventListener(seekEvent, followReader);
    return () => window.removeEventListener(seekEvent, followReader);
  }, [seek, takeControl]);

  useEffect(() => {
    const timestamp = new URLSearchParams(window.location.search).get("t");
    if (timestamp !== null && /^\d+$/.test(timestamp)) {
      seek(Number(timestamp));
      return;
    }

    const media = matchMedia("(prefers-reduced-motion: no-preference)");
    if (!media.matches) return;
    const timer = window.setTimeout(() => {
      const bounds = panel.current?.getBoundingClientRect();
      if (
        touched.current ||
        !media.matches ||
        document.hidden ||
        !bounds ||
        bounds.top > window.innerHeight ||
        bounds.bottom < 0
      )
        return;
      const started = performance.now();
      function sweep(now: number) {
        if (document.hidden || !media.matches) {
          seek(initialPosition);
          return;
        }
        const progress = Math.min(1, (now - started) / 1250);
        seek(
          Math.round(
            initialPosition +
              (lastPosition - initialPosition) * Math.sin(progress * Math.PI),
          ),
        );
        if (progress < 1) preview.current = requestAnimationFrame(sweep);
      }
      preview.current = requestAnimationFrame(sweep);
    }, 1020);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(preview.current);
    };
  }, [panel, seek]);

  useEffect(() => {
    if (!playing) return;
    const time = performance.now();
    const origin = positionRef.current;
    let animation = 0;
    function tick(now: number) {
      const next = Math.min(
        lastPosition,
        origin + Math.floor((now - time) / 16) * 12,
      );
      seek(next);
      if (next === lastPosition) setPlaying(false);
      else animation = requestAnimationFrame(tick);
    }
    function pauseIfHidden() {
      if (document.hidden) setPlaying(false);
    }
    animation = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", pauseIfHidden);
    return () => {
      cancelAnimationFrame(animation);
      document.removeEventListener("visibilitychange", pauseIfHidden);
    };
  }, [playing, seek]);

  const span =
    take.spans.findLast((item) => item.start <= position) ?? take.spans[0];

  function step(direction: 1 | -1) {
    takeControl();
    const starts = take.spans.map((item) => item.start);
    seek(
      direction === 1
        ? (starts.find((start) => start > position) ?? lastPosition)
        : (starts.findLast((start) => start < position) ?? 0),
    );
  }

  return (
    <div className="el-transport" ref={panel}>
      <header className="el-transport-top">
        <div className="el-transport-id">
          <i /> <span>Recorded take</span> <code>{take.id}</code>
        </div>
        <span className="el-result-code">
          504<span> timeout</span>
        </span>
      </header>
      <div className="el-request">
        <span>POST</span>
        <code>{take.path}</code>
        <span>{(lastPosition / 1000).toFixed(2)} s</span>
      </div>

      <div
        className="el-waterfall"
        style={
          {
            "--position": `${(position / lastPosition) * 100}%`,
          } as CSSProperties
        }
      >
        <div className="el-axis" aria-hidden="true">
          {timelineLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="el-lanes">
          {take.spans.map((item) => (
            <button
              aria-label={`${item.label}, ${item.start} to ${item.end} milliseconds, ${item.status === "ok" ? "completed" : item.status}`}
              aria-pressed={item.id === span.id}
              className="el-span"
              data-status={item.status}
              data-visited={item.start <= position}
              key={item.id}
              onClick={() => {
                takeControl();
                seek(item.start);
              }}
              style={
                {
                  "--span-start": `${(item.start / lastPosition) * 100}%`,
                  "--span-width": `${((item.end - item.start) / lastPosition) * 100}%`,
                } as CSSProperties
              }
              type="button"
            >
              <span>
                <i />
                {item.label}
              </span>
              <span aria-hidden="true" className="el-span-track">
                <i />
              </span>
            </button>
          ))}
          <div aria-hidden="true" className="el-playhead-area">
            <div className="el-playhead">
              <i />
            </div>
          </div>
        </div>
        <div className="el-ruler">
          <label htmlFor="el-playhead">Scrub</label>
          <input
            aria-label="Request timeline"
            aria-valuetext={`${position} milliseconds`}
            id="el-playhead"
            max={lastPosition}
            min={0}
            onChange={(event) => {
              takeControl();
              seek(Number(event.currentTarget.value));
            }}
            onFocus={takeControl}
            onKeyDown={(event) => {
              const sign =
                event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : -1;
              let destination: number;
              switch (event.key) {
                case "ArrowRight":
                case "ArrowUp":
                case "ArrowLeft":
                case "ArrowDown":
                  destination = position + sign * (event.shiftKey ? 100 : 10);
                  break;
                case "Home":
                  destination = 0;
                  break;
                case "End":
                  destination = lastPosition;
                  break;
                case "PageUp":
                  destination = position + 100;
                  break;
                case "PageDown":
                  destination = position - 100;
                  break;
                default:
                  return;
              }
              event.preventDefault();
              takeControl();
              seek(destination);
            }}
            onPointerDown={takeControl}
            type="range"
            value={position}
          />
        </div>
      </div>

      <div className="el-transport-controls">
        <span className="el-timecode">{timecode(position)}</span>
        <fieldset className="el-playback">
          <legend className="el-sr">Playback controls</legend>
          <button
            aria-label="Previous span"
            className="el-icon-button"
            onClick={() => step(-1)}
            type="button"
          >
            <EmberIcon name="back" />
          </button>
          <button
            aria-label={playing ? "Pause request" : "Play request"}
            className="el-icon-button el-play"
            onClick={() => {
              takeControl();
              if (!playing) {
                if (position === lastPosition) seek(0);
                setPlaying(true);
              }
            }}
            type="button"
          >
            <EmberIcon name={playing ? "pause" : "play"} />
          </button>
          <button
            aria-label="Next span"
            className="el-icon-button"
            onClick={() => step(1)}
            type="button"
          >
            <EmberIcon name="next" />
          </button>
        </fieldset>
        <button
          aria-pressed={inspector === "replay"}
          className="el-inspect-toggle"
          onClick={() => {
            takeControl();
            setInspector(inspector === "payload" ? "replay" : "payload");
          }}
          type="button"
        >
          {inspector === "payload" ? "Edit & replay" : "View payload"}{" "}
          <EmberIcon name={inspector === "payload" ? "arrow" : "left"} />
        </button>
      </div>

      <div className="el-inspector">
        {inspector === "payload" ? (
          <>
            <div className="el-inspector-label">
              <span>
                Payload <i>/</i> {span.label}
              </span>
              <span>
                <EmberIcon name="lock" /> Sanitized
              </span>
            </div>
            <pre className="el-payload" key={span.id}>
              <code>
                {"{\n"}
                {Object.entries(span.payload).map(
                  ([name, value], index, values) => (
                    <span key={name}>
                      {"  "}
                      <b>"{name}"</b>
                      {": "}
                      <span data-redacted={value === "[redacted]"}>
                        {JSON.stringify(value)}
                      </span>
                      {index < values.length - 1 ? "," : ""}
                      {"\n"}
                    </span>
                  ),
                )}
                {"}"}
              </code>
            </pre>
          </>
        ) : (
          <>
            <div className="el-inspector-label">
              <span>Replay locally</span>
              <span>Sample gateway · {take.gatewayDurationMs} ms</span>
            </div>
            <form
              className="el-replay-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!event.currentTarget.reportValidity()) return;
                const code =
                  Number(timeout) >= take.gatewayDurationMs ? 200 : 504;
                setResult(code);
                seek(lastPosition);
              }}
            >
              <label htmlFor="el-timeout">
                Timeout <span>ms</span>
              </label>
              <input
                id="el-timeout"
                max="3000"
                min="100"
                onChange={(event) => {
                  setTimeoutValue(event.currentTarget.value);
                  setResult(undefined);
                }}
                required
                step="1"
                type="number"
                value={timeout}
              />
              <button className="el-button" type="submit">
                Run replay <EmberIcon name="play" />
              </button>
            </form>
            <output className="el-replay-result" data-success={result === 200}>
              {result
                ? result === 200
                  ? "200 OK · Checkout completed"
                  : "504 · Gateway exceeded the timeout"
                : "Edit the timeout to compare the outcome."}
            </output>
          </>
        )}
      </div>
    </div>
  );
}
