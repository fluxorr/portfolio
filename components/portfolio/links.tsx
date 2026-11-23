import {
  getProjectInquiryHref,
  type ProjectType,
  portfolio,
} from "@/lib/portfolio-content";

export function Arrow({
  direction = "right",
}: {
  direction?: "right" | "down" | "out";
}) {
  const paths = {
    right: "M3 8h10m-4-4 4 4-4 4",
    down: "M8 3v10m-4-4 4 4 4-4",
    out: "M4 12 12 4M6 4h6v6",
  };

  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d={paths[direction]}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Check() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="m3.5 8.1 2.9 2.9 6.1-6.1"
        pathLength="1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark() {
  return (
    <a
      className="portfolio-wordmark"
      href="/"
      aria-label={`${portfolio.wordmark} home`}
    >
      {portfolio.wordmark}
      <span aria-hidden="true">.</span>
    </a>
  );
}

export function StartProject({
  location,
  variant = "primary",
  projectType,
}: {
  location: "nav" | "hero" | "after_work" | "contact";
  variant?: "primary" | "compact" | "text";
  projectType?: ProjectType;
}) {
  const variantClass =
    variant === "compact" ? "primary portfolio-button--compact" : variant;

  return (
    <a
      className={`portfolio-button portfolio-button--${variantClass}`}
      href={
        location === "contact" ? getProjectInquiryHref(projectType) : "#contact"
      }
      data-portfolio-event="cta_start_project"
      data-portfolio-location={location}
    >
      {location === "contact" ? "Continue by email" : portfolio.actions.project}
      <Arrow direction="out" />
    </a>
  );
}
