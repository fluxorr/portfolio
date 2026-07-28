"use client";
import { motion } from "motion/react";
import { type PointerEvent, useRef, useState } from "react";
import {
  siCss,
  siGithub,
  siJavascript,
  siNextdotjs,
  siReact,
  siTailwindcss,
  siTypescript,
  siRust,
  siFramer,
  siTauri,
  siCodemirror,
  siMarkdown,
  siTokio,



} from "simple-icons";
import { Scales } from "../core/scales";
import { AnimateElement } from "../ui/element-animate";
import { TextAnimate } from "../ui/text-animate";

interface Project {
  title: string;
  desc: string;
  href?: string;
  github: string;
  tech: string[];
}

const projects: Project[] = [
  {
    title: "SpeakDown",
    desc: "A local-first Markdown editor with on-device AI voice dictation, privacy-first transcription, and seamless writing workflows.",
    href: "https://speakdown.byflux.me/", // replace with your actual URL
    github: "https://github.com/fluxorr/speakdown",
    tech: [
      "tauri",
      "react",
      "rust",
      "tokiors",
      "typescript",
      "codemirror",
      "markdown",
    ],
  },
  {
    title: "Aegis Academy",
    desc: "An interactive platform for mastering distributed systems through visual lessons, real-world failures, and hands-on labs.",
    href: "https://aegis.byflux.me/",
    github: "https://github.com/fluxorr/aegis",
    tech: [
      "nextdotjs",
      "react",
      "typescript",
      "tailwindcss",
      "turso",
      "sqlite",
      "docker",
      "redis",
      "go",
    ],
  },
  {
    title: "Nooks",
    desc: "A browser extension that saves, organizes, and rediscovers your favorite links in beautifully designed collections.",
    href: "https://nooks-ge8uubsdc-rahuls-projects-934cee74.vercel.app/",
    github: "https://github.com/fluxorr/nooks",
    tech: [
      "react",
      "typescript",
      "tailwindcss",
      "webextensions",
      "vite",
      "turso",
      "motion"
    ],
  },
  {
    title: "Kosei",
    desc: "An AI-powered video creator that transforms prompts into polished short-form content with minimal editing.",
    href: "https://kosei-one.vercel.app/",
    github: "https://github.com/rahulchaudhari06/kosei",
    tech: [
      "nextdotjs",
      "react",
      "typescript",
      "tailwindcss",
      "remotion",
      "openrouter",
      "hono",
    ],
  },
  {
    title: "Closely",
    desc: "A playful relationship game that helps long-distance couples stay connected through daily challenges and shared memories.",
    href: "https://closely-emtg.vercel.app/",
    github: "https://github.com/rahulchaudhari06/closely",
    tech: [
      "react",
      "typescript",
      "nextdotjs",
      "tailwindcss",
      "supabase",
      "clerk",
      "framer",
    ],
  },
];

const iconMap: Record<string, { title: string; path: string }> = {
  react: siReact,
  nextdotjs: siNextdotjs,
  tailwindcss: siTailwindcss,
  typescript: siTypescript,
  javascript: siJavascript,
  css: siCss,
  rust: siRust,
  framer: siFramer,
  tauri: siTauri,
  codemirror: siCodemirror,
  markdown: siMarkdown,
  tokiors: siTokio,
};

export default function ProjectShowcase() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointer = (e: PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointer}
      className="mx-auto max-w-4xl  p-4 flex flex-col text-left relative"
    >
      <div className="px-4 pt-4 pb-2 relative z-10">
        <TextAnimate
          by="line"
          animation="slideRight"
          className="font-display text-2xl px-4 text-foreground mt-1"
        >
          Projects
        </TextAnimate>
      </div>

      <AnimateElement
        by="children"
        animation="slideUp"
        startOnView
        once
        className="divide-y divide-dashed divide-neutral-400/30"
      >
        {projects.map((p, i) => {
          const link = p.href || p.github;
          return (
            <div
              key={i}
              onClick={() => window.open(link, "_blank")}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              className="group relative flex items-start gap-6 px-4 py-6 transition-colors hover:bg-accent/20 cursor-pointer"
            >
              <span className="font-hand text-sm text-muted-foreground w-8 shrink-0 pt-1 relative z-10">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0 relative z-10">
                <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-foreground/70">
                  {p.title}
                </h3>
                <p className="font-syne text-sm text-muted-foreground/70 mt-1 max-w-xl leading-relaxed">
                  {p.desc}
                </p>
                <div className="flex items-center gap-2.5 mt-3">
                  {p.tech.map((slug) => {
                    const icon = iconMap[slug];
                    if (!icon) return null;
                    return (
                      <span
                        key={slug}
                        className="text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width={14}
                          height={14}
                          fill="currentColor"
                          role="img"
                          aria-label={icon.title}
                        >
                          <title>{icon.title}</title>
                          <path d={icon.path} />
                        </svg>
                      </span>
                    );
                  })}
                </div>
              </div>
              {p.href && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(p.github, "_blank");
                  }}
                  className="relative z-10 p-2 text-muted-foreground/50 hover:text-foreground transition-colors shrink-0 cursor-pointer"
                  aria-label="View source on GitHub"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={18}
                    height={18}
                    fill="currentColor"
                    role="img"
                    aria-label="GitHub"
                  >
                    <title>GitHub</title>
                    <path d={siGithub.path} />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </AnimateElement>

      {hovered !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            left: pos.x,
            top: pos.y,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: 0.25,
            left: { duration: 0.15 },
            top: { duration: 0.15 },
          }}
          className="pointer-events-none absolute z-50 w-48 h-36 -translate-x-1/2 -translate-y-full -mt-4 overflow-hidden hidden lg:block"
        >
          <img
            src={`/project${hovered + 1}.png`}
            alt={projects[hovered].title}
            loading="lazy"
            className="w-full h-full object-cover border border-neutral-500/40 rounded-md"
          />
        </motion.div>
      )}

      <div className="absolute inset-y-[-30%] -left-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
      <div className="absolute inset-y-[-30%] -right-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
    </div>
  );
}
