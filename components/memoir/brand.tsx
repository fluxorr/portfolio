import type { ComponentProps } from "react";

export const markPath =
  "M5 26V9c0-2 2.3-3 3.7-1.6L16 15l7.3-7.6C24.7 6 27 7 27 9v17l-5.5-4.2L16 26l-5.5-4.2L5 26";

export function MemoirMark(props: ComponentProps<"svg">) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d={markPath}
        pathLength="1"
        stroke="currentColor"
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MemoirWordmark() {
  return (
    <a className="mm-wordmark" href="#memoir-top">
      <MemoirMark />
      <span>memoir</span>
    </a>
  );
}

const icons = {
  arrow: "M4 10h12m-5-5 5 5-5 5",
  left: "M16 10H4m5 5-5-5 5-5",
  out: "M5 15 15 5M6 5h9v9",
  down: "m5 8 5 5 5-5",
  up: "M10 16V4m-5 5 5-5 5 5",
  plus: "M10 4v12M4 10h12",
  close: "m5 5 10 10m0-10L5 15",
  menu: "M4 6h12M4 10h12M4 14h12",
  meeting: "M3 5h14v11H3zM3 8h14M7 3v4m6-4v4",
  voice: "M4 8v4m3-7v10m3-12v14m3-10v6m3-5v4",
  note: "M5 3h7l3 3v11H5zM11 3v4h4M8 10h4m-4 3h4",
  conversation: "M3 4h14v10H9l-4 3v-3H3zM6 8h8m-8 3h5",
  threads: "M4 5h4c3 0 2 10 5 10h3M4 15h4c3 0 2-10 5-10h3",
  search: "M13.4 13.4 17 17M15 9a6 6 0 1 1-12 0 6 6 0 0 1 12 0z",
  check: "m4 10 4 4 8-8",
  link: "m8 12 4-4m-5 6-1 1a2.8 2.8 0 0 1-4-4l4-4a2.8 2.8 0 0 1 4 0m3-1 1-1a2.8 2.8 0 0 1 4 4l-4 4a2.8 2.8 0 0 1-4 0",
  idea: "M7 14v-2c-5-5 1-11 6-7 2 2 2 5 0 7v2M7 17h6",
  clock: "M10 6v4l3 2M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  shield: "M10 3 16 6v5c0 3-3 5-6 7-3-2-6-4-6-7V6z",
};

export function MemoirIcon({
  name,
  ...props
}: { name: keyof typeof icons } & ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d={icons[name]}
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
