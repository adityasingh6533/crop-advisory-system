import { getApiBaseUrl } from "./config";

const BASE_URL = `${getApiBaseUrl()}/api/weather`;

export const getWeatherForecast = async (location) => {
  const res = await fetch(
    `${BASE_URL}/forecast?location=${encodeURIComponent(location)}`
  );
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return res.json();
};
