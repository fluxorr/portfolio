export const tasks = {
  research: {
    label: "Research brief",
    note: "Gather context and turn it into a sourced summary.",
    base: [17, 38, 29, 16],
  },
  classification: {
    label: "Classification",
    note: "Assign a short input to a known set of categories.",
    base: [38, 0, 44, 18],
  },
  drafting: {
    label: "Drafting",
    note: "Shape a first draft around a supplied brief.",
    base: [26, 10, 49, 15],
  },
  code_review: {
    label: "Code review",
    note: "Inspect a change for correctness and regressions.",
    base: [21, 9, 33, 37],
  },
} as const;
export const stages = ["Interpret", "Retrieve", "Reason", "Check"] as const;
export type RoutingSettings = {
  task: keyof typeof tasks;
  complexity: "Compact" | "Typical" | "Heavy";
  strategy: number;
  verification: "Off" | "Standard" | "Strict";
};
export const defaultRouting: RoutingSettings = {
  task: "research",
  complexity: "Typical",
  strategy: 50,
  verification: "Standard",
};

export function routingPolicy(settings: RoutingSettings) {
  const { task, complexity, verification } = settings;
  const strategy = Math.min(
    100,
    Math.max(0, Math.round(settings.strategy / 5) * 5),
  );
  const depth = (strategy - 50) / 50;
  const depthFactor = { Compact: 0.8, Typical: 1, Heavy: 1.45 }[complexity];
  const [interpret, retrieve, reason, check] = tasks[task].base;
  const weights = [
    interpret * (1 - 0.28 * depth),
    strategy < 30 && retrieve < 20
      ? 0
      : (retrieve + (task === "classification" && strategy >= 75 ? 9 : 0)) *
        (1 + 0.55 * depth) *
        depthFactor,
    reason * (1 + 0.65 * depth) * depthFactor,
    verification === "Off"
      ? 0
      : check * (1 + 0.38 * depth) * (verification === "Strict" ? 1.65 : 1),
  ];
  const sum = weights.reduce((total, weight) => total + weight, 0);
  const shares = weights.map((weight) => (weight / sum) * 100);
  const allocation = shares.map(Math.floor);
  // Largest remainders receive leftover points so the exported policy always totals 100.
  const remainder =
    100 - allocation.reduce((total, weight) => total + weight, 0);
  const order = shares
    .map((share, index) => ({ index, fraction: share - allocation[index] }))
    .sort((a, b) => b.fraction - a.fraction);
  for (const { index } of order.slice(0, remainder)) allocation[index]++;
  const latencyIndex = Math.round(
    (30 + strategy * 0.54 + allocation[1] * 0.4 + allocation[3] * 0.6) *
      depthFactor,
  );
  const computeIndex = Math.round(
    (24 + strategy * 0.62 + allocation[2] * 0.66 + allocation[3] * 0.45) *
      depthFactor,
  );
  return {
    version: 1,
    mode: "local-simulation",
    settings: { ...settings, strategy },
    stages: stages.map((stage, index) => ({
      stage,
      weight: allocation[index],
      mode:
        allocation[index] === 0
          ? "bypass"
          : allocation[index] >= 30
            ? "emphasis"
            : "standard",
    })),
    estimates: {
      units: "illustrative index points",
      latencyIndex,
      computeIndex,
    },
  };
}
