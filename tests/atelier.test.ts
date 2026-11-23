import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  constrain,
  defaultShape,
  geometry,
  presets,
  symbolSVG,
} from "../lib/atelier/geometry";
import {
  defaultParticipants,
  localClock,
  meetingCalendar,
  meetingStarts,
  quarter,
  workRibbon,
} from "../lib/atelier/meridian";
import { sampleRecord } from "../lib/atelier/provenance";
import { defaultRouting, routingPolicy, tasks } from "../lib/atelier/routing";
import {
  bestWeatherWindow,
  demoForecast,
  parseForecast,
  weatherValue,
} from "../lib/atelier/weather";

test("Palimpsest records the digest of its actual source asset", () => {
  const bytes = readFileSync(
    new URL("../public/studies/tidal-index.svg", import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    sampleRecord.stages[0].hash,
  );
  assert.equal(sampleRecord.sample, true);
  assert.equal(sampleRecord.stages[2].status, "Unconfirmed");
});

test("Isobar ranks consecutive hours with transparent criteria", () => {
  const start = 1_800_000_000;
  const hour = (
    index: number,
    temperature: number,
    rain: number,
    wind: number,
  ) => ({ time: start + index * 3600, temperature, rain, wind, code: 3 });
  const input = [
    hour(0, 30, 4, 22),
    hour(1, 34, 8, 20),
    hour(2, 20, 90, 4),
    hour(3, 20, 90, 3),
    hour(5, 23, 6, 6),
  ];
  assert.deepEqual(bestWeatherWindow(input, "Dry"), { index: 0, score: 8 });
  assert.deepEqual(bestWeatherWindow(input, "Mild"), { index: 2, score: 0 });
  assert.deepEqual(bestWeatherWindow(input, "Low wind"), {
    index: 2,
    score: 4,
  });
  assert.equal(bestWeatherWindow([input[3], input[4]], "Dry"), null);
  assert.deepEqual(weatherValue("temperature", 20, true), {
    value: 68,
    unit: "°F",
  });
  assert.deepEqual(weatherValue("wind", 32.18688, true), {
    value: 20,
    unit: "mph",
  });
});

test("Isobar keeps 48 distinct physical hours through a repeated local hour", () => {
  const start = Date.UTC(2026, 9, 25, 0, 0) / 1000;
  const data = {
    timezone: "Europe/Berlin",
    hourly: {
      time: Array.from({ length: 48 }, (_, index) => start + index * 3600),
      temperature_2m: Array(48).fill(4),
      precipitation_probability: Array(48).fill(10),
      wind_speed_10m: Array(48).fill(13),
      weather_code: Array(48).fill(1),
    },
  };
  const forecast = parseForecast(demoForecast.city, data, 1700);
  assert.equal(forecast.source, "live");
  assert.equal(forecast.hours.length, 48);
  assert.equal(forecast.hours[1].time - forecast.hours[0].time, 3600);
  assert.throws(
    () =>
      parseForecast(
        demoForecast.city,
        { ...data, hourly: { ...data.hourly, temperature_2m: [] } },
        1700,
      ),
    /Incomplete forecast/,
  );
});

test("Switchyard allocations total 100 for every supported policy combination", () => {
  for (const task of Object.keys(tasks) as (keyof typeof tasks)[]) {
    for (const complexity of ["Compact", "Typical", "Heavy"] as const) {
      for (const verification of ["Off", "Standard", "Strict"] as const) {
        for (let strategy = 0; strategy <= 100; strategy += 5) {
          const policy = routingPolicy({
            task,
            complexity,
            strategy,
            verification,
          });
          assert.equal(
            policy.stages.reduce((total, stage) => total + stage.weight, 0),
            100,
          );
          assert.equal(policy.stages[3].weight === 0, verification === "Off");
          assert.equal(policy.settings.strategy, strategy);
          assert.ok(policy.estimates.computeIndex > 0);
        }
      }
    }
  }
  assert.equal(
    routingPolicy({ ...defaultRouting, task: "classification", strategy: 5 })
      .stages[1].mode,
    "bypass",
  );
  assert.notDeepEqual(
    routingPolicy(defaultRouting),
    routingPolicy({ ...defaultRouting, strategy: 95 }),
  );
});

test("Figure / Zero families and nine presets produce distinct export geometry", () => {
  const variants = Object.values(presets)
    .flat()
    .map(({ shape }) => symbolSVG(shape));
  assert.equal(new Set(variants).size, 9);
  assert.ok(geometry(defaultShape).every(({ stroke }) => Number(stroke) > 0));
  assert.equal(constrain(defaultShape, "aperture", 1000).aperture, 125);
  for (const svg of variants) {
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.doesNotMatch(svg, /class=|<text|NaN|Infinity|\.webp/);
  }
});

test("Meridian aligns all zones on UTC and checks the complete duration", () => {
  const date = "2026-11-23";
  const start = Date.parse(date);
  const masks = defaultParticipants.map((p) => workRibbon(start, p, date));
  assert.deepEqual(meetingStarts(masks, 30), [56, 57, 58, 59, 60]);
  assert.deepEqual(meetingStarts(masks, 60), [56, 57, 58]);
  assert.equal(localClock(start, "America/New_York", date).day, -1);
  assert.equal(localClock(start + 95 * quarter, "Asia/Kolkata", date).day, 1);
  assert.deepEqual(meetingStarts([masks[0], Array(96).fill(false)], 30), []);
});

test("Meridian handles DST gaps, repeated hours, and overnight shifts", () => {
  const spring = "2026-03-08";
  const autumn = "2026-11-01";
  const zone = { city: "New York", zone: "America/New_York" };
  const missing = workRibbon(
    Date.parse(spring),
    { ...zone, from: "02:00", to: "03:00" },
    spring,
  );
  const repeated = workRibbon(
    Date.parse(autumn),
    { ...zone, from: "01:00", to: "02:00" },
    autumn,
  );
  assert.equal(missing.filter(Boolean).length, 0);
  assert.equal(repeated.filter(Boolean).length, 8);
  assert.notEqual(
    localClock(Date.parse(autumn) + 20 * quarter, zone.zone, autumn).offset,
    localClock(Date.parse(autumn) + 24 * quarter, zone.zone, autumn).offset,
  );
  const overnight = workRibbon(
    Date.parse(autumn),
    { city: "UTC", zone: "UTC", from: "22:00", to: "04:00" },
    autumn,
  );
  assert.equal(overnight.filter(Boolean).length, 24);
  assert.equal(overnight[0], true);
  assert.equal(overnight[39], false);
});

test("Meridian emits RFC-style UTC stamps and byte-folded calendar lines", () => {
  const start = Date.UTC(2026, 10, 23, 14, 0);
  const ics = meetingCalendar(
    start,
    45,
    "São Paulo; 東京, 11:00\n".repeat(8),
    "test@byflux.me",
    start,
  );
  assert.match(ics, /DTSTART:20261123T140000Z\r\nDTEND:20261123T144500Z/);
  assert.match(ics, /UID:test@byflux\.me/);
  assert.ok(ics.split("\r\n").every((line) => Buffer.byteLength(line) <= 75));
  assert.match(ics, /São Paulo\\; 東京\\, 11:00\\n/);
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
});
