"use client";

import { motion, type Variants } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  type ThemeSelection,
  ThemeToggler,
} from "@/components/animate-ui/primitives/effects/theme-toggler";

// Same three paths as the original DarkModeIcon glyph — outer ring, inner ring, center line.
const ICON_PATHS = [
  "M22 12C22 17.5227 17.5229 22 12 22C6.47713 22 2 17.5227 2 12C2 6.47713 6.47713 2 12 2C17.5229 2 22 6.47713 22 12Z",
  "M16.5 12C16.5 14.4852 14.4853 16.5 12 16.5C9.51471 16.5 7.5 14.4852 7.5 12C7.5 9.51471 9.51471 7.5 12 7.5C14.4853 7.5 16.5 9.51471 16.5 12Z",
  "M12 2V22",
] as const;

// "rest" = fully drawn and settled. "hover" = each path retraces itself,
// staggered by index (via `custom`) so the redraw cascades outward.
const drawVariants: Variants = {
  rest: { pathLength: 1, opacity: 1 },
  hover: (i: number) => ({
    pathLength: [0, 1],
    opacity: [0.35, 1],
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeInOut" },
  }),
};

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <span className="w-8 h-8 inline-block" />;

  return (
    <ThemeToggler
      theme={theme as ThemeSelection}
      resolvedTheme={resolvedTheme as "light" | "dark"}
      setTheme={setTheme}
      direction="ttb"
    >
      {({ effective, toggleTheme }) => (
        <motion.button
          type="button"
          aria-label="Toggle theme"
          onClick={() => toggleTheme(effective === "dark" ? "light" : "dark")}
          className="relative flex items-center justify-center w-8 h-8 rounded-full cursor-pointer "
          initial="rest"
          whileHover="hover"
          whileTap={{ scale: 0.88, rotate: -12 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.svg
            key={effective}
            viewBox="0 0 24 24"
            width={18}
            height={18}
            fill="none"
            role="img"
            aria-label={effective === "dark" ? "Dark mode" : "Light mode"}
            initial={{ rotate: -60, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <title>{effective === "dark" ? "Dark mode" : "Light mode"}</title>
            {ICON_PATHS.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                custom={i}
                variants={drawVariants}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </motion.svg>
        </motion.button>
      )}
    </ThemeToggler>
  );
}
