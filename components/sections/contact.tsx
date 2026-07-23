"use client";

import {
  GithubIcon,
  MailIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { Scales } from "../core/scales";
import { AnimateElement } from "../ui/element-animate";

const contacts = [
  { icon: NewTwitterIcon, label: "@fluxorr_", href: "https://x.com/fluxorr_" },
  {
    icon: MailIcon,
    label: "fluxorr@gmail.com",
    href: "mailto:fluxorr@gmail.com",
  },
  { icon: GithubIcon, label: "@fluxorr", href: "https://github.com/fluxorr" },
];

const Contact = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (label: string) => {
    if (timer.current) clearTimeout(timer.current);
    setHovered(label);
  };

  const hide = () => {
    timer.current = setTimeout(() => setHovered(null), 1000);
  };

  return (
    <div className="mx-auto max-w-4xl border-x border-dashed border-neutral-400/50 p-4 flex flex-col text-left relative">
      <div className="p-4 relative z-10">
        <div className="flex justify-between items-center text-foreground/55">
          <AnimateElement
            as="div"
            animation="slideRight"
            className="flex px-4 gap-4"
          >
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => show(c.label)}
                onMouseLeave={hide}
                className="ring-1 ring-muted w-fit p-2 rounded-md cursor-pointer hover:bg-accent/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <HugeiconsIcon
                  icon={c.icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={1}
                />
              </a>
            ))}
          </AnimateElement>
          <div className="px-4 flex items-center text-sm font-syne">
            <AnimatePresence mode="popLayout">
              <AnimateElement
                key={hovered ?? "default"}
                animation="blurIn"
                duration={0.35}
              >
                {hovered ?? "Socials"}
              </AnimateElement>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute inset-y-[-30%] -left-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
          <Scales size={8} className="rounded-lg" />
        </div>
        <div className="absolute inset-y-[-30%] -right-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
          <Scales size={8} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
