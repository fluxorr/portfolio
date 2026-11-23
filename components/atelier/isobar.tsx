"use client";

import { type PointerEvent, useEffect, useId, useState } from "react";
import {
  bestWeatherWindow,
  type City,
  defaultCity,
  demoForecast,
  type Forecast,
  findCities,
  getForecast,
  hourLabel,
  type Metric,
  metrics,
  type Window,
  weatherLabel,
  weatherValue,
} from "@/lib/atelier/weather";
import { WeatherField } from "./visuals";
import "./study-common.css";
import "./isobar.css";

const recommendations = {
  Dry: "Lowest peak rain probability",
  Mild: "Closest to 20°C across both hours",
  "Low wind": "Lowest peak wind speed",
} as const;

function locationName(city: City) {
  return [
    city.name,
    city.admin1 === city.name ? undefined : city.admin1,
    city.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function Isobar({
  initialCity = defaultCity,
  initialForecast,
  onHourChange,
}: {
  initialCity?: City;
  initialForecast?: Forecast;
  onHourChange?: (hour: number) => void;
}) {
  const searchId = useId();
  const [request, setRequest] = useState<{
    city: City;
    revision: number;
  } | null>(initialForecast ? null : { city: initialCity, revision: 0 });
  const [forecast, setForecast] = useState<Forecast | undefined>(
    initialForecast,
  );
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    initialForecast ? "ready" : "loading",
  );
  const [search, setSearch] = useState("");
  const [searchState, setSearchState] = useState<
    "idle" | "loading" | "results" | "error"
  >("idle");
  const [results, setResults] = useState<City[]>([]);
  const [hour, setHour] = useState(0);
  const [metric, setMetric] = useState<Metric>("temperature");
  const [imperial, setImperial] = useState(false);
  const [condition, setCondition] = useState<Window>("Dry");
  const [recommendation, setRecommendation] = useState<string>();
  const selected = forecast?.hours[hour];
  const place = forecast?.city ?? request?.city ?? initialCity;
  const metricValue =
    selected && weatherValue(metric, selected[metric], imperial);
  const mobileStart = Math.floor(hour / 12) * 12;
  const range = metrics[metric];

  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    getForecast(
      request.city,
      AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
    )
      .then((data) => {
        if (!controller.signal.aborted) {
          setForecast(data);
          setHour(0);
          setRecommendation(undefined);
          setLoadState("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadState("error");
      });
    return () => controller.abort();
  }, [request]);

  useEffect(() => {
    const query = search.trim();
    if (query.length < 2) return;
    const controller = new AbortController();
    const pending = setTimeout(() => {
      findCities(
        query,
        AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]),
      )
        .then((cities) => {
          if (!controller.signal.aborted) {
            setResults(cities);
            setSearchState("results");
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) setSearchState("error");
        });
    }, 280);
    return () => {
      clearTimeout(pending);
      controller.abort();
    };
  }, [search]);

  function load(city: City) {
    setSearch("");
    setSearchState("idle");
    setLoadState("loading");
    setRequest((previous) => ({
      city,
      revision: (previous?.revision ?? 0) + 1,
    }));
  }

  function selectHour(index: number) {
    const time = forecast?.hours[index]?.time;
    if (time === undefined || hour === index) return;
    setHour(index);
    onHourChange?.(time);
  }

  function scrub(
    event: PointerEvent<HTMLDivElement>,
    start: number,
    count: number,
  ) {
    const rect = event.currentTarget.getBoundingClientRect();
    const column = Math.min(
      count - 1,
      Math.max(
        0,
        Math.floor(((event.clientX - rect.left) / rect.width) * count),
      ),
    );
    selectHour(start + column);
  }

  function recommend() {
    if (!forecast) return;
    const result = bestWeatherWindow(forecast.hours, condition);
    if (!result) {
      setRecommendation("No consecutive two-hour window in this forecast.");
      return;
    }
    const start = forecast.hours[result.index].time;
    const stop = forecast.hours[result.index + 1].time + 3600;
    selectHour(result.index);
    setRecommendation(
      hourLabel(start, forecast.zone, true) +
        " → " +
        hourLabel(stop, forecast.zone, true),
    );
  }

  return (
    <div className="isobar" data-metric={metric}>
      <div className="isobar-mast">
        <span className="study-code">
          Forecast office <span> / 48 h</span>
        </span>
        <div className="isobar-search">
          <label htmlFor={searchId}>Find a city</label>
          <div className="isobar-search-field">
            <input
              id={searchId}
              type="search"
              autoComplete="off"
              value={search}
              placeholder="Search cities"
              onChange={(event) => {
                setSearch(event.target.value);
                setSearchState(
                  event.target.value.trim().length >= 2 ? "loading" : "idle",
                );
                setResults([]);
              }}
            />
          </div>
          {searchState !== "idle" && (
            <div className="isobar-results">
              <output>
                {searchState === "loading" && "Searching cities…"}
                {searchState === "error" &&
                  "City search is unavailable. Try again in a moment."}
                {searchState === "results" &&
                  (results.length
                    ? `${results.length} matching cities`
                    : "No matching cities")}
              </output>
              {searchState === "results" &&
                results.map((city) => (
                  <button
                    type="button"
                    key={city.id}
                    onClick={() => load(city)}
                  >
                    {locationName(city)}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="isobar-reading">
        <div className="isobar-place">
          <p className="study-code">
            {place.country ?? "Forecast"} ·{" "}
            {forecast?.zone ?? place.timezone ?? "Local time"}
          </p>
          <h2>{place.name}</h2>
          <p>
            {selected && forecast
              ? hourLabel(selected.time, forecast.zone, true)
              : "Awaiting forecast"}
          </p>
        </div>
        <div className="isobar-number">
          <p className="study-code">{range.label}</p>
          <p key={`${metric}:${hour}`} className="isobar-value">
            {metricValue?.value ?? "—"}
            <span>
              {metricValue?.unit ?? weatherValue(metric, 0, imperial).unit}
            </span>
          </p>
        </div>
        <div className="isobar-current">
          <button
            type="button"
            className="isobar-units"
            aria-label="Use Fahrenheit and miles per hour"
            aria-pressed={imperial}
            onClick={() => setImperial(!imperial)}
          >
            <span>°C</span>
            <span>°F</span>
          </button>
          {selected && (
            <p>
              {weatherLabel(selected.code)}
              <small>
                {selected.rain}% rain ·{" "}
                {weatherValue("wind", selected.wind, imperial).value}{" "}
                {weatherValue("wind", selected.wind, imperial).unit} wind
              </small>
            </p>
          )}
        </div>
      </div>

      <fieldset className="isobar-modes">
        <legend className="study-sr">Forecast metric</legend>
        {(Object.keys(metrics) as Metric[]).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={mode === metric}
            onClick={() => setMetric(mode)}
          >
            {metrics[mode].label}
          </button>
        ))}
      </fieldset>
      {forecast ? (
        <div
          className="isobar-field"
          key={`${forecast.city.id}:${forecast.source}`}
        >
          {(
            [
              { start: 0, count: 48, mode: "wide" },
              { start: mobileStart, count: 12, mode: "compact" },
            ] as const
          ).map(({ start, count, mode }) => (
            <div className={`isobar-field-${mode}`} key={mode}>
              <div
                className="isobar-scrub-surface"
                onPointerDown={(event) => {
                  if (event.button !== 0 || !event.isPrimary) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  scrub(event, start, count);
                }}
                onPointerMove={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId))
                    scrub(event, start, count);
                }}
              >
                <WeatherField
                  hours={forecast.hours}
                  selected={hour}
                  metric={metric}
                  start={start}
                  count={count}
                />
              </div>
              <div className="isobar-axis study-code">
                {Array.from({ length: count === 48 ? 5 : 3 }, (_, index) => {
                  const labelIndex =
                    start +
                    Math.min(count - 1, index * (count === 48 ? 12 : 6));
                  return (
                    <span key={labelIndex}>
                      {hourLabel(
                        forecast.hours[labelIndex].time,
                        forecast.zone,
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
          <label className="isobar-slider">
            <span className="study-code">Hour {hour + 1} / 48</span>
            <input
              aria-label="Forecast hour"
              aria-valuetext={
                selected
                  ? hourLabel(selected.time, forecast.zone, true)
                  : undefined
              }
              type="range"
              min="0"
              max="47"
              value={hour}
              onChange={(event) =>
                selectHour(event.currentTarget.valueAsNumber)
              }
            />
          </label>
          <div className="isobar-legend">
            <span>Type density · {range.label.toLowerCase()} by hour</span>
            <span>
              {weatherValue(metric, range.min, imperial).value} to{" "}
              {weatherValue(metric, range.max, imperial).value}{" "}
              {weatherValue(metric, range.max, imperial).unit}
            </span>
          </div>
        </div>
      ) : (
        <div className="isobar-blank" aria-hidden="true" />
      )}

      <div className="isobar-status">
        <output className="isobar-network-status">
          {loadState === "loading" && (
            <span>
              Loading forecast for {request?.city.name ?? place.name}…
            </span>
          )}
          {loadState === "error" && (
            <span>
              The live forecast is unavailable
              {forecast ? ". The previous forecast is still displayed." : "."}
            </span>
          )}
        </output>
        {loadState === "error" && (
          <button
            type="button"
            onClick={() => load(request?.city ?? initialCity)}
          >
            Retry live forecast
          </button>
        )}
        {!forecast && loadState === "error" && (
          <button
            type="button"
            onClick={() => {
              setRequest(null);
              setForecast(demoForecast);
              setHour(0);
              setLoadState("ready");
            }}
          >
            Load demo data
          </button>
        )}
        {forecast && (
          <p>
            {forecast.source === "demo" ? (
              "Demo data · Berlin, 11–13 May 2026"
            ) : (
              <>
                Live forecast from{" "}
                <a href="https://open-meteo.com/">Open-Meteo</a> ·{" "}
                {forecast.zone}
              </>
            )}
          </p>
        )}
      </div>
      <div className="isobar-window">
        <div>
          <h3>Find a two-hour window</h3>
          <p>
            {recommendations[condition]}. Best among available forecast hours.
          </p>
        </div>
        <div className="isobar-window-actions">
          <label>
            <span className="study-sr">Condition</span>
            <select
              value={condition}
              onChange={(event) => {
                setCondition(event.target.value as Window);
                setRecommendation(undefined);
              }}
            >
              {Object.keys(recommendations).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <button type="button" disabled={!forecast} onClick={recommend}>
            Find window ↗
          </button>
        </div>
        {recommendation && (
          <output className="isobar-recommendation">{recommendation}</output>
        )}
      </div>
    </div>
  );
}
