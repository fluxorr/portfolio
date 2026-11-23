"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Arrow } from "@/components/portfolio/links";
import {
  type BookingSelection,
  bookingFromQuery,
  initialSelection,
  zones,
} from "@/lib/commonhour";
import { BookingWorkspace } from "./booking-workspace";
import { DitherField } from "./dither-field";
import { OverlapTimeline } from "./overlap-timeline";
import { BookingLink, CommonhourFaq, CommonhourFooter, Mark } from "./sections";

export function CommonhourExperience() {
  const [selection, setSelection] = useState(initialSelection);
  const [preview, setPreview] = useState<number | null>(null);
  const [inspecting, setInspecting] = useState<number | null>(null);
  const { day, zone, slot } = selection;
  const city = zones.find((option) => option.id === zone)?.city ?? "New York";
  const minute = inspecting ?? preview ?? slot ?? 720;

  useEffect(() => {
    const shared = bookingFromQuery(
      new URLSearchParams(window.location.search),
    );
    if (shared) setSelection(shared);
  }, []);

  const changeSelection = useCallback((next: BookingSelection) => {
    setSelection(next);
    setPreview(null);
    setInspecting(null);
  }, []);

  return (
    <>
      <a className="ch-skip ch-button" href="#commonhour-main">
        Skip to content
      </a>
      <header className="ch-header ch-shell">
        <a
          aria-label="Commonhour home"
          className="ch-brand"
          href="#commonhour-main"
        >
          <Mark /> Commonhour
        </a>
        <nav aria-label="Commonhour navigation">
          <a className="ch-nav-zones" href="#commonhour-zones">
            Time zones
          </a>
          <Link href="/showcase#blocks" prefetch={false}>
            Showcase
          </Link>
          <a className="ch-nav-action" href="#commonhour-picker">
            Open demo <Arrow direction="down" />
          </a>
        </nav>
      </header>

      <main id="commonhour-main" tabIndex={-1}>
        <section aria-labelledby="ch-title" className="ch-hero ch-shell">
          <h1 id="ch-title">Meet in the middle.</h1>
          <div className="ch-hero-copy">
            <p>
              Scheduling for teams across time zones. Find a time you share and
              book it in your own time.
            </p>
            <a className="ch-button ch-primary" href="#commonhour-picker">
              Try a booking <Arrow direction="down" />
            </a>
          </div>
        </section>

        <section
          aria-labelledby="ch-booking-title"
          className="ch-booking-section ch-stage"
          id="commonhour-picker"
          tabIndex={-1}
        >
          <DitherField />
          <h2 className="ch-sr" id="ch-booking-title">
            Try a booking
          </h2>
          <BookingWorkspace
            onChange={changeSelection}
            onInspect={setInspecting}
            selection={selection}
          />
        </section>

        <section
          aria-labelledby="ch-comparison-title"
          className="ch-comparison ch-shell"
          id="commonhour-zones"
        >
          <div className="ch-comparison-copy">
            <p className="ch-eyebrow">Time zones</p>
            <h2 id="ch-comparison-title">See the overlap.</h2>
            <p>
              Compare the studio’s working day with yours. Move the slider to
              read the same instant in three cities.
            </p>
            <a className="ch-text-button" href="#commonhour-picker">
              Back to the scheduler <Arrow />
            </a>
          </div>
          <OverlapTimeline
            city={city}
            day={day}
            minute={minute}
            onPreview={setPreview}
            selected={slot}
            zone={zone}
          />
        </section>

        <BookingLink selection={selection} />
        <CommonhourFaq />
      </main>
      <CommonhourFooter />
    </>
  );
}
