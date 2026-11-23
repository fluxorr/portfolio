export const studies = [
  {
    slug: "palimpsest",
    number: "01",
    name: "Palimpsest",
    job: "Provenance cabinet",
    line: "Every object leaves a trail.",
    description:
      "Inspect the source, revisions, and custody behind a digital object.",
    action: "Inspect record",
    note: "Each stage separates what a record documents from what it claims. A SHA-256 digest identifies the exact bytes of the supplied source artwork.",
  },
  {
    slug: "isobar",
    number: "02",
    name: "Isobar",
    job: "Forecast instrument",
    line: "Weather, set in type.",
    description:
      "Read 48 hours of a city’s forecast as a field of type, and find a window worth stepping out for.",
    action: "Scrub forecast",
    note: "Every column represents one measured forecast hour. Glyph density encodes the selected metric on a fixed scale so readings stay comparable across cities.",
  },
  {
    slug: "switchyard",
    number: "03",
    name: "Switchyard",
    job: "Routing simulator",
    line: "Decide where the thinking happens.",
    description:
      "Set a task policy and see how it allocates work across four stages.",
    action: "Tune route",
    note: "Task presets establish a baseline. Complexity, strategy, and verification adjust the allocation. The preview runs locally and uses illustrative latency and compute indices.",
  },
  {
    slug: "figure-zero",
    number: "04",
    name: "Figure / Zero",
    job: "Parametric symbol press",
    line: "A mark is a system of decisions.",
    description:
      "Draw a geometric symbol, refine its construction, and export the mark.",
    action: "Edit form",
    note: "Orbit, Fold, and Bloom use three separate geometry rules. The press exports the same geometry you edit, in self-contained SVG or transparent PNG.",
  },
  {
    slug: "meridian",
    number: "05",
    name: "Meridian",
    job: "Shared-hours instrument",
    line: "One moment, many places.",
    description:
      "Find where working hours intersect across time zones and turn a proposed time into a calendar event.",
    action: "Find overlap",
    note: "The ruler represents a single UTC date. Local work hours are resolved with IANA zone rules on that date, including repeated hours and skipped time at daylight-saving transitions.",
  },
] as const;

export type Study = (typeof studies)[number];
export type StudySlug = Study["slug"];
