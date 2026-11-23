import Link from "next/link";
import type { ComponentProps } from "react";
import { monographPath } from "./directions";

type IconName =
  | "right"
  | "out"
  | "down"
  | "left"
  | "close"
  | "command"
  | "reset";

const paths: Record<IconName, string> = {
  right: "M4 9h10m-4-4 4 4-4 4",
  out: "M5 13 13 5M5 5h8v8",
  down: "M9 4v10m-4-4 4 4 4-4",
  left: "M14 9H4m4-4L4 9l4 4",
  close: "m4 4 10 10M14 4 4 14",
  command:
    "M6 12H4a2 2 0 1 1 2-2V6a2 2 0 1 1 2-2v10a2 2 0 1 1-2-2h6a2 2 0 1 1-2 2V4a2 2 0 1 1 2 2v4a2 2 0 1 1 2 2z",
  reset: "M4 6a6 6 0 1 1-1 5M4 2v5h5",
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Mark(props: ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      width="29"
      height="25"
      viewBox="0 0 29 25"
      fill="currentColor"
      {...props}
    >
      <path d="M0 24V1h4.5L14.5 14 24.5 1H29v23h-4V7.6L14.5 21 4 7.6V24z" />
      <path d="M9.5 1h10l-5 6.5z" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <Link className="mg-wordmark" href={monographPath}>
      <Mark />
      <span>Monograph</span>
    </Link>
  );
}
