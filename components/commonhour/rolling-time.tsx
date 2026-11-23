import type { CSSProperties } from "react";

const positions = [
  "hour-tens",
  "hour-ones",
  "colon",
  "minute-tens",
  "minute-ones",
] as const;

export function RollingTime({ value }: { value: string }) {
  return (
    <span className="ch-rolling">
      <span className="ch-sr">{value}</span>
      <span aria-hidden="true" className="ch-rolling-visual">
        {positions.map((position, index) => (
          <span
            className={position === "colon" ? "ch-time-colon" : "ch-digit"}
            key={position}
          >
            <span
              key={value[index]}
              style={{ "--ch-digit-delay": `${index * 29}ms` } as CSSProperties}
            >
              {value[index]}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
