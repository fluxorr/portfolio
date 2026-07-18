"use client";

import { ThemeProvider } from "next-themes";
import { GlimmProvider } from "glimm/next";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlimmProvider>
      <ThemeProvider attribute="class" defaultTheme="system">{children}</ThemeProvider>
    </GlimmProvider>
  );
}
