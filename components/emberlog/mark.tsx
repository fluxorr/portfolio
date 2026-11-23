import Link from "next/link";
import { emberlogPath } from "@/lib/emberlog";

export function EmberMark() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm3.45 4.95v10.1L7.35 12l8.1-5.05Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function EmberWordmark() {
  return (
    <Link className="el-brand" href={emberlogPath} prefetch={false}>
      <EmberMark /> emberlog
    </Link>
  );
}

const icons = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  up: "M6 18 18 6M9 6h9v9",
  left: "M20 12H5m6 6-6-6 6-6",
  copy: "M8 8h11v12H8z M16 8V4H4v12h4",
  check: "m5 12 4.5 4.5L19 7",
  play: "m9 5 11 7-11 7z",
  pause: "M9 5v14m6-14v14",
  back: "M5 5v14m14-14L8 12l11 7z",
  next: "M19 5v14M5 5l11 7-11 7z",
  moon: "M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M19 5l-1.4 1.4M6.4 17.6 5 19m11.2-7a4.2 4.2 0 1 1-8.4 0 4.2 4.2 0 0 1 8.4 0Z",
  menu: "M4 8h16M4 16h16",
  close: "m6 6 12 12M18 6 6 18",
  lock: "M6 10h12v10H6z M9 10V7a3 3 0 0 1 6 0v3m-3 4v3",
  pin: "m9 4 7 7-3 1-2 3-3-3 1-3zm1 9-5 6",
  link: "M10 13l4-4m-6 6-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0m2 3a3 3 0 0 0 4 0l4-4a3 3 0 0 0-4-4l-1 1",
  terminal: "M4 5h16v14H4z m3 4 3 3-3 3m6 0h4",
  down: "M12 4v15m-6-6 6 6 6-6",
  download: "M12 4v12m-5-5 5 5 5-5M5 17v3h14v-3",
};

export function EmberIcon({ name }: { name: keyof typeof icons }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
    >
      <path
        d={icons[name]}
        pathLength="1"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
