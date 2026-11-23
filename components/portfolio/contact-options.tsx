"use client";

import { useState } from "react";
import { type ProjectType, portfolio } from "@/lib/portfolio-content";
import { Arrow, StartProject } from "./links";
import { CopyEmail } from "./portfolio-client";

export function ContactOptions() {
  const [projectType, setProjectType] = useState<ProjectType>();
  const { bookingUrl, email, projectTypes } = portfolio.contact;

  return (
    <div className="portfolio-contact-options">
      <fieldset className="portfolio-contact-choices">
        <legend className="sr-only">Project type (optional)</legend>
        {projectTypes.map((type) => (
          <button
            aria-pressed={projectType === type}
            className="portfolio-contact-choice"
            key={type}
            onClick={() =>
              setProjectType((current) => (current === type ? undefined : type))
            }
            type="button"
          >
            {type}
            <span className="portfolio-contact-indicator" aria-hidden="true">
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="m2.4 6 2.3 2.3 4.9-4.9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        ))}
      </fieldset>
      <div className="portfolio-actions">
        <StartProject location="contact" projectType={projectType} />
        <a
          className="portfolio-button portfolio-button--secondary"
          data-portfolio-event="cta_book_call"
          data-portfolio-location="contact"
          href={bookingUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Book a call <Arrow direction="out" />
        </a>
        <CopyEmail email={email} />
      </div>
    </div>
  );
}
