import type { ReactNode } from "react";
import "./monograph.css";

export default function MonographLayout({ children }: { children: ReactNode }) {
  return <div className="mg">{children}</div>;
}
