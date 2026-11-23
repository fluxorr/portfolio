"use client";

import {
  type CSSProperties,
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { downloadFile } from "@/lib/atelier/browser";
import {
  defaultParticipants,
  localClock,
  meetingCalendar,
  meetingStarts,
  meetingText,
  type Participant,
  quarter,
  spans,
  utcClock,
  workRibbon,
  zones,
} from "@/lib/atelier/meridian";
import "./study-common.css";
import "./meridian.css";

const defaultDate = "2026-11-23";
const tickMarks = [0, 12, 24, 36, 48, 60, 72, 84, 96];
const durations = [30, 45, 60];
function spanStyle(start: number, length: number) {
  return {
    "--span-start": `${(start / 96) * 100}%`,
    "--span-length": `${(length / 96) * 100}%`,
  } as CSSProperties;
}
function dayMarker(day: number) {
  return day ? `${(day > 0 ? "+" : "−") + Math.abs(day)} day` : "";
}

export function Meridian({
  initialDate = defaultDate,
  initialParticipants = defaultParticipants,
  onSelection,
}: {
  initialDate?: string;
  initialParticipants?: Participant[];
  onSelection?: (start: number, duration: number) => void;
}) {
  const [date, setDate] = useState(initialDate);
  const [participants, setParticipants] = useState(initialParticipants);
  const [duration, setDuration] = useState(30);
  const [slot, setSlot] = useState(56);
  const [search, setSearch] = useState("");
  const [newZone, setNewZone] = useState("");
  const [notice, setNotice] = useState("");
  const dragOffset = useRef(0);
  const scrollArea = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const start = Date.parse(date);
  const endSlot = slot + duration / 15;
  const activeTime = start + slot * quarter;
  const ribbons = useMemo(
    () =>
      participants.map((participant) => workRibbon(start, participant, date)),
    [date, participants, start],
  );
  const starts = meetingStarts(ribbons, duration);
  const available = starts.includes(slot);
  const conflicts = participants.filter(
    (_, index) => !ribbons[index].slice(slot, endSlot).every(Boolean),
  );
  const overlap = spans(
    Array.from(
      { length: 96 },
      (_, index) =>
        ribbons.length > 0 && ribbons.every((ribbon) => ribbon[index]),
    ),
  );
  const options = zones.filter(
    ({ zone, city }) =>
      !participants.some((participant) => participant.zone === zone) &&
      `${city} ${zone}`.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const details = meetingText(date, slot, duration, participants);

  useEffect(() => {
    const scroller = scrollArea.current;
    const timeline = plate.current;
    if (!scroller || !timeline || scroller.scrollWidth <= scroller.clientWidth)
      return;
    const plot = timeline.getBoundingClientRect();
    const labels =
      plot.left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    const selection = labels + (plot.width * slot) / 96;
    const stop = labels + (plot.width * endSlot) / 96;
    if (
      selection < scroller.scrollLeft + labels + 12 ||
      stop > scroller.scrollLeft + scroller.clientWidth - 12
    ) {
      scroller.scrollLeft = selection - (scroller.clientWidth + labels) / 2;
    }
  }, [slot, endSlot]);

  function select(value: number, length = duration) {
    const next = Math.max(0, Math.min(96 - length / 15, Math.round(value)));
    setSlot(next);
    setNotice("");
    onSelection?.(start + next * quarter, length);
  }

  function scrub(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    select(
      ((event.clientX - rect.left - dragOffset.current) / rect.width) * 96,
    );
  }

  function nextWindow() {
    const next = starts.find((item) => item >= slot);
    if (next === undefined) {
      setNotice(`No matching window at or after this time on ${date} UTC.`);
      return;
    }
    select(next);
    setNotice("Selected the earliest matching window.");
  }

  function moveZone(index: number, direction: number) {
    setParticipants((previous) => {
      const next = previous.slice();
      [next[index], next[index + direction]] = [
        next[index + direction],
        next[index],
      ];
      return next;
    });
  }

  function addZone() {
    const zone = options.find((item) => item.zone === newZone) ?? options[0];
    if (!zone || participants.length >= 5) return;
    setParticipants([...participants, { ...zone, from: "09:00", to: "17:00" }]);
    setNewZone("");
    setSearch("");
  }

  async function copyMeeting() {
    try {
      await navigator.clipboard.writeText(details);
      setNotice("Meeting details copied");
    } catch {
      setNotice(
        "Clipboard unavailable. Use the calendar file or select the displayed times.",
      );
    }
  }

  return (
    <div className="meridian">
      <div className="meridian-mast">
        <span className="study-code">Meridian / shared hours</span>
        <div>
          <label>
            <span>Date · UTC</span>
            <input
              aria-label="Meeting date in UTC"
              type="date"
              min="2000-01-01"
              max="2099-12-31"
              value={date}
              onChange={(event) => {
                if (event.target.value && event.target.validity.valid) {
                  setDate(event.target.value);
                  setNotice("");
                }
              }}
            />
          </label>
          <label>
            <span>Length</span>
            <select
              aria-label="Meeting duration"
              value={duration}
              onChange={(event) => {
                const length = Number(event.target.value);
                setDuration(length);
                select(slot, length);
              }}
            >
              {durations.map((length) => (
                <option key={length} value={length}>
                  {length} min
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="meridian-heading">
        <h2>
          One moment, <em>many places.</em>
        </h2>
        <div data-conflict={!available} aria-live="polite">
          <p className="study-code">
            {available ? "All zones available" : "Time conflict"}
          </p>
          <p>
            {utcClock(slot)}–{utcClock(endSlot)} <span>UTC</span>
          </p>
        </div>
      </div>
      <details className="meridian-edit">
        <summary>
          Edit zones and work hours <span>{participants.length} / 5</span>
        </summary>
        <div className="meridian-zone-list">
          {participants.map((participant, index) => (
            <div className="meridian-zone-editor" key={participant.zone}>
              <div>
                <strong>{participant.city}</strong>
                <small>{participant.zone}</small>
              </div>
              <div className="meridian-hours">
                {(["from", "to"] as const).map((key) => (
                  <label key={key}>
                    <span>{key === "from" ? "From" : "To"}</span>
                    <input
                      type="time"
                      aria-label={`${participant.city} ${key}`}
                      step="900"
                      value={participant[key]}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value && event.target.validity.valid)
                          setParticipants((previous) =>
                            previous.map((item) =>
                              item.zone === participant.zone
                                ? { ...item, [key]: value }
                                : item,
                            ),
                          );
                      }}
                    />
                  </label>
                ))}
              </div>
              <div className="meridian-zone-actions">
                <button
                  type="button"
                  aria-label={`Move ${participant.city} up`}
                  disabled={index === 0}
                  onClick={() => moveZone(index, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Move ${participant.city} down`}
                  disabled={index === participants.length - 1}
                  onClick={() => moveZone(index, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${participant.city}`}
                  disabled={participants.length <= 2}
                  onClick={() =>
                    setParticipants(
                      participants.filter(
                        (item) => item.zone !== participant.zone,
                      ),
                    )
                  }
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          {participants.length < 5 && (
            <div className="meridian-add">
              <label>
                <span className="study-sr">Search supported zones</span>
                <input
                  type="search"
                  placeholder="Filter cities"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setNewZone("");
                  }}
                />
              </label>
              <label>
                <span className="study-sr">Zone to add</span>
                <select
                  value={newZone || options[0]?.zone || ""}
                  disabled={!options.length}
                  onChange={(event) => setNewZone(event.target.value)}
                >
                  {!options.length && (
                    <option value="">No matching zones</option>
                  )}
                  {options.map(({ city, zone }) => (
                    <option key={zone} value={zone}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={!options.length}
                onClick={addZone}
              >
                Add zone +
              </button>
            </div>
          )}
          <p className="meridian-small">
            Hours use 15-minute increments. An end before the start runs
            overnight. Matching times mean closed. Repeated clock hours count
            twice on the UTC ruler.
          </p>
        </div>
      </details>
      <div className="meridian-scroll" ref={scrollArea}>
        <div className="meridian-chart">
          <div className="meridian-labels">
            <span className="study-code">UTC ruler</span>
            {participants.map(({ zone, city }) => (
              <div key={zone}>
                <strong>{city}</strong>
                <small>{localClock(activeTime, zone, date).offset}</small>
              </div>
            ))}
            <span className="study-code">Overlap</span>
          </div>
          <div
            className="meridian-plate"
            ref={plate}
            data-conflict={!available}
            style={spanStyle(slot, duration / 15)}
            onPointerDown={(event) => {
              if (event.button !== 0 || !event.isPrimary) return;
              const aperture =
                event.target instanceof Element &&
                event.target.closest(".meridian-aperture");
              if (event.pointerType === "touch" && !aperture) return;
              dragOffset.current = aperture
                ? event.clientX - aperture.getBoundingClientRect().left
                : 0;
              event.currentTarget.setPointerCapture(event.pointerId);
              scrub(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                scrub(event);
            }}
          >
            <div className="meridian-ticks">
              {tickMarks.map((tick) => (
                <span key={tick}>{utcClock(tick).slice(0, 2)}</span>
              ))}
            </div>
            {participants.map(({ zone }, index) => (
              <div className="meridian-ribbon" data-index={index} key={zone}>
                {spans(ribbons[index]).map(({ start, length }) => (
                  <i key={start} style={spanStyle(start, length)} />
                ))}
                {[0, 24, 48, 72].map((tick) => {
                  const clock = localClock(start + quarter * tick, zone, date);
                  return (
                    <span key={tick} style={{ left: `${(tick / 96) * 100}%` }}>
                      {clock.clock} {dayMarker(clock.day)}
                    </span>
                  );
                })}
              </div>
            ))}
            <div className="meridian-overlap">
              {overlap.map(({ start, length }) => (
                <i key={start} style={spanStyle(start, length)} />
              ))}
            </div>
            <div className="meridian-aperture" aria-hidden="true">
              <b />
            </div>
          </div>
        </div>
      </div>
      <div className="meridian-scrubber">
        <button
          type="button"
          onClick={() => select(slot - 1)}
          disabled={slot === 0}
        >
          ← Earlier
        </button>
        <input
          type="range"
          aria-label="Meeting start in UTC"
          aria-valuetext={`${utcClock(slot)} UTC`}
          min="0"
          max={96 - duration / 15}
          value={slot}
          onChange={(event) => select(event.currentTarget.valueAsNumber)}
        />
        <button
          type="button"
          onClick={() => select(slot + 1)}
          disabled={endSlot === 96}
        >
          Later →
        </button>
      </div>
      <div className="meridian-selection">
        <div className="meridian-check">
          <p className="study-code">
            {starts.length
              ? `${starts.length} valid start times`
              : `No common ${duration}-minute interval`}
          </p>
          <p>
            {available
              ? "The whole meeting fits each zone’s work hours."
              : starts.length
                ? "Outside work hours for " +
                  conflicts.map(({ city }) => city).join(", ") +
                  "."
                : "Adjust working hours or meeting length to look for an overlap."}
          </p>
        </div>
        <dl className="meridian-times">
          {participants.map(({ zone, city }) => {
            const a = localClock(activeTime, zone, date);
            const b = localClock(activeTime + duration * 60_000, zone, date);
            return (
              <div
                key={zone}
                data-conflict={conflicts.some((item) => item.zone === zone)}
              >
                <dt>{city}</dt>
                <dd>
                  {a.clock}–{b.clock}
                  <small>
                    {dayMarker(a.day) || dayMarker(b.day)
                      ? [
                          dayMarker(a.day) || "Same day",
                          dayMarker(b.day) || "Same day",
                        ]
                          .filter(
                            (value, index, list) =>
                              index === 0 || value !== list[0],
                          )
                          .join(" → ")
                      : a.offset === b.offset
                        ? a.offset
                        : `${a.offset} → ${b.offset}`}
                  </small>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
      <div className="meridian-foot">
        <button type="button" onClick={nextWindow}>
          Find next overlap ↗
        </button>
        <div>
          <button type="button" onClick={() => void copyMeeting()}>
            Copy details
          </button>
          <button
            type="button"
            onClick={() => {
              downloadFile(
                meetingCalendar(
                  activeTime,
                  duration,
                  details,
                  `${crypto.randomUUID()}@byflux.me`,
                  Date.now(),
                ),
                "text/calendar;charset=utf-8",
                "meridian-meeting.ics",
              );
              setNotice("Calendar file downloaded");
            }}
          >
            Download .ics
          </button>
        </div>
        <output>{notice}</output>
      </div>
    </div>
  );
}
