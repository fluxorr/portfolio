"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { downloadFile } from "@/lib/atelier/browser";
import { SignatureApprovalCard } from "./approval-card";
import {
  readSignature,
  type SignatureDocument,
  signatureSvg,
  signingPlane,
} from "./document";
import { SignatureStudio } from "./signature-studio";

const sampleMarks = [
  [
    [115, 310, 0],
    [151, 282, 54],
    [193, 225, 112],
    [225, 158, 183],
    [236, 117, 252],
    [214, 113, 321],
    [193, 153, 400],
    [185, 216, 489],
    [197, 288, 573],
    [220, 311, 635],
    [254, 289, 697],
    [295, 233, 759],
    [327, 190, 823],
    [342, 189, 878],
    [344, 228, 941],
    [337, 279, 1001],
    [354, 299, 1074],
    [379, 276, 1117],
    [415, 219, 1163],
    [441, 209, 1221],
    [451, 252, 1283],
    [468, 266, 1341],
    [515, 254, 1415],
    [589, 231, 1490],
    [674, 221, 1560],
    [770, 226, 1630],
    [844, 219, 1681],
  ],
  [
    [280, 218, 1850],
    [323, 210, 1887],
    [363, 202, 1930],
    [418, 194, 1976],
  ],
  [
    [482, 177, 2140],
    [484, 175, 2165],
  ],
];
const fixture: SignatureDocument = {
  version: 1,
  canvas: signingPlane,
  signerName: "Atelier sample",
  createdAt: "2026-11-24T00:00:00Z",
  strokes: sampleMarks.map((points, index) => ({
    id: `sample-${index}`,
    startedAt: points[0][2],
    endedAt: points[points.length - 1][2] + 22,
    points: points.map(([x, y, t]) => ({ x, y, t })),
  })),
};

export function SignatureDemo() {
  const dialog = useRef<HTMLDialogElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [session, setSession] = useState<{
    id: number;
    draft: SignatureDocument | null;
  }>();
  const [record, setRecord] = useState<SignatureDocument | null>(null);
  const [sample, setSample] = useState(true);
  const [replay, setReplay] = useState(0);
  const [notice, setNotice] = useState("");
  const shown = sample ? fixture : record;

  useLayoutEffect(() => {
    if (session && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [session]);

  function open() {
    setSession((previous) => ({ id: (previous?.id ?? 0) + 1, draft: record }));
  }
  function close() {
    dialog.current?.close();
  }
  function accept(signature: SignatureDocument) {
    setRecord(signature);
    setSample(false);
    setReplay((previous) => previous + 1);
    setNotice("");
  }

  return (
    <div className="signature-demo">
      <div className="signature-demo-copy">
        <p className="signature-demo-kind" key={String(sample)}>
          {sample ? "Sample signature" : "Your signature"}
        </p>
        <p className="signature-demo-title">A mark of your own.</p>
        <p className="signature-demo-description">
          Draw a signature and watch the pen retrace it, down to the pauses
          between strokes.
        </p>
        <div className="signature-demo-actions">
          <button type="button" className="signature-primary" onClick={open}>
            {record ? "Edit signature" : "Create signature"}
          </button>
          <button
            type="button"
            disabled={!shown}
            onClick={() => setReplay((previous) => previous + 1)}
          >
            Replay{" "}
            <span className="signature-replay-icon" aria-hidden="true">
              ↻
            </span>
          </button>
          {!sample && (
            <button
              type="button"
              onClick={() => {
                setSample(true);
                setNotice("");
              }}
            >
              View sample
            </button>
          )}
          {sample && record && (
            <button type="button" onClick={() => setSample(false)}>
              Show mine
            </button>
          )}
        </div>
        <div className="signature-demo-files">
          <button type="button" onClick={() => file.current?.click()}>
            Import JSON
          </button>
          {record && !sample && (
            <>
              <button
                type="button"
                onClick={() =>
                  downloadFile(
                    JSON.stringify(record, null, 2),
                    "application/json",
                    "signature.json",
                  )
                }
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadFile(
                    signatureSvg(record),
                    "image/svg+xml",
                    "signature.svg",
                  )
                }
              >
                Export SVG
              </button>
            </>
          )}
          <input
            ref={file}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={async (event) => {
              const selected = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (!selected) return;
              try {
                if (selected.size > 3_000_000)
                  throw new Error("Signature file is too large.");
                accept(readSignature(await selected.text()));
                setNotice("Signature imported.");
              } catch (error) {
                setNotice(
                  error instanceof SyntaxError
                    ? "This file is not valid signature JSON."
                    : error instanceof Error
                      ? error.message
                      : "Unable to import signature.",
                );
              }
            }}
          />
        </div>
        <output className="signature-demo-status">{notice}</output>
      </div>
      <SignatureApprovalCard
        signature={shown}
        label={sample ? "Sample approval" : "Approved by"}
        replay={replay}
        autoplayOnVisible
      />
      <dialog
        ref={dialog}
        className="signature-dialog"
        aria-label="Signature studio"
      >
        {session && (
          <SignatureStudio
            key={session.id}
            initial={session.draft}
            onCancel={close}
            onSave={(signature) => {
              accept(signature);
              close();
            }}
          />
        )}
      </dialog>
    </div>
  );
}
