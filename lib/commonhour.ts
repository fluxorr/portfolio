export const commonhourPath = "/showcase/commonhour";
export const commonhourImage = "/showcase/commonhour-cover.webp";
export const duration = 25;
export const month = "April 2027";
export const hostZone = "Europe/London";

export const zones = [
  { id: "America/New_York", city: "New York", code: "NYC" },
  { id: "Europe/London", city: "London", code: "LON" },
  { id: "Asia/Kolkata", city: "Bengaluru", code: "BLR" },
  { id: "UTC", city: "Universal time", code: "UTC" },
] as const;

export type Zone = (typeof zones)[number]["id"];

export const days = [
  { date: 12, short: "Mon", label: "Monday", slots: [570, 780, 840, 915] },
  { date: 13, short: "Tue", label: "Tuesday", slots: [570, 780, 870, 930] },
  { date: 14, short: "Wed", label: "Wednesday", slots: [] },
  { date: 15, short: "Thu", label: "Thursday", slots: [600, 810, 900, 930] },
  { date: 16, short: "Fri", label: "Friday", slots: [540, 780, 870, 915] },
];

export type Day = (typeof days)[number];
export type TimeWindow = { start: number; end: number };
export const initialDay = days[1];
export const initialMinute = 870;

export type BookingSelection = { day: Day; slot: number | null; zone: Zone };
export const initialSelection: BookingSelection = {
  day: initialDay,
  slot: initialMinute,
  zone: zones[0].id,
};

export function bookingFromQuery(
  query: URLSearchParams,
): BookingSelection | undefined {
  const day = days.find((item) => String(item.date) === query.get("date"));
  const zone = zones.find((item) => item.id === query.get("zone"));
  const slot = day?.slots.find((item) => String(item) === query.get("time"));
  if (!day || !zone || slot === undefined) return;
  return { day, slot, zone: zone.id };
}

export function bookingQuery(selection: BookingSelection) {
  const query = new URLSearchParams({
    date: String(selection.day.date),
    zone: selection.zone,
    time: String(selection.slot),
  });
  return `?${query.toString()}#commonhour-picker`;
}

const timeFormats = Object.fromEntries(
  zones.map(({ id }) => [
    id,
    new Intl.DateTimeFormat("en-GB", {
      timeZone: id,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }),
  ]),
) as Record<Zone, Intl.DateTimeFormat>;

const dateFormats = Object.fromEntries(
  zones.map(({ id }) => [
    id,
    new Intl.DateTimeFormat("en-GB", {
      timeZone: id,
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
  ]),
) as Record<Zone, Intl.DateTimeFormat>;

export function instant(day: Day, minute: number) {
  return new Date(Date.UTC(2027, 3, day.date, 0, minute));
}

export function timeLabel(day: Day, minute: number, zone: Zone) {
  return timeFormats[zone].format(instant(day, minute));
}

export function dateLabel(day: Day, minute: number, zone: Zone) {
  return dateFormats[zone].format(instant(day, minute));
}

export function workWindow(day: Day, zone: Zone): TimeWindow {
  const [hour, minute] = timeLabel(day, 720, zone).split(":").map(Number);
  const offset = hour * 60 + minute - 720;
  return { start: 540 - offset, end: 1020 - offset };
}

export function sharedWindow(host: TimeWindow, guest: TimeWindow): TimeWindow {
  return {
    start: Math.max(host.start, guest.start),
    end: Math.min(host.end, guest.end),
  };
}

export function calendarFile(day: Day, minute: number, created: Date) {
  const stamp = (time: Date) =>
    time
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const start = stamp(instant(day, minute));
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//byflux//Commonhour demo//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:commonhour-${start}@byflux.me`,
    `DTSTAMP:${stamp(created)}`,
    `DTSTART:${start}`,
    `DTEND:${stamp(instant(day, minute + duration))}`,
    "SUMMARY:Fieldwork Studio - Project intro",
    "DESCRIPTION:Sample booking made with the Commonhour demo.",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
