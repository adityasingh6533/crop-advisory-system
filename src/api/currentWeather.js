const BASE_URL = "http://localhost:5002/api/weather";

export const getCurrentWeather = async (location) => {
  const response = await fetch(`${BASE_URL}/current?location=${encodeURIComponent(location)}`);

  if (!response.ok) {
    let details = "";
    try {
      details = await response.text();
    } catch {
      
    }
    throw new Error(`Failed to fetch weather data (HTTP ${response.status})${details ? `: ${details}` : ""}`);
  }

  return await response.json();
};
