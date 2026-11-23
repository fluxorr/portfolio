"use client";

import { type CSSProperties, memo, useRef, useState } from "react";
import { Arrow, Check } from "@/components/portfolio/links";
import {
  type BookingSelection,
  calendarFile,
  type Day,
  dateLabel,
  days,
  duration,
  hostZone,
  month,
  sharedWindow,
  timeLabel,
  workWindow,
  zones,
} from "@/lib/commonhour";
import { RollingTime } from "./rolling-time";

export const BookingWorkspace = memo(function BookingWorkspace({
  selection,
  onChange,
  onInspect,
}: {
  selection: BookingSelection;
  onChange: (selection: BookingSelection) => void;
  onInspect: (minute: number | null) => void;
}) {
  const { day, zone, slot } = selection;
  const [confirmedAt, setConfirmedAt] = useState<Date | null>(null);
  const [sharedOnly, setSharedOnly] = useState(false);
  const receipt = useRef<HTMLHeadingElement>(null);
  const selectedButton = useRef<HTMLButtonElement>(null);
  const city = zones.find((option) => option.id === zone)?.city ?? "New York";
  const overlap = sharedWindow(
    workWindow(day, hostZone),
    workWindow(day, zone),
  );
  const isShared = (time: number) =>
    time >= overlap.start && time + duration <= overlap.end;
  const times = sharedOnly ? day.slots.filter(isShared) : day.slots;
  const nextDay = days
    .slice(days.indexOf(day) + 1)
    .find((option) => option.slots.length);
  const confirmed = confirmedAt !== null && slot !== null;

  function chooseDay(option: Day) {
    if (option === day) return;
    const band = sharedWindow(
      workWindow(option, hostZone),
      workWindow(option, zone),
    );
    const first = sharedOnly
      ? option.slots.find(
          (time) => time >= band.start && time + duration <= band.end,
        )
      : option.slots[0];
    onChange({ day: option, zone, slot: first ?? null });
  }

  return (
    <div className="ch-booking" data-confirmed={confirmed}>
      <div className="ch-booking-top">
        <span>
          Commonhour <i>/</i> Fieldwork Studio
        </span>
        <span className="ch-sample">
          <i /> Sample availability
        </span>
      </div>
      <div className="ch-booking-grid">
        <div className="ch-meeting">
          <div aria-hidden="true" className="ch-meeting-mark">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p>Fieldwork Studio</p>
            <h3>Project intro</h3>
            <p>A first conversation about the project you have in mind.</p>
          </div>
          <dl>
            <div>
              <dt>Duration</dt>
              <dd>{duration} min</dd>
            </div>
            <div>
              <dt>Studio time zone</dt>
              <dd>London</dd>
            </div>
          </dl>
        </div>

        <fieldset
          aria-label="Booking options"
          className="ch-picker"
          disabled={confirmed}
        >
          <div className="ch-picker-head">
            <h3>{month}</h3>
            <div className="ch-zone">
              <label htmlFor="ch-zone">Your time zone</label>
              <select
                id="ch-zone"
                onChange={(event) => {
                  const match = zones.find(
                    (option) => option.id === event.currentTarget.value,
                  );
                  if (match) onChange({ ...selection, zone: match.id });
                }}
                value={zone}
              >
                {zones.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <fieldset className="ch-date-field">
            <legend className="ch-sr">Choose a date</legend>
            <div
              className="ch-dates"
              style={{ "--ch-day": days.indexOf(day) } as CSSProperties}
            >
              {days.map((option) => (
                <button
                  aria-label={`${option.short} ${option.date} April, ${option.slots.length} openings`}
                  aria-pressed={day === option}
                  key={option.date}
                  onClick={() => chooseDay(option)}
                  type="button"
                >
                  <span>{option.short} </span>
                  <strong>{option.date}</strong>
                  <i aria-hidden="true" data-open={option.slots.length > 0} />
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="ch-time-field">
            <legend className="ch-sr">Available times in {city}</legend>
            <div className="ch-time-head">
              <span>
                Available times <small>· {city}</small>
              </span>
              {day.slots.length > 0 && (
                <button
                  aria-checked={sharedOnly}
                  className="ch-filter"
                  onClick={() => {
                    setSharedOnly(!sharedOnly);
                    onInspect(null);
                  }}
                  role="switch"
                  type="button"
                >
                  <i aria-hidden="true" /> Shared only
                </button>
              )}
            </div>
            {times.length > 0 ? (
              <div className="ch-times" key={day.date}>
                {times.map((time) => {
                  const within = isShared(time);
                  return (
                    <button
                      aria-label={`${timeLabel(day, time, zone)}${within ? ", shared working hours" : ""}`}
                      aria-pressed={time === slot}
                      data-shared={within}
                      key={time}
                      onBlur={() => onInspect(null)}
                      onClick={() => onChange({ ...selection, slot: time })}
                      onFocus={() => onInspect(time)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") onInspect(time);
                      }}
                      onPointerLeave={() => onInspect(null)}
                      ref={time === slot ? selectedButton : undefined}
                      type="button"
                    >
                      <i aria-hidden="true" />{" "}
                      <RollingTime value={timeLabel(day, time, zone)} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="ch-empty">
                <p>
                  {day.slots.length
                    ? "No openings within both working days."
                    : `No openings for ${day.label}.`}
                </p>
                {day.slots.length ? (
                  <button
                    className="ch-text-button"
                    onClick={() => setSharedOnly(false)}
                    type="button"
                  >
                    Show all times <Arrow />
                  </button>
                ) : nextDay ? (
                  <button
                    className="ch-text-button"
                    onClick={() => {
                      chooseDay(nextDay);
                      requestAnimationFrame(() =>
                        selectedButton.current?.focus(),
                      );
                    }}
                    type="button"
                  >
                    See {nextDay.label} <Arrow />
                  </button>
                ) : null}
              </div>
            )}
            {times.length > 0 && (
              <p className="ch-shared-key">
                <i /> Within both working days
              </p>
            )}
          </fieldset>
        </fieldset>

        <aside aria-label="Booking summary" className="ch-review">
          {confirmed && slot !== null ? (
            <div className="ch-review-content ch-receipt" key="receipt">
              <div aria-hidden="true" className="ch-confirm-mark">
                <Check />
              </div>
              <h3 ref={receipt} tabIndex={-1}>
                Demo booking confirmed.
              </h3>
              <p>
                {dateLabel(day, slot, zone)} · {timeLabel(day, slot, zone)} in{" "}
                {city}
              </p>
              <p className="ch-receipt-local">
                {timeLabel(day, slot, hostZone)} in London · {duration} min
              </p>
              <a
                className="ch-button ch-primary"
                download="commonhour-project-intro.ics"
                href={`data:text/calendar;charset=utf-8,${encodeURIComponent(calendarFile(day, slot, confirmedAt))}`}
              >
                Download calendar file <Arrow direction="down" />
              </a>
              <button
                className="ch-text-button"
                onClick={() => {
                  setConfirmedAt(null);
                  if (!times.includes(slot)) setSharedOnly(false);
                  requestAnimationFrame(() => selectedButton.current?.focus());
                }}
                type="button"
              >
                Change time
              </button>
            </div>
          ) : (
            <div className="ch-review-content" key="review">
              <p className="ch-eyebrow">Your selection</p>
              {slot !== null ? (
                <div aria-live="polite" className="ch-review-reading">
                  <h3>
                    <RollingTime value={timeLabel(day, slot, zone)} />{" "}
                    <span className="ch-review-end">
                      –{" "}
                      <RollingTime
                        value={timeLabel(day, slot + duration, zone)}
                      />
                    </span>
                  </h3>
                  <p>
                    {dateLabel(day, slot, zone)} · {city}
                  </p>
                  <p className="ch-receipt-local">
                    <RollingTime value={timeLabel(day, slot, hostZone)} /> in
                    London
                  </p>
                  {sharedOnly && !isShared(slot) && (
                    <p className="ch-selection-note">
                      Selected time is outside shared hours.
                    </p>
                  )}
                </div>
              ) : (
                <div className="ch-review-reading">
                  <h3>Choose an opening.</h3>
                  <p>Pick a date with available times.</p>
                </div>
              )}
              <button
                className="ch-button ch-primary"
                disabled={slot === null}
                onClick={() => {
                  onChange(selection);
                  setConfirmedAt(new Date());
                  requestAnimationFrame(() => receipt.current?.focus());
                }}
                type="button"
              >
                Confirm demo booking <Arrow />
              </button>
              <p className="ch-booking-note">
                The calendar file is created on this device.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
});
