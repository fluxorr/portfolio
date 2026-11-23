export const quarter = 15 * 60_000;
export const utcDayLength = quarter * 96;
export const zones = [
  { city: "Pune", zone: "Asia/Kolkata" },
  { city: "London", zone: "Europe/London" },
  { city: "New York", zone: "America/New_York" },
  { city: "Berlin", zone: "Europe/Berlin" },
  { city: "São Paulo", zone: "America/Sao_Paulo" },
  { city: "Los Angeles", zone: "America/Los_Angeles" },
  { city: "Toronto", zone: "America/Toronto" },
  { city: "Dubai", zone: "Asia/Dubai" },
  { city: "Nairobi", zone: "Africa/Nairobi" },
  { city: "Singapore", zone: "Asia/Singapore" },
  { city: "Tokyo", zone: "Asia/Tokyo" },
  { city: "Sydney", zone: "Australia/Sydney" },
  { city: "Auckland", zone: "Pacific/Auckland" },
  { city: "Kathmandu", zone: "Asia/Kathmandu" },
  { city: "Honolulu", zone: "Pacific/Honolulu" },
];
export type Participant = (typeof zones)[number] & { from: string; to: string };
export const defaultParticipants = zones.slice(0, 3).map((zone, index) => ({
  ...zone,
  from: "09:00",
  to: index === 0 ? "21:00" : "17:00",
}));
const localFormats = new Map<string, Intl.DateTimeFormat>();
function formatLocal(zone: string) {
  let formatter = localFormats.get(zone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZoneName: "shortOffset",
    });
    localFormats.set(zone, formatter);
  }
  return formatter;
}
const pad = (number: number) => String(number).padStart(2, "0");
export function utcClock(slot: number) {
  return `${pad(Math.floor(slot / 4))}:${pad((slot % 4) * 15)}`;
}
export function localClock(
  instant: number,
  zone: string,
  referenceDate: string,
) {
  const parts = Object.fromEntries(
    formatLocal(zone)
      .formatToParts(instant)
      .map(({ type, value }) => [type, value]),
  );
  const date = [parts.year, parts.month, parts.day].join("-");
  const day = Math.round(
    (Date.parse(date) - Date.parse(referenceDate)) / utcDayLength,
  );
  return {
    date,
    day,
    clock: `${parts.hour}:${parts.minute}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    offset: parts.timeZoneName.replace("GMT", "UTC"),
  };
}
function minutes(clock: string) {
  const [hours, mins] = clock.split(":").map(Number);
  return hours * 60 + mins;
}
export function workRibbon(
  start: number,
  participant: Participant,
  date: string,
) {
  const from = minutes(participant.from);
  const to = minutes(participant.to);
  // Applying wall-clock hours to each real instant retains both repeated hours in autumn.
  // Skipped spring hours have no real instants, including for overnight work intervals.
  return Array.from({ length: 96 }, (_, index) => {
    const time = localClock(
      start + index * quarter,
      participant.zone,
      date,
    ).minutes;
    return from < to
      ? time >= from && time < to
      : from > to && (time >= from || time < to);
  });
}
export function meetingStarts(ribbons: boolean[][], duration: number) {
  const slots = duration / 15;
  return Array.from({ length: 97 - slots }, (_, index) => index).filter(
    (index) =>
      ribbons.length > 0 &&
      ribbons.every((ribbon) =>
        ribbon.slice(index, index + slots).every(Boolean),
      ),
  );
}
export function spans(values: boolean[]) {
  const result: { start: number; length: number }[] = [];
  let start = -1;
  values.forEach((value, index) => {
    if (value && start < 0) start = index;
    if (!value && start >= 0) {
      result.push({ start, length: index - start });
      start = -1;
    }
  });
  if (start >= 0) result.push({ start, length: values.length - start });
  return result;
}
export function meetingText(
  date: string,
  slot: number,
  duration: number,
  participants: Participant[],
) {
  const start = Date.parse(date) + slot * quarter;
  const end = start + duration * 60_000;
  return [
    "Meridian meeting",
    date +
      " · " +
      utcClock(slot) +
      "–" +
      utcClock(slot + duration / 15) +
      " UTC",
    ...participants.map(({ city, zone }) => {
      const a = localClock(start, zone, date);
      const b = localClock(end, zone, date);
      return (
        city +
        ": " +
        a.date +
        " " +
        a.clock +
        " " +
        a.offset +
        " → " +
        b.date +
        " " +
        b.clock +
        " " +
        b.offset
      );
    }),
  ].join("\n");
}
const calendarStamp = (instant: number) =>
  new Date(instant).toISOString().replace(/[:-]|\.\d{3}/g, "");
const escapeICS = (value: string) =>
  value
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
function foldLine(line: string) {
  const encoder = new TextEncoder();
  let bytes = 0;
  let result = "";
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) {
      result += "\r\n ";
      bytes = 1;
    }
    result += char;
    bytes += size;
  }
  return result;
}
export function meetingCalendar(
  start: number,
  duration: number,
  description: string,
  uid: string,
  now: number,
) {
  return `${[
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//byflux//Meridian//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${calendarStamp(now)}`,
    `DTSTART:${calendarStamp(start)}`,
    `DTEND:${calendarStamp(start + duration * 60_000)}`,
    "SUMMARY:Meridian meeting",
    `DESCRIPTION:${escapeICS(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(foldLine)
    .join("\r\n")}\r\n`;
}
