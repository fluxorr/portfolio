"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun01Icon, Moon01Icon } from "@hugeicons/core-free-icons";
import { ThemeToggler, type ThemeSelection } from "@/components/animate-ui/primitives/effects/theme-toggler";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <span className="w-5 inline-block" />;

  return (
    <ThemeToggler theme={theme as ThemeSelection} resolvedTheme={resolvedTheme as "light" | "dark"} setTheme={setTheme} direction="ttb">
      {({ effective, toggleTheme }) => (
        <button onClick={() => toggleTheme(effective === "dark" ? "light" : "dark")}>
          <HugeiconsIcon icon={effective === "dark" ? Sun01Icon : Moon01Icon} size={18} />
        </button>
      )}
    </ThemeToggler>
  );
}
