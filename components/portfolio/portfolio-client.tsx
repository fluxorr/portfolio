"use client";

import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

export function PortfolioAnalytics() {
  useEffect(() => {
    function recordClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>(
        "a[data-portfolio-event]",
      );
      const name = link?.dataset.portfolioEvent;
      if (!name) return;

      const { portfolioLocation, portfolioProject, portfolioDestination } =
        link.dataset;
      track(name, {
        ...(portfolioLocation ? { location: portfolioLocation } : {}),
        ...(portfolioProject ? { project: portfolioProject } : {}),
        ...(portfolioDestination ? { destination: portfolioDestination } : {}),
      });
    }

    document.addEventListener("click", recordClick);
    return () => document.removeEventListener("click", recordClick);
  }, []);

  return null;
}

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied");
      track("contact_copy");
    } catch {
      setStatus(`Email address: ${email}`);
    }
  }

  return (
    <div className="portfolio-copy">
      <button
        className="portfolio-button portfolio-button--secondary"
        onClick={copy}
        type="button"
      >
        <svg
          aria-hidden="true"
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="none"
        >
          <rect
            x="5.5"
            y="5.5"
            width="8"
            height="8"
            rx="1.7"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M3 10V4a1 1 0 0 1 1-1h6"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        Copy email
      </button>
      <output className="portfolio-copy-status">{status}</output>
    </div>
  );
}
