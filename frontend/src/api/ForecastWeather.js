import { getApiBaseUrl } from "./config";

const BASE_URL = `${getApiBaseUrl()}/api/weather`;

export const getWeatherForecast = async (location) => {
  const res = await fetch(
    `${BASE_URL}/forecast?location=${encodeURIComponent(location)}`
  );

  if (!res.ok) {
    let details = "";
    try {
      const data = await res.json();
      details = data?.error || data?.message || "";
    } catch {
      try {
        details = await res.text();
      } catch {
        
      }
    }

    throw new Error(
      `Failed to fetch forecast (HTTP ${res.status})${details ? `: ${details}` : ""}`
    );
  }

  return res.json();
};
