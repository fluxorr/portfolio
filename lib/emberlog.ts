import take from "@/public/emberlog/checkout-take.json";

export { take };

export const seekEvent = "emberlog:seek";
export const emberlogPath = "/showcase/emberlog";
export const emberlogImage = "/emberlog/og.png";
export const emberlogDescription =
  "Rewind a recorded request, inspect its spans, and replay it with a different timeout. An interactive developer-tool concept by byflux.";

export const steps = [
  {
    title: "Capture",
    copy: "Record a request at the service boundary. Its sensitive fields are scrubbed before the take is stored.",
  },
  {
    title: "Scrub",
    copy: "Move the playhead to inspect the spans and payload as they appeared during the request.",
  },
  {
    title: "Replay",
    copy: "Change the timeout and run the same sample take again. See what changes in the result.",
  },
] as const;

export const features = [
  {
    id: "redact",
    title: "Secret scrubbing",
    copy: "Redact sensitive fields before a take is stored.",
    action: "Scrub sample fields",
    reverse: "Show sample fields",
  },
  {
    id: "pin",
    title: "Time-travel breakpoints",
    copy: "Mark a span and pick up exactly where you left off.",
    action: "Pin pricing span",
    reverse: "Remove breakpoint",
  },
  {
    id: "diff",
    title: "Diff view",
    copy: "See the one line that changed the response.",
    action: "Compare responses",
    reverse: "Show original",
  },
  {
    id: "local",
    title: "Local-only mode",
    copy: "Keep the take and its replay on your own machine.",
    action: "Inspect local mode",
    reverse: "Reset illustration",
  },
  {
    id: "share",
    title: "Share links",
    copy: "Send someone straight to the point that matters.",
    action: "Copy demo link",
    reverse: "Copied",
  },
  {
    id: "ci",
    title: "CI replay",
    copy: "See how a recorded take could check a future build.",
    action: "Run sample check",
    reverse: "Run sample check",
  },
] as const;

export const integrations = [
  ["N", "Node.js", "@emberlog/node", "Stable"],
  ["Py", "Python", "emberlog-python", "Stable"],
  ["Go", "Go", "emberlog-go", "Stable"],
  ["Rb", "Ruby", "emberlog-rb", "Stable"],
  ["Jv", "Java", "dev.emberlog:agent", "Beta"],
  ["Rs", "Rust", "emberlog-rs", "Beta"],
  ["Ph", "PHP", "emberlog/php", "Beta"],
  [".N", ".NET", "Emberlog.Agent", "Beta"],
  ["Ex", "Elixir", "emberlog_ex", "Beta"],
  ["Kt", "Kotlin", "dev.emberlog:kotlin", "Beta"],
  ["De", "Deno", "@emberlog/deno", "Beta"],
  ["Bu", "Bun", "@emberlog/bun", "Stable"],
] as const;

export const teams = [
  "Halcyon",
  "Brightwater",
  "Okapi Labs",
  "Fernwood",
  "Tandem & Co",
  "Quillon",
];

export const notes = [
  {
    name: "Ottilie Brandt",
    initials: "OB",
    role: "Staff engineer · Halcyon",
    quote:
      "The request failed once in production. With a take, I could step through the same failure all afternoon.",
  },
  {
    name: "Saoirse Lindqvist",
    initials: "SL",
    role: "Platform lead · Brightwater",
    quote:
      "I can send the team to the exact span instead of asking three people to read the same log thread.",
  },
  {
    name: "Noor Haverford",
    initials: "NH",
    role: "SRE · Okapi Labs",
    quote:
      "When the timeout moves, I can see what actually happened before the gateway closed the connection.",
  },
  {
    name: "Yelena Okafor",
    initials: "YO",
    role: "CTO · Fernwood",
    quote:
      "The useful part is the record of the failure. Everyone starts the investigation with the same evidence.",
  },
  {
    name: "Bronwyn Castellane",
    initials: "BC",
    role: "Backend engineer · Tandem & Co",
    quote:
      "It turns an intermittent checkout failure into a case I can run on my own laptop.",
  },
];

export const plans = [
  {
    name: "Hearth",
    copy: "For a solo debugger keeping a few takes close.",
    monthly: 0,
    yearly: 0,
    features: [
      "1 workspace",
      "100 stored takes",
      "Local replay",
      "7-day history",
    ],
  },
  {
    name: "Forge",
    copy: "For a team that shares the work of debugging.",
    monthly: 19,
    yearly: 15,
    features: [
      "Shared workspaces",
      "10,000 stored takes",
      "Share links and CI replay",
      "30-day history",
    ],
  },
  {
    name: "Foundry",
    copy: "For teams with their own infrastructure and policies.",
    monthly: null,
    yearly: null,
    features: [
      "Self-hosted deployment",
      "Custom take limits",
      "SSO and audit logs",
      "Custom retention",
    ],
  },
] as const;

export const frequentQuestions = [
  {
    question: "Does Emberlog see my customer data?",
    answer:
      "This website uses a checkout fixture with synthetic data. In the product design, the capture agent redacts configured fields before a take leaves your service boundary.",
  },
  {
    question: "What does capture cost in latency?",
    answer:
      "The figures on this site illustrate the product design. They come from sample scenarios and should not be used as production benchmarks.",
  },
  {
    question: "Can I self-host?",
    answer:
      "The downloadable demo runs locally with Node. Self-hosted capture is part of the Foundry product concept.",
  },
  {
    question: "Which databases can it replay against?",
    answer:
      "The browser demo simulates one HTTP checkout and does not connect to a database. The product concept replays HTTP requests against a service you control.",
  },
  {
    question: "How do I delete a take?",
    answer:
      "The browser uses a bundled sample that resets when you reload. You can delete downloaded fixtures and scripts from your own machine whenever you are done.",
  },
];

export const timelineLabels = ["0", "300", "600", "900", "1,200 ms"];
