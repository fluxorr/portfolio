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
    title: "v0",
    desc: "AI-powered UI generation platform by Vercel",
    href: "https://v0.dev",
    github: "https://github.com/vercel/v0",
    tech: ["react", "nextdotjs", "tailwindcss", "typescript"],
  },
  {
    title: "Motion",
    desc: "Animation library for React and vanilla JavaScript. Animation library for React and vanilla JavaScript. Animation library for React and vanilla JavaScript.   ",
    href: "https://motion.dev",
    github: "https://github.com/motiondivision/motion",
    tech: ["javascript", "css"],
  },
  {
    title: "shadcn/ui",
    desc: "Re-usable components built with Radix and Tailwind CSS",
    href: "https://ui.shadcn.com",
    github: "https://github.com/shadcn-ui/ui",
    tech: ["react", "typescript", "tailwindcss"],
  },
];

const iconMap: Record<string, { title: string; path: string }> = {
  react: siReact,
  nextdotjs: siNextdotjs,
  tailwindcss: siTailwindcss,
  typescript: siTypescript,
  javascript: siJavascript,
  css: siCss,
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
      className="mx-auto max-w-4xl border-x border-dashed border-neutral-400/50 p-4 flex flex-col text-left relative"
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
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener"
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              className="group relative flex items-start gap-6 px-4 py-6 transition-colors hover:bg-accent/20"
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
                        title={icon.title}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width={14}
                          height={14}
                          fill="currentColor"
                        >
                          <path d={icon.path} />
                        </svg>
                      </span>
                    );
                  })}
                </div>
              </div>
              {p.href && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(p.github, "_blank");
                  }}
                  className="relative z-10 p-2 text-muted-foreground/50 hover:text-foreground transition-colors shrink-0 cursor-pointer"
                  title="View source"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={18}
                    height={18}
                    fill="currentColor"
                  >
                    <path d={siGithub.path} />
                  </svg>
                </span>
              )}
            </a>
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
            className="w-full h-full object-cover border border-neutral-500/40 rounded-md"
          />
        </motion.div>
      )}

      <div className="absolute inset-y-[-30%] -left-6 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
      <div className="absolute inset-y-[-30%] -right-6 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
    </div>
  );
}
