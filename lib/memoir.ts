export const memoirPath = "/showcase/memoir";
export const memoirOg = "/showcase/memoir/og.jpg";
export const memoirOgAlt =
  "Memoir. Good ideas deserve a better memory. A silver halftone memory trace on an ink-black background.";

export type SourceType = "meeting" | "voice" | "note" | "conversation";
export type Cluster = "Work" | "People" | "Ideas" | "Decisions";
export type Memory = {
  id: string;
  title: string;
  sourceType: SourceType;
  capturedAt: string;
  excerpt: string;
  people: string[];
  tags: string[];
  relatedMemoryIds: string[];
  cluster: Cluster;
};
export type Decision = {
  id: string;
  text: string;
  owner?: string;
  status: "agreed" | "open" | "superseded";
  sourceMemoryIds: string[];
};
export type DemoAnswer = {
  id: string;
  label: string;
  question: string;
  answer: string;
  sourceMemoryIds: string[];
};

export const sourceLabels: Record<SourceType, string> = {
  meeting: "Meeting",
  voice: "Voice note",
  note: "Note",
  conversation: "Conversation",
};

export const memories: Memory[] = [
  {
    id: "m-01",
    title: "Product sync",
    sourceType: "meeting",
    capturedAt: "Today · 10:32",
    excerpt:
      "Move the beta release to Thursday. Prioritize onboarding empty states and the invite flow.",
    people: ["Maya", "Jules"],
    tags: ["Beta launch"],
    relatedMemoryIds: ["m-02", "m-03", "m-07"],
    cluster: "Work",
  },
  {
    id: "m-02",
    title: "Launch notes",
    sourceType: "note",
    capturedAt: "Yesterday · 16:18",
    excerpt:
      "Keep the first-run experience to three steps at most. Let the checklist mark each small win.",
    people: ["Maya"],
    tags: ["Beta launch"],
    relatedMemoryIds: ["m-01", "m-03"],
    cluster: "Decisions",
  },
  {
    id: "m-03",
    title: "Monday voice memo",
    sourceType: "voice",
    capturedAt: "Monday · 08:41",
    excerpt:
      "An onboarding checklist that celebrates small wins could make the setup feel less daunting.",
    people: [],
    tags: ["Beta launch"],
    relatedMemoryIds: ["m-02", "m-08"],
    cluster: "Ideas",
  },
  {
    id: "m-04",
    title: "Design review",
    sourceType: "meeting",
    capturedAt: "Thursday · 14:08",
    excerpt:
      "Keep the interface neutral and reserve the accent color for the one thing we want people to notice.",
    people: ["Jules"],
    tags: ["Design system"],
    relatedMemoryIds: ["m-09", "m-11"],
    cluster: "Work",
  },
  {
    id: "m-05",
    title: "Coffee with Sam",
    sourceType: "conversation",
    capturedAt: "Last week · 11:05",
    excerpt:
      "Sam recommended showing supporting sources beside every summary, where people can check them.",
    people: ["Sam"],
    tags: ["Research"],
    relatedMemoryIds: ["m-10", "m-12"],
    cluster: "People",
  },
  {
    id: "m-06",
    title: "Planning retro",
    sourceType: "note",
    capturedAt: "Last week · 16:45",
    excerpt:
      "Our biggest slowdown was decisions scattered across three channels. Keep the agreed version linked to the meeting.",
    people: ["Maya", "Sam"],
    tags: ["Beta launch"],
    relatedMemoryIds: ["m-01", "m-10"],
    cluster: "Decisions",
  },
  {
    id: "m-07",
    title: "Invite-flow review",
    sourceType: "meeting",
    capturedAt: "Tuesday · 13:20",
    excerpt:
      "Jules will test the invite with a fresh account before Thursday. Check what happens when the invite expires.",
    people: ["Jules"],
    tags: ["Beta launch"],
    relatedMemoryIds: ["m-01", "m-02"],
    cluster: "Work",
  },
  {
    id: "m-08",
    title: "Paper prototype",
    sourceType: "note",
    capturedAt: "Monday · 14:02",
    excerpt:
      "The first checklist feels clearer when each step has a verb and the next action sits in the same place.",
    people: ["Maya"],
    tags: ["Design system"],
    relatedMemoryIds: ["m-03", "m-09"],
    cluster: "Ideas",
  },
  {
    id: "m-09",
    title: "Color proof",
    sourceType: "note",
    capturedAt: "Friday · 10:20",
    excerpt:
      "Use the violet accent for selected states and links. Keep non-interactive labels in ink.",
    people: ["Jules"],
    tags: ["Design system"],
    relatedMemoryIds: ["m-04", "m-08"],
    cluster: "Decisions",
  },
  {
    id: "m-10",
    title: "Research debrief",
    sourceType: "conversation",
    capturedAt: "Wednesday · 12:45",
    excerpt:
      "Sam noticed that people check source dates when two answers disagree. Put the date alongside each citation.",
    people: ["Sam", "Maya"],
    tags: ["Research"],
    relatedMemoryIds: ["m-05", "m-06", "m-12"],
    cluster: "People",
  },
  {
    id: "m-11",
    title: "A quieter archive",
    sourceType: "voice",
    capturedAt: "Tuesday · 17:12",
    excerpt:
      "Try showing just the selected relationships first, with the rest of the map sitting back.",
    people: [],
    tags: ["Design system"],
    relatedMemoryIds: ["m-04", "m-09"],
    cluster: "Ideas",
  },
  {
    id: "m-12",
    title: "Sam’s follow-up",
    sourceType: "conversation",
    capturedAt: "Friday · 09:15",
    excerpt:
      "Next time, bring one example of a summary with a good source trail and one where the trail breaks.",
    people: ["Sam"],
    tags: ["Research"],
    relatedMemoryIds: ["m-05", "m-10"],
    cluster: "People",
  },
];

export const decisions: Decision[] = [
  {
    id: "beta",
    text: "Move the beta to Thursday.",
    owner: "Maya",
    status: "agreed",
    sourceMemoryIds: ["m-01", "m-02"],
  },
  {
    id: "invite",
    text: "Test an expired invite before the release.",
    owner: "Jules",
    status: "open",
    sourceMemoryIds: ["m-07"],
  },
  {
    id: "evidence",
    text: "Show supporting sources beside a summary.",
    status: "agreed",
    sourceMemoryIds: ["m-05", "m-10"],
  },
  {
    id: "accent",
    text: "Reserve violet for selected states and links.",
    status: "agreed",
    sourceMemoryIds: ["m-04", "m-09"],
  },
];

export const answers: DemoAnswer[] = [
  {
    id: "beta",
    label: "Beta launch",
    question: "What did we decide about the beta launch?",
    answer:
      "The beta moved to Thursday. The immediate priorities are the onboarding empty states and invite flow.",
    sourceMemoryIds: ["m-01", "m-02"],
  },
  {
    id: "checklist",
    label: "Checklist idea",
    question: "Where did the onboarding checklist idea come from?",
    answer:
      "It started as a Monday voice memo and was refined in yesterday’s launch notes, where Maya pared the first run down to three steps.",
    sourceMemoryIds: ["m-03", "m-02"],
  },
  {
    id: "sam",
    label: "Sam’s recommendation",
    question: "What did Sam recommend?",
    answer:
      "Sam suggested giving every summary supporting sources so people can check where it came from.",
    sourceMemoryIds: ["m-05"],
  },
];

const byId = new Map(memories.map((memory) => [memory.id, memory]));
export function getMemory(id: string) {
  const memory = byId.get(id);
  if (!memory) throw new Error(`Unknown sample memory: ${id}`);
  return memory;
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, " ");
export function findAnswer(question: string) {
  const query = normalize(question);
  return answers.find(
    (answer) =>
      normalize(answer.question) === query || normalize(answer.label) === query,
  );
}

export const metrics = [
  { label: "Captured moments", value: memories.length },
  { label: "Linked decisions", value: decisions.length },
  {
    label: "Projects in the archive",
    value: new Set(memories.flatMap(({ tags }) => tags)).size,
  },
  {
    label: "Conversations to revisit",
    value: memories.filter(({ sourceType }) => sourceType === "conversation")
      .length,
  },
];

export const faq = [
  [
    "What exactly does Memoir remember?",
    "The preview shows how meeting notes, voice memos, quick notes, and conversation excerpts could live in one memory library.",
  ],
  [
    "Can it connect notes from different sources?",
    "Try Connections with the sample library. It links a Monday voice memo to the launch notes and the product sync. Live account integrations aren’t connected in this preview.",
  ],
  [
    "Does Memoir show where an answer came from?",
    "Yes, the guided answers each show their sample sources. Select a citation to read the excerpt that supports it.",
  ],
  [
    "What happens to the text I type?",
    "Ask Memoir compares your question with the example prompts in your browser. The question stays on the page and clears when you close the assistant or leave the page.",
  ],
  [
    "Does it work without recording every meeting?",
    "The concept also supports written and spoken notes. In the preview, you can explore notes alongside meeting excerpts without granting microphone or calendar access.",
  ],
  [
    "When can I try Memoir?",
    "You can explore the sample library now. This showcase is a product concept. The public launch date and account access haven’t been announced.",
  ],
] as const;
