export type City = {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};
export type WeatherHour = {
  time: number;
  temperature: number;
  rain: number;
  wind: number;
  code: number;
};
export type Forecast = {
  city: City;
  zone: string;
  hours: WeatherHour[];
  source: "live" | "demo";
  fetchedAt?: number;
};
export type Metric = "temperature" | "rain" | "wind";
export type Window = "Dry" | "Mild" | "Low wind";
export const defaultCity: City = {
  id: 2950159,
  name: "Berlin",
  country: "Germany",
  latitude: 52.52,
  longitude: 13.405,
  timezone: "Europe/Berlin",
};
export const metrics = {
  temperature: { label: "Temperature", min: -15, max: 40, unit: "°C" },
  rain: { label: "Rain chance", min: 0, max: 100, unit: "%" },
  wind: { label: "Wind", min: 0, max: 65, unit: "km/h" },
} as const;

export const demoForecast: Forecast = {
  city: defaultCity,
  zone: "Europe/Berlin",
  source: "demo",
  hours: Array.from({ length: 48 }, (_, index) => {
    const daytime = Math.max(0, Math.sin(((index - 2) * Math.PI) / 12));
    const shower = Math.max(0, 1 - Math.abs(index - 29) / 11);
    return {
      time: Date.UTC(2026, 4, 11, 6 + index) / 1000,
      temperature: Math.round(12 + daytime * 10 - shower * 4 + index / 20),
      rain: Math.round(4 + shower * 83 + (index % 5)),
      wind: Math.round(10 + daytime * 11 + shower * 22),
      code: shower > 0.5 ? 61 : daytime > 0.4 ? 1 : 3,
    };
  }),
};
export function weatherLabel(code: number) {
  if (code === 0) return "Clear";
  if (code < 3) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code < 50) return "Fog";
  if (code < 60) return "Drizzle";
  if (code < 70) return "Rain";
  if (code < 80) return "Snow";
  if (code < 85) return "Showers";
  if (code < 95) return "Snow showers";
  return "Thunderstorms";
}
export function hourLabel(time: number, zone: string, full = false) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    ...(full
      ? {
          weekday: "short",
          day: "numeric",
          month: "short",
          timeZoneName: "shortOffset",
        }
      : {}),
  }).format(time * 1000);
}
export function weatherValue(metric: Metric, value: number, imperial: boolean) {
  if (imperial && metric === "temperature")
    return { value: Math.round((value * 9) / 5 + 32), unit: "°F" };
  if (imperial && metric === "wind")
    return { value: Math.round(value / 1.609344), unit: "mph" };
  return { value: Math.round(value), unit: metrics[metric].unit };
}
export function bestWeatherWindow(hours: WeatherHour[], criterion: Window) {
  let best: { index: number; score: number } | null = null;
  for (let index = 0; index < hours.length - 1; index++) {
    const a = hours[index];
    const b = hours[index + 1];
    if (b.time - a.time !== 3600) continue;
    const score =
      criterion === "Dry"
        ? Math.max(a.rain, b.rain)
        : criterion === "Low wind"
          ? Math.max(a.wind, b.wind)
          : (Math.abs(a.temperature - 20) + Math.abs(b.temperature - 20)) / 2;
    if (!best || score < best.score) best = { index, score };
  }
  return best;
}

export async function findCities(
  query: string,
  signal: AbortSignal,
): Promise<City[]> {
  const params = new URLSearchParams({
    name: query,
    count: "7",
    language: "en",
    format: "json",
  });
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    { signal },
  );
  if (!response.ok) throw new Error("Geocoding unavailable");
  const payload = await response.json();
  return (payload.results ?? []).filter(
    (city: City) =>
      Number.isFinite(city.latitude) && Number.isFinite(city.longitude),
  );
}

type ForecastPayload = {
  timezone: string;
  hourly: Record<
    | "time"
    | "temperature_2m"
    | "precipitation_probability"
    | "wind_speed_10m"
    | "weather_code",
    number[]
  >;
};
export function parseForecast(
  city: City,
  data: ForecastPayload,
  fetchedAt: number,
): Forecast {
  const { hourly, timezone } = data;
  // Unix timestamps preserve repeated local hours through daylight-saving transitions.
  const hours = hourly.time.slice(0, 48).map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[index],
    rain: hourly.precipitation_probability[index],
    wind: hourly.wind_speed_10m[index],
    code: hourly.weather_code[index],
  }));
  if (
    hours.length !== 48 ||
    hours.some((hour) =>
      Object.values(hour).some((value) => !Number.isFinite(value)),
    )
  ) {
    throw new Error("Incomplete forecast");
  }
  return { city, zone: timezone, hours, source: "live", fetchedAt };
}
const forecastCache = new Map<number, Forecast>();
export async function getForecast(
  city: City,
  signal: AbortSignal,
): Promise<Forecast> {
  const cached = forecastCache.get(city.id);
  if (cached?.fetchedAt && Date.now() - cached.fetchedAt < 5 * 60_000)
    return cached;
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    hourly:
      "temperature_2m,precipitation_probability,wind_speed_10m,weather_code",
    forecast_hours: "48",
    timeformat: "unixtime",
    timezone: "auto",
  });
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    { signal },
  );
  if (!response.ok) throw new Error("Forecast unavailable");
  const forecast = parseForecast(city, await response.json(), Date.now());
  if (forecastCache.size >= 20) {
    const oldest = forecastCache.keys().next().value;
    if (oldest !== undefined) forecastCache.delete(oldest);
  }
  forecastCache.set(city.id, forecast);
  return forecast;
}
