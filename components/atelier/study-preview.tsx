"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { presets } from "@/lib/atelier/geometry";
import { defaultParticipants, spans, workRibbon } from "@/lib/atelier/meridian";
import { defaultRouting, routingPolicy } from "@/lib/atelier/routing";
import type { StudySlug } from "@/lib/atelier/studies";
import { demoForecast } from "@/lib/atelier/weather";
import { Mark, RoutePlate, WeatherField } from "./visuals";

const date = "2026-11-23";
const previewRibbons = defaultParticipants.map((item) =>
  spans(workRibbon(Date.parse(date), item, date)),
);
const route = routingPolicy(defaultRouting);

export function StudyPreview({ slug }: { slug: StudySlug }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.36 });
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (visible) setRevealed(true);
  }, [visible]);
  return (
    <div
      className="atelier-preview"
      data-study={slug}
      ref={ref}
      data-revealed={revealed}
      data-visible={visible}
      aria-hidden="true"
    >
      {slug === "palimpsest" && (
        <>
          <div className="atelier-preview-caption study-code">
            <span>Archive / object 014</span>
            <span>Origin · Revisions · Custody</span>
          </div>
          {/* biome-ignore lint/performance/noImgElement: The custom engraving is a responsive native vector. */}
          <img
            src="/studies/asterion.svg"
            alt=""
            width="780"
            height="565"
            loading="lazy"
          />
          <p className="atelier-archive-name">
            The Asterion
            <br />
            Register
          </p>
          <span className="atelier-preview-pin" />
        </>
      )}
      {slug === "isobar" && (
        <>
          <div className="atelier-weather-head">
            <div className="study-code">
              Berlin · 24 h<br />
              Sample forecast
            </div>
            <strong>
              {demoForecast.hours[9].temperature}
              <span>°C</span>
            </strong>
          </div>
          <div className="atelier-weather-sheet">
            <WeatherField
              hours={demoForecast.hours}
              metric="temperature"
              count={24}
              selected={9}
            />
          </div>
          <div className="atelier-weather-axis study-code">
            <span>08:00</span>
            <span>16:00</span>
            <span>00:00</span>
            <span>07:00</span>
          </div>
        </>
      )}
      {slug === "switchyard" && (
        <>
          <div className="atelier-preview-caption study-code">
            <span>Policy / Research</span>
            <span>Bias 50</span>
          </div>
          <div className="atelier-route-tray">
            <RoutePlate policy={route} />
          </div>
          <span className="atelier-route-puck" />
        </>
      )}
      {slug === "figure-zero" && (
        <>
          <div className="atelier-preview-caption study-code">
            <span>Construction plate</span>
            <span>Orbit / Signal</span>
          </div>
          <div className="atelier-symbol-tray">
            <svg viewBox="-145 -145 290 290" aria-hidden="true">
              <g className="atelier-figure-guides">
                <path d="M-143 0h286M0-143v286M-110-110l220 220m0-220-220 220" />
                <circle r="111" />
                <circle r="62" />
              </g>
              <g className="atelier-figure-mark">
                <Mark shape={presets.Orbit[0].shape} />
              </g>
              <g className="atelier-figure-nodes">
                <circle cx="82" cy="-74" r="4" />
                <circle cx="-99" cy="50" r="4" />
              </g>
            </svg>
            <div className="atelier-press-variants">
              {(["Fold", "Bloom"] as const).map((family) => (
                <div key={family}>
                  <svg aria-hidden="true" viewBox="-130 -130 260 260">
                    <Mark shape={presets[family][0].shape} />
                  </svg>
                  <span className="study-code">{family}</span>
                </div>
              ))}
            </div>
            <span className="study-code">
              R 100
              <br />θ −42°
            </span>
          </div>
        </>
      )}
      {slug === "meridian" && (
        <>
          <div className="atelier-preview-caption study-code">
            <span>Shared hours / UTC</span>
            <span>14:00 · All zones available</span>
          </div>
          <div className="atelier-time-poster">
            <div className="atelier-time-labels">
              {defaultParticipants.map(({ city }) => (
                <span key={city}>{city}</span>
              ))}
            </div>
            <div className="atelier-time-preview">
              {previewRibbons.map((ribbon, index) => (
                <div key={defaultParticipants[index].city}>
                  {ribbon.map(({ start, length }) => (
                    <i
                      key={start}
                      style={{
                        left: `${(start / 96) * 100}%`,
                        width: `${(length / 96) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              ))}
              <b />
            </div>
          </div>
          <div className="atelier-time-dial">
            <span>14</span>
            <small>UTC</small>
          </div>
        </>
      )}
    </div>
  );
}
