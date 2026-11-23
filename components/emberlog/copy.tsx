"use client";

import { useEffect, useRef, useState } from "react";
import { EmberIcon } from "./mark";

export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <button
        aria-label={state === "copied" ? "Copied" : "Copy command"}
        className="el-icon-button el-copy"
        data-copied={state === "copied"}
        onClick={async () => {
          clearTimeout(timer.current);
          const copied = await copyText(text);
          setState(copied ? "copied" : "failed");
          if (copied) timer.current = setTimeout(() => setState("idle"), 1800);
        }}
        type="button"
      >
        <EmberIcon name={state === "copied" ? "check" : "copy"} />
      </button>
      <output className={state === "failed" ? "el-copy-error" : "el-sr"}>
        {state === "copied" && "Copied to clipboard."}
        {state === "failed" &&
          "Copy unavailable. Select the command to copy it."}
      </output>
    </>
  );
}
