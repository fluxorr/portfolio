export type WorkItem = {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  liveUrl: string;
  mobileImage?: string;
};

type ExperienceEntry = {
  role: string;
  organization: string;
  context?: string;
  dates?: string;
};

export const portfolio = {
  url: "https://byflux.me",
  name: "Rahul Chaudhari",
  wordmark: "byflux",
  title: "Rahul Chaudhari — Independent website designer & developer",
  description:
    "I design and build sharp, fast, genuinely useful websites for founders and growing teams.",
  contact: {
    // Confirm that the existing portfolio address is the preferred inquiry inbox.
    email: "fluxorr@gmail.com",
    bookingUrl: "https://cal.com/byflux",
    subject: "Website project inquiry",
    projectTypes: ["Landing page", "New website", "Redesign"] as const,
  },
  github: "https://github.com/fluxorr",
  navigation: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
  ],
  hero: {
    eyebrow: "Rahul Chaudhari · Independent designer & developer",
    headline: ["I design and build", "websites worth visiting."],
    description:
      "I help founders turn early ideas into sharp, fast websites, from the first layout to the finished build.",
  },
  work: {
    title: "Selected work",
    items: [
      {
        id: "slips",
        name: "Slips",
        image: "/work/slips.webp",
        imageAlt:
          "Slips landing page with a leather wallet holding invoice cards",
        mobileImage: "/work/slips-mobile.webp",
        liveUrl: "https://slips-landing.vercel.app/",
      },
      {
        id: "outlines",
        name: "Outlines",
        image: "/work/outlines.webp",
        imageAlt: "Outlines practice site with an annotated desk lamp drawing",
        liveUrl: "https://outlines-practice.vercel.app/",
      },
      {
        id: "speakdown",
        name: "Speakdown",
        image: "/work/speakdown.webp",
        imageAlt:
          "Speakdown landing page with a screenshot of its Markdown editor",
        liveUrl: "https://speakdown.byflux.me/",
      },
      {
        id: "closely",
        name: "Closely",
        image: "/work/closely.webp",
        imageAlt:
          "Closely landing page with an illustration of two people in separate rooms",
        liveUrl: "https://closely.byflux.me/",
      },
      {
        id: "vynexa",
        name: "VyNexa Ads",
        image: "/work/vynexa.webp",
        imageAlt:
          "VyNexa Ads landing page with oversized white type and orange accents",
        liveUrl: "https://www.vynexaads.online/",
      },
      {
        id: "drops",
        name: "Drops",
        image: "/work/drops.webp",
        imageAlt:
          "Drops landing page with a black headline and a light lesson preview",
        liveUrl: "https://drops-indol.vercel.app/",
      },
      {
        id: "byflux-work",
        name: "Byflux Work",
        image: "/work/byflux-work.webp",
        imageAlt:
          "Byflux Work landing page with white and red typography on a dark background",
        liveUrl: "https://work.byflux.me/",
      },
    ] satisfies readonly WorkItem[],
  },
  services: {
    eyebrow: "What I do",
    title: "From first sketch to finished website.",
    description:
      "One person across design and development, without the handoff friction.",
    items: [
      {
        title: "Website design",
        description:
          "Clear structure, visual direction, and responsive layouts that make your site easy to use.",
      },
      {
        title: "Development",
        description:
          "Fast, responsive websites and web apps, built to be maintained and improved.",
      },
      {
        title: "Interaction & polish",
        description:
          "Purposeful motion, custom components, and the small details that make a site feel finished.",
      },
    ],
  },
  about: {
    title: "Hi, I’m Rahul.",
    description:
      "I like building websites that are easy to understand and a pleasure to use. I pay as much attention to the structure and code as I do to the details you see on screen.",
    // Add public experience entries once role, organization, and dates are confirmed.
    experience: [] as readonly ExperienceEntry[],
  },
  contactCopy: {
    title: "What are you working on?",
    description:
      "Choose a project type to prefill your email, or start with a general inquiry.",
  },
  actions: {
    project: "Start a project",
    work: "Explore my work",
  },
};

export type ProjectType = (typeof portfolio.contact.projectTypes)[number];

export function getProjectInquiryHref(projectType?: ProjectType) {
  const body = [
    "Hi Rahul,",
    "",
    projectType ? `Project type: ${projectType}` : "Project type:",
    "Timeline:",
    "Website or references:",
    "",
  ].join("\n");

  return `mailto:${portfolio.contact.email}?subject=${encodeURIComponent(portfolio.contact.subject)}&body=${encodeURIComponent(body)}`;
}
