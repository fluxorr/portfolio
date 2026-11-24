import type { ReactNode } from "react";
import { MemoirMark } from "./brand";

// StageShow's wide product framing, with a live app toolbar in place of OS chrome.
export function WorkspaceFrame({
  children,
  controls,
}: {
  children: ReactNode;
  controls: ReactNode;
}) {
  return (
    <div className="mm-workspace-frame" id="memoir-demo">
      <div className="mm-window-bar">
        <div className="mm-workspace-title">
          <span>
            <MemoirMark />
          </span>
          <div>
            <strong>Memory stream</strong>
            <small>Memoir workspace</small>
          </div>
        </div>
        {controls}
        <span className="mm-workspace-status">
          <span /> Sample data
        </span>
      </div>
      {children}
    </div>
  );
}
