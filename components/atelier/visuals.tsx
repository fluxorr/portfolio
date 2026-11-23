import type { CSSProperties } from "react";
import { geometry, type Shape } from "@/lib/atelier/geometry";
import type { routingPolicy } from "@/lib/atelier/routing";
import { type Metric, metrics, type WeatherHour } from "@/lib/atelier/weather";

import "./visuals.css";

export function Mark({ shape }: { shape: Shape }) {
  return geometry(shape).map(({ d, transform, stroke }) => (
    <path
      key={transform ?? d}
      d={d}
      transform={transform}
      fill={stroke ? "none" : "currentColor"}
      stroke={stroke ? "currentColor" : undefined}
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  ));
}

export function WeatherField({
  hours,
  metric,
  selected,
  start = 0,
  count = 48,
}: {
  hours: WeatherHour[];
  metric: Metric;
  selected: number;
  start?: number;
  count?: number;
}) {
  const { min, max } = metrics[metric];
  const readings = hours.slice(start, start + count);
  const columns = readings.map((hour) =>
    Math.min(1, Math.max(0, (hour[metric] - min) / (max - min))),
  );
  const lines = Array.from({ length: 14 }, (_, row) =>
    columns
      .map((magnitude, col) => {
        const texture =
          (((col + start + 1) * 59 + row * 103 + row * (col + start) * 13) %
            89) /
          88;
        const height = (13 - row) / 13;
        if (height > magnitude + texture * 0.27)
          return (row + col + start) % 5 === 0 ? "·" : "\u00a0";
        const family = "·:+=*#%";
        const strength = Math.max(
          0,
          Math.min(
            family.length - 1,
            Math.floor((magnitude * 0.68 + texture * 0.28) * 7),
          ),
        );
        return family[strength];
      })
      .join(""),
  );
  const rows = lines.map((line, index) => ({
    line,
    baseline: index * 20 + 21,
  }));
  const segment = 20;
  const cursor = selected - start;
  const width = count * segment;
  return (
    <svg
      aria-hidden="true"
      className="weather-letters"
      viewBox={`0 0 ${width} 290`}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        className="weather-gridlines"
        d={[0, 1, 2, 3, 4, 5, 6, 7, 8]
          .map((row) => `M0 ${row * 36 + 1}H${width}`)
          .join(" ")}
      />
      {Array.from({ length: count / 6 + 1 }, (_, index) =>
        Math.min(width - 1, index * 120 + 1),
      ).map((position) => (
        <path
          className="weather-gridlines"
          key={position}
          d={`M${position} 0v289`}
        />
      ))}
      {cursor >= 0 && cursor < count && (
        <g
          className="weather-cursor"
          style={{ "--hour-x": `${cursor * 20}px` } as CSSProperties}
        >
          <rect width="20" height="290" fill="currentColor" opacity=".12" />
          <path
            d="M10 0v290M0 1h20M0 289h20"
            stroke="currentColor"
            strokeWidth="1"
          />
        </g>
      )}
      {rows.map(({ line, baseline }) => (
        <text
          className="weather-type"
          key={baseline}
          x="3"
          y={baseline}
          textLength={width - 6}
          lengthAdjust="spacing"
        >
          {line}
        </text>
      ))}
    </svg>
  );
}

const points = [77, 240, 403, 566];
export function RoutePlate({
  policy,
  active = -1,
}: {
  policy: ReturnType<typeof routingPolicy>;
  active?: number;
}) {
  return (
    <svg className="route-plate" viewBox="0 0 644 290" aria-hidden="true">
      <path
        d="M0 145H644M77 21v246m163-246v246m163-246v246m163-246v246"
        className="route-alignment"
      />
      <path d="M8 145h34m560 0h34" className="route-wire" />
      {policy.stages.map((stage, index) => {
        const x = points[index];
        const lit = stage.weight > 0;
        const high = stage.weight >= 30;
        const branch =
          "M" +
          (x - 75) +
          " 145h12q17 0 17-25V94q0-16 16-16h60q16 0 16 16v26q0 25 17 25h12";
        return (
          <g
            key={stage.stage}
            className="route-cell"
            data-lit={lit}
            data-emphasis={high}
            data-active={active === index}
          >
            {index > 0 && (
              <path d={`M${x - 91} 145h19`} className="route-wire" />
            )}
            <path d={branch} className="route-wire route-branch" />
            <path
              d={`M${x - 75} 145h150`}
              className="route-wire route-straight"
            />
            <path d={`M${x - 49} 166v29h98v-29`} className="route-slot" />
            <circle cx={x} cy={high ? 78 : 145} r="18" className="route-node" />
            <circle cx={x} cy={high ? 78 : 145} r="4" className="route-core" />
            <g className="route-contacts">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((slot) => {
                const offset = x - 44 + slot * 10;
                return (
                  <rect
                    key={offset}
                    x={offset}
                    y="179"
                    width="6"
                    height="3"
                    rx=".7"
                    data-fed={slot < Math.round(stage.weight / 5)}
                  />
                );
              })}
            </g>
            <text x={x} y="217" className="route-caption">
              {stage.stage}
            </text>
            <text x={x} y="238" className="route-caption route-caption-small">
              {lit ? `${stage.weight}%` : "BYPASS"}
            </text>
            {active === index && (
              <path
                d={high ? branch : `M${x - 75} 145h150`}
                pathLength="100"
                className="route-packet"
              />
            )}
          </g>
        );
      })}
      <text
        x="8"
        y="30"
        className="route-caption route-caption-small route-start"
      >
        INPUT / 01
      </text>
      <text
        x="636"
        y="30"
        className="route-caption route-caption-small route-end"
      >
        POLICY / OUT
      </text>
    </svg>
  );
}
