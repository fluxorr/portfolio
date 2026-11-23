import type { CSSProperties } from "react";
import {
  type Day,
  dateLabel,
  hostZone,
  sharedWindow,
  type TimeWindow,
  timeLabel,
  workWindow,
  type Zone,
  zones,
} from "@/lib/commonhour";
import { RollingTime } from "./rolling-time";

const guideHours = ["00", "06", "12", "18", "24"];
const displayCities = [zones[1], zones[0], zones[2]];

function bandStyle(window: TimeWindow) {
  return {
    "--ch-start": `${window.start / 14.4}%`,
    "--ch-width": (window.end - window.start) / 1440,
  } as CSSProperties;
}

export function OverlapTimeline({
  day,
  minute,
  zone,
  city,
  onPreview,
  selected,
}: {
  day: Day;
  minute: number;
  zone: Zone;
  city: string;
  onPreview: (minute: number | null) => void;
  selected: number | null;
}) {
  const host = workWindow(day, hostZone);
  const guest = workWindow(day, zone);
  const shared = sharedWindow(host, guest);
  const inside = minute >= shared.start && minute < shared.end;

  return (
    <div className="ch-overlap">
      <div className="ch-overlap-head">
        <span>Working hours</span>
        <span>
          {shared.end > shared.start
            ? `${timeLabel(day, shared.start, "UTC")}–${timeLabel(day, shared.end, "UTC")} UTC overlap`
            : "No overlap"}
        </span>
      </div>
      <div className="ch-chart">
        <div className="ch-chart-labels" aria-hidden="true">
          <span>Studio · London</span>
          <span>Guest · {city}</span>
        </div>
        <div
          aria-hidden="true"
          className="ch-chart-track"
          style={{ "--ch-preview": `${minute / 14.4}%` } as CSSProperties}
        >
          <div className="ch-chart-axis">
            {guideHours.map((hour) => (
              <span key={hour}>{hour}</span>
            ))}
          </div>
          <div className="ch-chart-rows">
            <div>
              <i style={bandStyle(host)} />
            </div>
            <div>
              <i style={bandStyle(guest)} />
            </div>
            {shared.end > shared.start && (
              <span className="ch-shared-band" style={bandStyle(shared)} />
            )}
            <span className="ch-chart-marker" />
          </div>
        </div>
      </div>
      <div
        className="ch-time-slider"
        style={{ "--ch-preview": `${minute / 14.35}%` } as CSSProperties}
      >
        <label htmlFor="ch-preview-time">Preview time</label>
        <input
          aria-valuetext={`${timeLabel(day, minute, "UTC")} UTC, ${timeLabel(day, minute, zone)} in ${city}, ${inside ? "inside" : "outside"} shared hours`}
          id="ch-preview-time"
          max="1435"
          min="0"
          onChange={(event) => onPreview(Number(event.currentTarget.value))}
          step="5"
          type="range"
          value={minute}
        />
        <span aria-hidden="true">
          <RollingTime value={timeLabel(day, minute, "UTC")} />
        </span>
      </div>
      <div className="ch-chart-actions">
        <span>
          <i /> Shared hours
        </span>
        <div>
          {shared.end > shared.start && (
            <button
              onClick={() =>
                onPreview(Math.round((shared.start + shared.end) / 10) * 5)
              }
              type="button"
            >
              Jump to overlap
            </button>
          )}
          {selected !== null && (
            <button
              disabled={selected === minute}
              onClick={() => onPreview(null)}
              type="button"
            >
              Use selected time
            </button>
          )}
        </div>
      </div>
      <dl className="ch-city-strip">
        {displayCities.map((option) => (
          <div data-current={option.id === zone} key={option.id}>
            <dt>
              {option.city} <span>{option.code}</span>
            </dt>
            <dd className="ch-city-time">
              <RollingTime value={timeLabel(day, minute, option.id)} />
            </dd>
            <dd className="ch-city-date">
              {dateLabel(day, minute, option.id)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
