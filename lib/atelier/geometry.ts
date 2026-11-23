export type Family = "Orbit" | "Fold" | "Bloom";
export type Shape = {
  family: Family;
  count: number;
  weight: number;
  aperture: number;
  radius: number;
  rotation: number;
  bend: number;
};
export type ShapeKey = Exclude<keyof Shape, "family">;
type Preset = { name: string; shape: Shape };
export const presets: Record<Family, Preset[]> = {
  Orbit: [
    {
      name: "Signal",
      shape: {
        family: "Orbit",
        count: 3,
        weight: 10,
        aperture: 48,
        radius: 100,
        rotation: -42,
        bend: 11,
      },
    },
    {
      name: "Transit",
      shape: {
        family: "Orbit",
        count: 4,
        weight: 7,
        aperture: 81,
        radius: 103,
        rotation: 17,
        bend: 3,
      },
    },
    {
      name: "Eclipse",
      shape: {
        family: "Orbit",
        count: 2,
        weight: 18,
        aperture: 30,
        radius: 86,
        rotation: -113,
        bend: 15,
      },
    },
  ],
  Fold: [
    {
      name: "Relay",
      shape: {
        family: "Fold",
        count: 3,
        weight: 40,
        aperture: 34,
        radius: 96,
        rotation: -17,
        bend: 24,
      },
    },
    {
      name: "Sling",
      shape: {
        family: "Fold",
        count: 2,
        weight: 32,
        aperture: 22,
        radius: 103,
        rotation: 40,
        bend: 42,
      },
    },
    {
      name: "Interlock",
      shape: {
        family: "Fold",
        count: 3,
        weight: 53,
        aperture: 43,
        radius: 82,
        rotation: 15,
        bend: 10,
      },
    },
  ],
  Bloom: [
    {
      name: "Sirocco",
      shape: {
        family: "Bloom",
        count: 7,
        weight: 65,
        aperture: 23,
        radius: 105,
        rotation: -10,
        bend: 32,
      },
    },
    {
      name: "Anther",
      shape: {
        family: "Bloom",
        count: 5,
        weight: 54,
        aperture: 44,
        radius: 94,
        rotation: 23,
        bend: 14,
      },
    },
    {
      name: "Rosette",
      shape: {
        family: "Bloom",
        count: 9,
        weight: 40,
        aperture: 14,
        radius: 95,
        rotation: 6,
        bend: 47,
      },
    },
  ],
};
export const defaultShape = presets.Orbit[0].shape;
const shapeControls: Record<
  Family,
  { key: ShapeKey; label: string; min: number; max: number }[]
> = {
  Orbit: [
    { key: "count", label: "Rings", min: 2, max: 4 },
    { key: "weight", label: "Weight", min: 3, max: 20 },
    { key: "aperture", label: "Aperture", min: 15, max: 125 },
    { key: "radius", label: "Radius", min: 70, max: 108 },
    { key: "rotation", label: "Rotation", min: -180, max: 180 },
    { key: "bend", label: "Notch drift", min: 0, max: 20 },
  ],
  Fold: [
    { key: "count", label: "Ribbons", min: 2, max: 3 },
    { key: "weight", label: "Ribbon width", min: 20, max: 54 },
    { key: "aperture", label: "Opening", min: 16, max: 48 },
    { key: "radius", label: "Radius", min: 76, max: 108 },
    { key: "rotation", label: "Rotation", min: -180, max: 180 },
    { key: "bend", label: "Fold depth", min: 6, max: 44 },
  ],
  Bloom: [
    { key: "count", label: "Symmetry", min: 3, max: 12 },
    { key: "weight", label: "Blade width", min: 20, max: 82 },
    { key: "aperture", label: "Opening", min: 8, max: 48 },
    { key: "radius", label: "Radius", min: 72, max: 108 },
    { key: "rotation", label: "Rotation", min: -180, max: 180 },
    { key: "bend", label: "Curvature", min: 0, max: 52 },
  ],
};
const angle = Math.PI / 180;
const coord = (value: number) => Number(value.toFixed(3));
export function polar(radius: number, degrees: number) {
  return [
    coord(Math.cos(degrees * angle) * radius),
    coord(Math.sin(degrees * angle) * radius),
  ] as const;
}
export function controlsFor(shape: Shape) {
  if (shape.family !== "Orbit") return shapeControls[shape.family];
  const fit = Math.floor((shape.radius * 0.68) / shape.count - 3);
  return shapeControls.Orbit.map((control) =>
    control.key === "weight"
      ? { ...control, max: Math.min(control.max, fit) }
      : control,
  );
}
export function constrain(shape: Shape, key: ShapeKey, value: number) {
  const control = controlsFor(shape).find((item) => item.key === key);
  if (!control || !Number.isFinite(value)) return shape;
  const next = {
    ...shape,
    [key]: Math.min(control.max, Math.max(control.min, Math.round(value))),
  };
  if (next.family === "Orbit") {
    const limit =
      controlsFor(next).find((item) => item.key === "weight")?.max ??
      next.weight;
    next.weight = Math.min(next.weight, limit);
  }
  return next;
}
type GeometryPath = { d: string; transform?: string; stroke?: number };
export function geometry(shape: Shape): GeometryPath[] {
  const { count, radius, aperture, rotation, weight, bend } = shape;
  if (shape.family === "Orbit") {
    const step = (radius * 0.68) / count;
    return Array.from({ length: count }, (_, index) => {
      const r = coord(radius - index * step);
      const center = rotation + index * bend;
      const opening = aperture + index * 3;
      const start = polar(r, center + opening / 2);
      const end = polar(r, center - opening / 2);
      return {
        d:
          "M " +
          start.join(" ") +
          " A " +
          r +
          " " +
          r +
          " 0 1 1 " +
          end.join(" "),
        stroke: coord(Math.min(weight, step - 3)),
      };
    });
  }
  if (shape.family === "Fold") {
    const w = (radius * weight) / 100;
    const inset = aperture * 0.66;
    const depth = ((bend + 15) * radius) / 100;
    const d = [
      "M",
      -inset,
      -5,
      "C",
      -depth,
      -radius * 0.27,
      -radius * 0.7,
      -radius * 0.33,
      -radius * 0.85,
      -radius * 0.74,
      "Q",
      -radius * 0.87,
      -radius * 0.93,
      -radius * 0.64,
      -radius * 0.89,
      "C",
      -radius * 0.31,
      -radius * 0.97,
      radius * 0.13,
      -radius * 0.83,
      radius * 0.39,
      -radius * 0.57,
      "L",
      radius * 0.39 - w * 0.52,
      -radius * 0.57 + w * 0.61,
      "Q",
      -radius * 0.25,
      -radius * 0.81 + w * 0.82,
      -radius * 0.58 + w * 0.34,
      -radius * 0.65 + w * 0.46,
      "C",
      -radius * 0.44,
      -radius * 0.34 + w * 0.37,
      -depth * 0.4,
      -radius * 0.27 + w * 0.45,
      inset,
      -4 - w * 0.26,
      "Q",
      0,
      -inset * 0.55,
      -inset,
      -5,
      "Z",
    ]
      .map((value) => (typeof value === "number" ? coord(value) : value))
      .join(" ");
    return Array.from({ length: count }, (_, index) => ({
      d,
      transform: `rotate(${rotation + (index * 360) / count})`,
    }));
  }
  const sector = 360 / count;
  const inner = radius * (aperture / 95);
  const start = polar(inner, -sector * 0.12);
  const middle = polar(radius * 0.68, sector * (bend / 100));
  const upper = polar(radius, sector * (0.22 + bend / 185));
  const tip = polar(radius, sector * (0.02 + bend / 185));
  const lower = polar(radius * 0.73, sector * (-weight / 145));
  const tail = polar(inner * 1.5, -sector * 0.34);
  const d = [
    "M",
    start.join(" "),
    "Q",
    middle.join(" "),
    upper.join(" "),
    "Q",
    tip.join(" "),
    lower.join(" "),
    "Q",
    tail.join(" "),
    start.join(" "),
    "Z",
  ].join(" ");
  return Array.from({ length: count }, (_, index) => ({
    d,
    transform: `rotate(${rotation + index * sector})`,
  }));
}
export function symbolSVG(shape: Shape, ink = "#171a24") {
  const paths = geometry(shape)
    .map(({ d, transform, stroke }) => {
      const treatment = stroke
        ? ' fill="none" stroke="' +
          ink +
          '" stroke-width="' +
          stroke +
          '" stroke-linecap="round"'
        : ` fill="${ink}"`;
      return (
        '<path d="' +
        d +
        '"' +
        (transform ? ` transform="${transform}"` : "") +
        treatment +
        "/>"
      );
    })
    .join("");
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="-128 -128 256 256">' +
    paths +
    "</svg>"
  );
}
