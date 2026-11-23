"use client";

import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { Arrow, Check } from "@/components/portfolio/links";
import {
  type BookingSelection,
  bookingQuery,
  commonhourPath,
  dateLabel,
  duration,
  timeLabel,
  zones,
} from "@/lib/commonhour";
import { RollingTime } from "./rolling-time";

export function Mark() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 28 28">
      <rect x="3.5" y="8.5" width="14" height="14" rx="3" />
      <rect x="10.5" y="5.5" width="14" height="14" rx="3" />
      <path d="M14 12.5h4m-2-2v4" />
    </svg>
  );
}

const faq = [
  {
    question: "What happens when I confirm a booking?",
    answer:
      "Commonhour prepares a sample calendar event with your selected time and its 25-minute duration. You can import the file into your calendar.",
  },
  {
    question: "What stays the same when I change time zones?",
    answer:
      "The selected instant stays the same. The time and date labels change to match your zone, and shared hours recalculate using both cities’ working days.",
  },
  {
    question: "What does a shared link open?",
    answer:
      "It opens the booking demo with your sample date, time, and time zone already selected. The recipient can review that time or choose another one.",
  },
] as const;

export const BookingLink = memo(function BookingLink({
  selection,
}: {
  selection: BookingSelection;
}) {
  const [origin, setOrigin] = useState("https://byflux.me");
  const [copied, setCopied] = useState("");
  const [failed, setFailed] = useState(false);
  const { day, zone, slot } = selection;
  const city = zones.find((option) => option.id === zone)?.city ?? "New York";
  const link =
    slot === null ? "" : origin + commonhourPath + bookingQuery(selection);
  const currentCopy = link && copied === link;

  useEffect(() => setOrigin(window.location.origin), []);

  return (
    <section
      aria-labelledby="ch-share-title"
      className="ch-share ch-shell"
      id="commonhour-share"
    >
      <div className="ch-comparison-copy">
        <p className="ch-eyebrow">Sharing</p>
        <h2 id="ch-share-title">Send the exact time.</h2>
        <p>
          Share a link that opens on the date, time, and time zone you picked.
          Your guest can check the same opening for themselves.
        </p>
      </div>
      <div className="ch-link-card">
        <div className="ch-link-preview">
          <div aria-hidden="true" className="ch-link-mark">
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
              <path d="m10 14 4-4m-6 6-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0m2 6a3 3 0 0 0 4 0l4-4a3 3 0 0 0-4-4l-1 1" />
            </svg>
          </div>
          <div>
            <h3>Project intro</h3>
            <span>Fieldwork Studio · {duration} min</span>
          </div>
          {slot !== null && (
            <div className="ch-link-reading">
              <strong>
                <RollingTime value={timeLabel(day, slot, zone)} />
              </strong>
              <span>
                {dateLabel(day, slot, zone)} · {city}
              </span>
            </div>
          )}
        </div>
        <div className="ch-copy-strip">
          <input
            aria-label="Shareable booking link"
            onFocus={(event) => event.currentTarget.select()}
            placeholder="Choose a time to create a link"
            readOnly
            type="text"
            value={link}
          />
          <button
            className="ch-button ch-primary"
            disabled={!link}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(link);
                setCopied(link);
                setFailed(false);
              } catch {
                setFailed(true);
              }
            }}
            type="button"
          >
            {currentCopy ? "Link copied" : "Copy link"}{" "}
            {currentCopy ? <Check /> : <Arrow direction="out" />}
          </button>
        </div>
        <output className={failed ? "ch-copy-message" : "ch-sr"}>
          {failed
            ? "Select the link to copy it."
            : currentCopy
              ? "Booking link copied."
              : ""}
        </output>
      </div>
    </section>
  );
});

export function CommonhourFaq() {
  return (
    <section
      aria-labelledby="ch-faq-title"
      className="ch-faq ch-shell"
      id="commonhour-faq"
    >
      <h2 id="ch-faq-title">Good to know.</h2>
      <div className="ch-faq-list">
        {faq.map(({ question, answer }) => (
          <details key={question} name="commonhour-questions">
            <summary>
              {question}
              <i aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CommonhourFooter() {
  return (
    <footer className="ch-footer ch-shell">
      <div className="ch-footer-grid">
        <div className="ch-footer-brand">
          <a className="ch-brand" href="#commonhour-main">
            <Mark /> Commonhour
          </a>
          <p>Scheduling for teams across time zones.</p>
        </div>
        <nav aria-label="Product links">
          <h2>Product</h2>
          <a href="#commonhour-picker">Booking demo</a>
          <a href="#commonhour-zones">Time zones</a>
          <a href="#commonhour-share">Share a booking</a>
        </nav>
        <nav aria-label="byflux links">
          <h2>Studio</h2>
          <Link href="/showcase#blocks" prefetch={false}>
            Portfolio showcase <Arrow direction="out" />
          </Link>
          <Link href="/#contact" prefetch={false}>
            Get in touch <Arrow direction="out" />
          </Link>
        </nav>
      </div>
      <div className="ch-footer-end">
        <span>A product concept by byflux</span>
        <a href="#commonhour-main">
          Back to top <Arrow direction="out" />
        </a>
      </div>
    </footer>
  );
}
