export const monographPath = "/showcase/monograph";
export const monographOg = "/showcase/monograph/og.jpg";
export const monographOgAlt =
  "Monograph — Put a look to the brief. A vermilion folded paper sculpture on warm ivory.";

type Direction = {
  slug: string;
  name: string;
  category: string;
  line: string;
  brief: string;
  rationale: string;
  subject: string;
  palette: readonly [string, string, string];
  labels: readonly [string, string, string];
  type: "sans" | "serif" | "mono";
  keywords: readonly string[];
};

export const directions = [
  {
    slug: "kissa",
    name: "Kissa",
    category: "Coffee roastery",
    line: "Good things take their time.",
    brief: "A small Tokyo coffee roastery with an unhurried morning ritual.",
    rationale:
      "Drawn from the quiet attention of a Japanese kissaten. Warm vermilion, morning light and compact typography give familiar objects the presence of a daily ritual.",
    subject: "A vermilion coffee tin and ceramic cup in slanting morning light",
    palette: ["#f2dfc0", "#d64728", "#30201a"],
    labels: ["Oat paper", "Persimmon", "Roast"],
    type: "sans",
    keywords: [
      "coffee",
      "tokyo",
      "roast",
      "roastery",
      "roasting",
      "cafe",
      "café",
      "tea",
    ],
  },
  {
    slug: "silt",
    name: "Silt",
    category: "Ceramics atelier",
    line: "A slower kind of making.",
    brief: "A ceramics atelier shaped by the irregularity of river stones.",
    rationale:
      "Round silhouettes and dry, earth-toned surfaces bring the material forward. A generous serif gives each object the quiet of a piece on a gallery plinth.",
    subject: "A sculptural ceramic vessel against a dark olive studio backdrop",
    palette: ["#e0d7c6", "#676c52", "#2b2d24"],
    labels: ["Unfired", "River moss", "Wet clay"],
    type: "serif",
    keywords: ["clay", "ceramic", "pottery", "atelier"],
  },
  {
    slug: "offgrid",
    name: "Offgrid",
    category: "Technical apparel",
    line: "The route is yours.",
    brief: "An outdoor label for people who take the harder route by choice.",
    rationale:
      "Cobalt ripstop and cold slate put the material in its element. Monospaced type reads like field coordinates, leaving the fabric and terrain to carry the drama.",
    subject: "A cobalt ripstop jacket crumpled across slate rock",
    palette: ["#dbe3ee", "#254bd9", "#101b32"],
    labels: ["Ice", "Cobalt", "Basalt"],
    type: "mono",
    keywords: [
      "outdoor",
      "sport",
      "trail",
      "mountain",
      "apparel",
      "hiking",
      "jacket",
    ],
  },
  {
    slug: "onda",
    name: "Onda",
    category: "Independent radio",
    line: "Come in, loud and clear.",
    brief: "An independent radio station for the hours after dark.",
    rationale:
      "Plum shadows and warm speaker cones set an after-dark mood. Oversized type takes its cue from the sleeves and flyer walls of independent radio.",
    subject: "A vintage plum speaker cabinet with coral-red cones",
    palette: ["#f7d7ce", "#e35d60", "#3b192a"],
    labels: ["Sleeve", "Signal", "Deep plum"],
    type: "sans",
    keywords: ["radio", "audio", "music", "broadcast", "vinyl"],
  },
  {
    slug: "forma",
    name: "Forma",
    category: "Architecture studio",
    line: "Room for a different view.",
    brief: "An architecture practice exploring the weight of light.",
    rationale:
      "Clay models, hard daylight and long shadows turn space into the subject. A measured typographic grid echoes the proportions of the studies.",
    subject: "A clay-red architectural stair study in harsh sunlight",
    palette: ["#f2dcd0", "#ab4f3c", "#3f2923"],
    labels: ["Plaster", "Terracotta", "Umber"],
    type: "mono",
    keywords: [
      "architecture",
      "interior",
      "architect",
      "interiors",
      "concrete",
    ],
  },
  {
    slug: "fieldnote",
    name: "Fieldnote",
    category: "Botanical fragrance",
    line: "Close to the growing thing.",
    brief: "A botanical fragrance that smells like a garden after rain.",
    rationale:
      "Pale glass and bruised greens shift the focus to the ingredients. The editorial serif takes its proportions from botanical field journals.",
    subject: "A pale green glass fragrance bottle among dew-covered stems",
    palette: ["#e9eaca", "#91984c", "#30371f"],
    labels: ["Pollen", "Stem", "Canopy"],
    type: "serif",
    keywords: [
      "botanical",
      "fragrance",
      "garden",
      "perfume",
      "plant",
      "scent",
      "flower",
    ],
  },
] as const satisfies readonly Direction[];

export type BrandDirection = (typeof directions)[number];

export function directionImage(slug: BrandDirection["slug"]) {
  return `${monographPath}/${slug}.webp`;
}

export function matchDirection(brief: string) {
  const words = new Set(brief.toLowerCase().split(/[^a-zà-ÿ]+/));
  let best: BrandDirection | undefined;
  let bestScore = 0;
  for (const direction of directions) {
    const score = direction.keywords.filter(
      (word) =>
        words.has(word) || words.has(`${word}s`) || words.has(`${word}es`),
    ).length;
    if (score > bestScore) {
      best = direction;
      bestScore = score;
    }
  }
  return best;
}

export function studioHref(
  slug?: BrandDirection["slug"],
  brief?: string,
  paper?: string,
) {
  const params = new URLSearchParams();
  if (slug) params.set("direction", slug);
  if (brief) params.set("brief", brief);
  if (paper) params.set("paper", paper);
  return `${monographPath}/studio${params.size ? `?${params}` : ""}`;
}

function luminance(color: string) {
  const rgb = color
    .slice(1)
    .match(/../g)
    ?.map((hex) => parseInt(hex, 16) / 255) ?? [0, 0, 0];
  const [r, g, b] = rgb.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

export function readableInk(paper: string, ink: string) {
  const surface = luminance(paper);
  const foreground = luminance(ink);
  const contrast =
    (Math.max(surface, foreground) + 0.05) /
    (Math.min(surface, foreground) + 0.05);
  if (contrast >= 4.5) return ink;
  return surface > 0.179 ? "#000" : "#fff";
}
