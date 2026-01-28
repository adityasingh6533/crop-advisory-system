// NOTE: backend is currently running on 5001 (5000 was responding 404)
const BASE_URL = "http://localhost:5001/api/weather";

export const getCurrentWeather = async (location) => {
  const response = await fetch(`${BASE_URL}/current?location=${encodeURIComponent(location)}`);

  if (!response.ok) {
    let details = "";
    try {
      details = await response.text();
    } catch {
      // ignore
    }
    throw new Error(`Failed to fetch weather data (HTTP ${response.status})${details ? `: ${details}` : ""}`);
  }

  return await response.json();
};
