import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildTimeline,
  fitInk,
  inkProgress,
  readSignature,
  type SignatureDocument,
  signatureSvg,
  signingPlane,
} from "../components/signature/document";

const document: SignatureDocument = {
  version: 1,
  canvas: signingPlane,
  signerName: "Māra 星",
  createdAt: "2026-11-24T00:00:00.000Z",
  strokes: [
    {
      id: "line",
      startedAt: 0,
      endedAt: 100,
      points: [
        { x: 0, y: 20, t: 0 },
        { x: 10, y: 20, t: 50 },
        { x: 1000, y: 20, t: 100 },
      ],
    },
    {
      id: "dot",
      startedAt: 600,
      endedAt: 620,
      points: [{ x: 50, y: 40, t: 600, pressure: 0.2 }],
    },
  ],
};

test("Replay honors sampled velocity and caps only the gap", () => {
  const [line, dot] = buildTimeline(document.strokes, 220);
  assert.equal(inkProgress(line, 50), 0.01);
  assert.equal(inkProgress(line, 100), 1);
  assert.equal(dot.start - line.end, 220);
  const faithful = buildTimeline(document.strokes, Infinity);
  assert.equal(faithful[1].start - faithful[0].end, 500);
});

test("Signature JSON round-trips distinct strokes, pressure, and names", () => {
  const copy = readSignature(JSON.stringify(document));
  assert.deepEqual(JSON.parse(JSON.stringify(copy)), document);
  assert.throws(() =>
    readSignature(
      JSON.stringify({
        ...document,
        strokes: [document.strokes[1], document.strokes[0]],
      }),
    ),
  );
});

test("Wide marks fit and standalone SVG preserves the dot", () => {
  const fit = fitInk(document.strokes);
  assert.equal(fit.scale, 0.3);
  assert.match(signatureSvg(document), /<path.+<circle/);
  assert.doesNotMatch(signatureSvg(document), /Māra|<script/);
});

test("Smoothing keeps endpoints and keeps timed pauses in the ink", () => {
  const points = [
    { x: 20, y: 120, t: 0 },
    { x: 180, y: 60, t: 50 },
    { x: 180, y: 60, t: 90 },
    { x: 260, y: 140, t: 200 },
  ];
  const stroke = { id: "curve", startedAt: 0, endedAt: 200, points };
  const [timeline] = buildTimeline([stroke]);
  const svg = signatureSvg({ ...document, strokes: [stroke] });
  assert.match(svg, /d="M20 120C[^"]+260 140"/);
  assert.equal(inkProgress(timeline, 50), inkProgress(timeline, 75));
  assert.equal(inkProgress(timeline, 75), inkProgress(timeline, 90));
  let previous = 0;
  for (let t = 0; t <= 200; t++) {
    const current = inkProgress(timeline, t);
    assert.ok(current >= previous && current <= 1);
    previous = current;
  }
});
