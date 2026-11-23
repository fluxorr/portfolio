"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { emberlogPath } from "@/lib/emberlog";
import { EmberIcon, EmberWordmark } from "./mark";

const navLinks = [
  { label: "Product", href: emberlogPath },
  { label: "Docs", href: `${emberlogPath}/docs` },
  { label: "Pricing", href: `${emberlogPath}/pricing` },
];

export function EmberNav() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let previous = window.scrollY;
    function onScroll() {
      const current = window.scrollY;
      if (Math.abs(current - previous) < 8 && current > 84) return;
      setCompact(current > 84 && current > previous);
      previous = current;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function navigation(mobile = false) {
    return navLinks.map(({ label, href }) => (
      <Link
        aria-current={pathname === href ? "page" : undefined}
        href={href}
        key={href}
        onClick={mobile ? () => menu.current?.close() : undefined}
        prefetch={false}
      >
        {label}
      </Link>
    ));
  }

  return (
    <>
      <a className="el-skip" href="#emberlog-main">
        Skip to content
      </a>
      <header className="el-header" data-compact={compact}>
        <div className="el-nav">
          <EmberWordmark />
          <nav aria-label="Emberlog" className="el-nav-links">
            {navigation()}
          </nav>
          <Link
            aria-label="Replay engine v3.2 notes"
            className="el-version"
            href={`${emberlogPath}/docs#replay`}
            prefetch={false}
          >
            <i /> v3.2 <span>Replay engine</span>
          </Link>
          <Link
            className="el-button el-button-nav"
            href={`${emberlogPath}#replay`}
            prefetch={false}
          >
            Open replay <EmberIcon name="arrow" />
          </Link>
          <EmberTheme />
          <button
            aria-haspopup="dialog"
            aria-label="Open navigation"
            className="el-menu-button el-icon-button"
            onClick={() => menu.current?.showModal()}
            type="button"
          >
            <EmberIcon name="menu" />
          </button>
        </div>
      </header>
      <dialog aria-label="Site navigation" className="el-menu" ref={menu}>
        <div className="el-menu-top">
          <EmberWordmark />
          <form method="dialog">
            <button
              aria-label="Close navigation"
              className="el-icon-button"
              type="submit"
            >
              <EmberIcon name="close" />
            </button>
          </form>
        </div>
        <nav aria-label="Mobile Emberlog">{navigation(true)}</nav>
        <Link
          className="el-button el-primary"
          href={`${emberlogPath}#replay`}
          onClick={() => menu.current?.close()}
          prefetch={false}
        >
          Open replay <EmberIcon name="arrow" />
        </Link>
      </dialog>
    </>
  );
}

export function EmberTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.getElementById("emberlog-site");
    const system = matchMedia("(prefers-color-scheme: dark)");
    const sync = () =>
      setDark(
        root?.dataset.theme ? root.dataset.theme === "dark" : system.matches,
      );
    sync();
    system.addEventListener("change", sync);
    return () => system.removeEventListener("change", sync);
  }, []);

  return (
    <button
      aria-label="Dark theme"
      aria-pressed={dark}
      className="el-theme el-icon-button"
      onClick={(event) => {
        const root = document.getElementById("emberlog-site");
        if (!root) return;
        const next = dark ? "light" : "dark";
        const apply = () => {
          root.dataset.theme = next;
          setDark(next === "dark");
          try {
            localStorage.setItem("emberlog-theme", next);
          } catch {}
        };
        if (
          !document.startViewTransition ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          apply();
          return;
        }
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = bounds.x + bounds.width / 2;
        const y = bounds.y + bounds.height / 2;
        const radius = Math.hypot(
          Math.max(x, innerWidth - x),
          Math.max(y, innerHeight - y),
        );
        document.documentElement.style.setProperty("--el-theme-x", `${x}px`);
        document.documentElement.style.setProperty("--el-theme-y", `${y}px`);
        document.documentElement.style.setProperty(
          "--el-theme-radius",
          `${radius}px`,
        );
        document.startViewTransition(apply);
      }}
      type="button"
    >
      <EmberIcon name={dark ? "sun" : "moon"} />
    </button>
  );
}
