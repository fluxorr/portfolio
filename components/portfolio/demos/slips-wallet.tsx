"use client";

import { type PointerEvent, useRef, useState } from "react";
import { Arrow } from "../links";
import { sampleInvoices, WalletObject } from "./slips-wallet-object";
import { usePointerPosition } from "./use-pointer-position";

export function SlipsWallet() {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const stage = usePointerPosition<HTMLButtonElement>();
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const ignoreClick = useRef(false);
  const invoice = sampleInvoices[selected];
  const action = open ? "Tuck invoice away" : "Pull out invoice";

  function browse(offset: number) {
    const count = sampleInvoices.length;
    setSelected((index) => (index + offset + count) % count);
    setOpen(false);
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    pointer.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    ignoreClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function followDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = pointer.current;
    if (start?.id !== event.pointerId) return;

    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) > 9 && Math.abs(x) > Math.abs(y)) {
      event.currentTarget.dataset.dragging = "true";
      event.currentTarget.style.setProperty(
        "--wallet-drag",
        `${Math.max(-32, Math.min(32, x * 0.24))}px`,
      );
    }
  }

  function clearDrag(event: PointerEvent<HTMLButtonElement>) {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    delete event.currentTarget.dataset.dragging;
    event.currentTarget.style.removeProperty("--wallet-drag");
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = pointer.current;
    if (start?.id !== event.pointerId) return;

    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    ignoreClick.current = Math.hypot(x, y) > 10;
    clearDrag(event);

    if (Math.abs(x) >= 36 && Math.abs(x) > Math.abs(y)) {
      browse(x < 0 ? 1 : -1);
    }
  }

  return (
    <div className="demo-wallet" data-open={open}>
      <button
        aria-label={action}
        className="demo-wallet-stage"
        onClick={(event) => {
          if (event.detail === 0 || !ignoreClick.current) {
            setOpen((current) => !current);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            browse(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onLostPointerCapture={clearDrag}
        onPointerCancel={clearDrag}
        onPointerDown={startDrag}
        onPointerMove={followDrag}
        onPointerUp={finishDrag}
        ref={stage}
        type="button"
      >
        <span className="demo-wallet-art">
          <WalletObject selected={selected} slips={sampleInvoices} />
        </span>
        <span aria-hidden="true" className="demo-wallet-hint">
          <svg
            aria-hidden="true"
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              d="M2 8h12M5 5 2 8l3 3m6-6 3 3-3 3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.25"
            />
          </svg>
          <span className="demo-wallet-hint-drag">Drag to browse</span>
          <span className="demo-wallet-hint-swipe">Swipe to browse</span>
          <span className="demo-wallet-hint-divider" />
          <span className="demo-wallet-hint-drag">
            {open ? "Click to tuck away" : "Click to lift"}
          </span>
          <span className="demo-wallet-hint-swipe">
            {open ? "Tap to tuck away" : "Tap to lift"}
          </span>
        </span>
      </button>

      <div className="demo-wallet-panel">
        <div className="demo-wallet-toolbar">
          <span>Sample invoices</span>
          <div className="demo-wallet-controls">
            <button
              aria-label="Previous invoice"
              className="demo-wallet-previous"
              onClick={() => browse(-1)}
              type="button"
            >
              <Arrow />
            </button>
            <span aria-hidden="true">
              {selected + 1} / {sampleInvoices.length}
            </span>
            <button
              aria-label="Next invoice"
              onClick={() => browse(1)}
              type="button"
            >
              <Arrow />
            </button>
          </div>
        </div>

        <div
          aria-atomic="true"
          aria-live="polite"
          className="demo-wallet-paper"
        >
          <div className="demo-wallet-paper-content" key={invoice.id}>
            <p className="demo-wallet-reference">{invoice.reference}</p>
            <p className="demo-wallet-vendor">{invoice.vendor}</p>
            <p className="demo-wallet-line">{invoice.line}</p>
            <dl className="demo-wallet-total">
              <dt>Total</dt>
              <dd>{invoice.amount}</dd>
            </dl>
          </div>
        </div>

        <button
          className="demo-wallet-action"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {action}
          <Arrow direction="down" />
        </button>
      </div>
    </div>
  );
}
