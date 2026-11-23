"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Arrow } from "./links";

type Preview = { name: string; url: string };

export function ShowcasePreviews({ children }: { children: ReactNode }) {
  const list = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);

  useEffect(() => {
    const element = list.current;
    if (!element) return;

    function openPreview(event: MouseEvent) {
      if (!(event.target instanceof Element) || !dialog.current) return;

      const button = event.target.closest<HTMLButtonElement>(
        "button[data-preview-url]",
      );
      const name = button?.dataset.previewName;
      const url = button?.dataset.previewUrl;
      if (!button || !name || !url) return;

      trigger.current = button;
      setPreview({ name, url });
      dialog.current.showModal();
    }

    element.addEventListener("click", openPreview);
    return () => element.removeEventListener("click", openPreview);
  }, []);

  function clearPreview() {
    setPreview(null);
    trigger.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <div ref={list}>{children}</div>
      <dialog
        aria-labelledby="showcase-preview-title"
        className="showcase-dialog"
        onClose={clearPreview}
        ref={dialog}
      >
        <div className="showcase-dialog-header">
          <h2 id="showcase-preview-title">{preview?.name ?? "Live preview"}</h2>
          <div className="showcase-dialog-actions">
            {preview ? (
              <a
                className="portfolio-button portfolio-button--text"
                href={preview.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Open site <Arrow direction="out" />
              </a>
            ) : null}
            <form method="dialog">
              <button
                className="portfolio-button portfolio-button--secondary"
                type="submit"
              >
                Close
              </button>
            </form>
          </div>
        </div>
        {preview ? (
          <iframe
            className="showcase-dialog-frame"
            key={preview.url}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin"
            src={preview.url}
            title={`${preview.name} live preview`}
          />
        ) : null}
      </dialog>
    </>
  );
}
