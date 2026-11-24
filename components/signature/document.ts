export const signingPlane = { width: 1000, height: 400 } as const;

export type SignaturePoint = {
  x: number;
  y: number;
  t: number;
  pressure?: number;
};
export type SignatureStroke = {
  id: string;
  points: SignaturePoint[];
  startedAt: number;
  endedAt: number;
};
export type SignatureDocument = {
  version: 1;
  canvas: { width: number; height: number };
  strokes: SignatureStroke[];
  signerName: string;
  createdAt: string;
};

function tangent(a: number, b: number) {
  if (!a || !b || Math.sign(a) !== Math.sign(b)) return 0;
  return (2 * a * b) / (a + b);
}

function inkCurve(
  previous: SignaturePoint | undefined,
  a: SignaturePoint,
  b: SignaturePoint,
  next?: SignaturePoint,
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // Bound the tangents by adjacent segments so the ink rounds a corner without overshooting it.
  const x1 = a.x + (previous ? tangent(a.x - previous.x, dx) : dx) / 3;
  const y1 = a.y + (previous ? tangent(a.y - previous.y, dy) : dy) / 3;
  const x2 = b.x - (next ? tangent(dx, next.x - b.x) : dx) / 3;
  const y2 = b.y - (next ? tangent(dy, next.y - b.y) : dy) / 3;
  return { x1, y1, x2, y2 };
}

export function inkSegment(
  previous: SignaturePoint | undefined,
  a: SignaturePoint,
  b: SignaturePoint,
  next?: SignaturePoint,
) {
  const { x1, y1, x2, y2 } = inkCurve(previous, a, b, next);
  const controls = [x1, y1, x2, y2].map(
    (value) => Math.round(value * 100) / 100,
  );
  return `C${controls.join(" ")} ${b.x} ${b.y}`;
}

function inkPositions(points: SignaturePoint[]) {
  return points.filter(
    (point, index) =>
      point.x !== points[index - 1]?.x || point.y !== points[index - 1]?.y,
  );
}

export function strokePath(points: SignaturePoint[]) {
  const positions = inkPositions(points);
  const first = positions[0];
  if (!first) return "";
  let path = `M${first.x} ${first.y}`;
  for (let index = 1; index < positions.length; index++) {
    path += inkSegment(
      positions[index - 2],
      positions[index - 1],
      positions[index],
      positions[index + 1],
    );
  }
  return path;
}

function curveLength(
  previous: SignaturePoint | undefined,
  a: SignaturePoint,
  b: SignaturePoint,
  next?: SignaturePoint,
) {
  const { x1, y1, x2, y2 } = inkCurve(previous, a, b, next);
  let length = 0;
  let { x, y } = a;
  for (let index = 1; index <= 5; index++) {
    const t = index / 5;
    const u = 1 - t;
    const nextX =
      u ** 3 * a.x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * b.x;
    const nextY =
      u ** 3 * a.y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * b.y;
    length += Math.hypot(nextX - x, nextY - y);
    x = nextX;
    y = nextY;
  }
  return length;
}

export function isDot(points: SignaturePoint[]) {
  return points.every(({ x, y }) => x === points[0]?.x && y === points[0]?.y);
}

export function fitInk(strokes: SignatureStroke[]) {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const { points } of strokes) {
    for (const { x, y } of points) {
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  const scale = Number.isFinite(left)
    ? Math.min(
        0.9,
        300 / Math.max(1, right - left),
        107 / Math.max(1, bottom - top),
      )
    : 1;
  const x = Number.isFinite(left) ? 4 - left * scale : 4;
  const y = Number.isFinite(bottom) ? 132 - bottom * scale : 132;
  return { x, y, scale, transform: `translate(${x} ${y}) scale(${scale})` };
}

export function buildTimeline(strokes: SignatureStroke[], maxPause = 220) {
  let end = 0;
  let previousEnd = strokes[0]?.startedAt ?? 0;
  return strokes.map(({ points, startedAt, endedAt }) => {
    const start =
      end + Math.min(maxPause, Math.max(0, startedAt - previousEnd));
    const positions = inkPositions(points);
    const time: number[] = [];
    const distance: number[] = [];
    let position = 0;
    let length = 0;
    for (const point of points) {
      const a = positions[position];
      if (point.x !== a.x || point.y !== a.y) {
        length += curveLength(
          positions[position - 1],
          a,
          positions[position + 1],
          positions[position + 2],
        );
        position++;
      }
      const sample = point.t - startedAt;
      if (sample === time.at(-1)) distance[distance.length - 1] = length;
      else {
        time.push(sample);
        distance.push(length);
      }
    }
    const speed = distance
      .slice(1)
      .map(
        (length, index) =>
          (length - distance[index]) /
          Math.max(0.001, time[index + 1] - time[index]),
      );
    const velocities = time.map((_, index) =>
      index === 0
        ? (speed[0] ?? 0)
        : index === time.length - 1
          ? speed[index - 1]
          : tangent(speed[index - 1], speed[index]),
    );
    const duration = Math.max(endedAt - startedAt, 32);
    end = start + duration;
    previousEnd = endedAt;
    return {
      start,
      end,
      time,
      distance,
      velocities,
    };
  });
}

export function inkProgress(
  stroke: ReturnType<typeof buildTimeline>[number],
  elapsed: number,
) {
  const last = stroke.time.length - 1;
  const total = stroke.distance[last];
  if (!total || last < 1) return 1;
  if (elapsed <= stroke.time[0]) return stroke.distance[0] / total;
  if (elapsed >= stroke.time[last]) return 1;
  let left = 0;
  let right = last;
  while (right - left > 1) {
    const middle = (left + right) >> 1;
    if (stroke.time[middle] > elapsed) right = middle;
    else left = middle;
  }
  const interval = stroke.time[right] - stroke.time[left];
  const t = (elapsed - stroke.time[left]) / interval;
  const blend = t * t * (3 - 2 * t);
  const a = stroke.distance[left];
  const b = stroke.distance[right];
  const distance =
    a +
    (b - a) * blend +
    t * (1 - t) ** 2 * interval * stroke.velocities[left] -
    t * t * (1 - t) * interval * stroke.velocities[right];
  return Math.min(b, Math.max(a, distance)) / total;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object");
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function readSignature(json: string): SignatureDocument {
  if (json.length > 3_000_000) throw new Error("Signature file is too large.");
  const data: unknown = JSON.parse(json);
  if (
    !isRecord(data) ||
    data.version !== 1 ||
    !isRecord(data.canvas) ||
    data.canvas.width !== signingPlane.width ||
    data.canvas.height !== signingPlane.height ||
    typeof data.signerName !== "string" ||
    data.signerName.length > 100 ||
    typeof data.createdAt !== "string" ||
    !Number.isFinite(Date.parse(data.createdAt)) ||
    !Array.isArray(data.strokes) ||
    !data.strokes.length ||
    data.strokes.length > 1000
  ) {
    throw new Error("Choose a valid signature JSON file.");
  }
  let pointCount = 0;
  let previous = 0;
  const ids = new Set();
  const strokes = data.strokes.map((stroke: unknown): SignatureStroke => {
    if (
      !isRecord(stroke) ||
      typeof stroke.id !== "string" ||
      ids.has(stroke.id) ||
      !isNumber(stroke.startedAt) ||
      !isNumber(stroke.endedAt) ||
      stroke.startedAt < previous ||
      stroke.endedAt < stroke.startedAt ||
      !Array.isArray(stroke.points) ||
      !stroke.points.length
    ) {
      throw new Error("Signature file has an invalid stroke.");
    }
    ids.add(stroke.id);
    pointCount += stroke.points.length;
    if (pointCount > 35_000)
      throw new Error("Signature file has too many points.");
    let time = stroke.startedAt;
    const endedAt = stroke.endedAt;
    const points = stroke.points.map((point: unknown): SignaturePoint => {
      if (
        !isRecord(point) ||
        !isNumber(point.x) ||
        !isNumber(point.y) ||
        !isNumber(point.t) ||
        point.x < 0 ||
        point.x > signingPlane.width ||
        point.y < 0 ||
        point.y > signingPlane.height ||
        point.t < time ||
        point.t > endedAt ||
        (point.pressure !== undefined &&
          (!isNumber(point.pressure) ||
            point.pressure < 0 ||
            point.pressure > 1))
      ) {
        throw new Error("Signature file has an invalid point.");
      }
      time = point.t;
      return {
        x: point.x,
        y: point.y,
        t: time,
        pressure: point.pressure as number | undefined,
      };
    });
    previous = endedAt;
    return { id: stroke.id, points, startedAt: stroke.startedAt, endedAt };
  });
  return {
    version: 1,
    canvas: signingPlane,
    createdAt: data.createdAt,
    signerName: data.signerName,
    strokes,
  };
}

export function signatureSvg(document: SignatureDocument) {
  const fit = fitInk(document.strokes);
  const shapes = document.strokes
    .map(({ points }) =>
      isDot(points)
        ? `<circle cx="${points[0].x}" cy="${points[0].y}" r="${1 / fit.scale}" fill="#141418"/>`
        : `<path d="${strokePath(points)}" fill="none" stroke="#141418" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140" width="320" height="140"><g transform="${fit.transform}">${shapes}</g></svg>`;
}
