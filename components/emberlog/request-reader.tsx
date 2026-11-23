"use client";

import { useEffect, useState } from "react";
import { seekEvent, take } from "@/lib/emberlog";

type Point = [x: number, y: number, z: number];

function project([x, y, z]: Point) {
  return [225 + (x - y) * 0.85, 128 + (x + y) * 0.44 - z];
}

function outline(points: Point[]) {
  return points.map(project).join(" ");
}

function Stroke({
  from,
  to,
  className,
}: {
  from: Point;
  to: Point;
  className?: string;
}) {
  const [x1, y1] = project(from);
  const [x2, y2] = project(to);
  return <line className={className} x1={x1} x2={x2} y1={y1} y2={y2} />;
}

function Plate({
  x,
  y,
  w,
  d,
  z,
  thickness = 0,
  className,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  z: number;
  thickness?: number;
  className?: string;
}) {
  const upper: Point[] = [
    [x, y, z],
    [x + w, y, z],
    [x + w, y + d, z],
    [x, y + d, z],
  ];
  const low = z - thickness;

  return (
    <g className={className}>
      {thickness > 0 && (
        <>
          <polygon
            className="el-reader-side"
            points={outline([
              upper[1],
              upper[2],
              [x + w, y + d, low],
              [x + w, y, low],
            ])}
          />
          <polygon
            className="el-reader-front"
            points={outline([
              upper[2],
              upper[3],
              [x, y + d, low],
              [x + w, y + d, low],
            ])}
          />
        </>
      )}
      <polygon className="el-reader-face" points={outline(upper)} />
    </g>
  );
}

function Drawing({ position }: { position: number }) {
  const readheadX = 124 + (237 * position) / take.durationMs;
  const playheadOffset = readheadX - 124;

  return (
    <svg
      aria-hidden="true"
      className="el-reader-drawing"
      fill="none"
      viewBox="0 0 620 409"
    >
      <defs>
        <linearGradient id="el-reader-shadow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="el-reader-guides">
        <path d="M37 171h70m371 115h100M151 67v69m352 181v60M49 287h76m365-149h89" />
        <path d="M33 167v8m550-41v8M147 67h8m346 310h8" />
        <Stroke from={[-20, 197, 0]} to={[391, 197, 0]} />
        <Stroke from={[378, -23, 0]} to={[378, 211, 0]} />
      </g>
      <polygon
        className="el-reader-shadow"
        fill="url(#el-reader-shadow)"
        points={outline([
          [-5, -4, -12],
          [402, -4, -12],
          [402, 202, -12],
          [-5, 202, -12],
        ])}
      />

      <g className="el-reader-ink">
        <Plate x={0} y={0} w={382} d={183} z={12} thickness={12} />
        <Plate x={11} y={11} w={359} d={161} z={21} thickness={9} />
        <Plate
          x={21}
          y={28}
          w={343}
          d={119}
          z={26}
          thickness={5}
          className="el-reader-recess"
        />
        <Plate
          x={111}
          y={34}
          w={249}
          d={106}
          z={30}
          thickness={4}
          className="el-reader-tape"
        />
        {Array.from({ length: 28 }, (_, index) => {
          const x = 112 + 9 * index;
          return (
            <Stroke
              className="el-reader-gridline"
              from={[x, 34, 30]}
              key={x}
              to={[x, 140, 30]}
            />
          );
        })}
        {take.spans.map((span, index) => {
          const scale = 234 / take.durationMs;
          const x = 120 + span.start * scale;
          const y = 43 + index * 18;
          const length = (span.end - span.start) * scale;
          return (
            <g
              className="el-reader-trace"
              data-passed={position >= span.start}
              key={span.id}
            >
              <Stroke
                className="el-reader-baseline"
                from={[117, y + 4, 30]}
                to={[356, y + 4, 30]}
              />
              <Plate
                className="el-reader-span"
                x={x}
                y={y}
                w={length}
                d={8}
                z={31}
                thickness={1}
              />
            </g>
          );
        })}

        <Plate x={27} y={43} w={81} d={88} z={52} thickness={26} />
        <Plate x={31} y={47} w={73} d={80} z={58} thickness={6} />
        <Plate
          x={38}
          y={54}
          w={59}
          d={66}
          z={59}
          thickness={1}
          className="el-reader-recess"
        />
        <Plate
          x={53}
          y={68}
          w={30}
          d={36}
          z={64}
          thickness={5}
          className="el-reader-inset"
        />
        <polygon
          className="el-reader-insignia"
          points={outline([
            [62, 87, 64],
            [74, 78, 64],
            [74, 96, 64],
          ])}
        />
        <Stroke from={[34, 131, 46]} to={[94, 131, 46]} />
        <Stroke from={[34, 131, 40]} to={[94, 131, 40]} />
        <Stroke from={[27, 109, 30]} to={[27, 121, 30]} />
        {Array.from({ length: 15 }, (_, index) => 128 + 14 * index).map((x) => (
          <Stroke
            className="el-reader-vents"
            from={[x, 166, 21]}
            key={x}
            to={[x + 8, 166, 21]}
          />
        ))}
        <Stroke from={[55, 15, 21]} to={[351, 15, 21]} />
        <Stroke from={[120, 153, 21]} to={[349, 153, 21]} />
        <Stroke from={[120, 157, 21]} to={[349, 157, 21]} />
        {[17, 360].flatMap((x) =>
          [17, 165].map((y) => (
            <Plate
              key={`${x}-${y}`}
              x={x}
              y={y}
              w={4}
              d={4}
              z={22}
              className="el-reader-screw"
            />
          )),
        )}
        <Plate x={344} y={161} w={14} d={4} z={22} className="el-reader-led" />

        <g
          className="el-reader-head"
          style={{
            transform: `translate(${playheadOffset * 0.85}px, ${playheadOffset * 0.44}px)`,
          }}
        >
          <Stroke
            className="el-reader-head-line"
            from={[128, 26, 30]}
            to={[128, 144, 30]}
          />
          <Plate
            x={123}
            y={22}
            w={10}
            d={11}
            z={47}
            thickness={17}
            className="el-reader-head-end"
          />
          <Plate
            x={123}
            y={141}
            w={10}
            d={11}
            z={47}
            thickness={17}
            className="el-reader-head-end"
          />
          <Plate
            x={124}
            y={24}
            w={8}
            d={126}
            z={47}
            thickness={4}
            className="el-reader-head-rail"
          />
        </g>
      </g>

      <g className="el-reader-annotation">
        <path d="M102 115h25l24 20" />
        <circle cx="151" cy="135" r="2" />
        <text x="47" y="119">
          IN / 01
        </text>
        <path d="M498 118h44v25" />
        <circle cx="498" cy="118" r="2" />
        <text x="484" y="103">
          TAKE_08F3
        </text>
        <path d="M528 321h30l17-16" />
        <circle cx="528" cy="321" r="2" />
        <text x="450" y="355">
          OUT / 05 SPANS
        </text>
      </g>
    </svg>
  );
}

export function RequestReader() {
  const [position, setPosition] = useState(384);
  useEffect(() => {
    const timestamp = new URLSearchParams(window.location.search).get("t");
    if (timestamp !== null && /^\d+$/.test(timestamp)) {
      setPosition(Math.min(take.durationMs, Number(timestamp)));
    }
  }, []);
  const span =
    take.spans.findLast((item) => item.start <= position) ?? take.spans[0];

  return (
    <div className="el-reader">
      <Drawing position={position} />
      <div className="el-reader-controls">
        <label htmlFor="el-reader-time">
          <span>Playhead</span>
          <span className="el-reader-time">{position} ms</span>
        </label>
        <input
          aria-label="Illustration playhead"
          aria-valuetext={`${position} milliseconds, ${span.label}`}
          id="el-reader-time"
          max={take.durationMs}
          min={0}
          onChange={(event) => {
            const next = Number(event.currentTarget.value);
            setPosition(next);
            window.dispatchEvent(new CustomEvent(seekEvent, { detail: next }));
          }}
          step={1}
          type="range"
          value={position}
        />
        <div className="el-reader-state">
          <code>{span.label}</code>
          <span>
            <i />{" "}
            {span.status === "error"
              ? "Timed out"
              : span.status === "slow"
                ? "Slow span"
                : "Recorded"}
          </span>
        </div>
      </div>
    </div>
  );
}
