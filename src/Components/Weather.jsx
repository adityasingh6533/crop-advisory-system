import "../css/Weather.css";
import { useEffect, useState } from "react";
import { getCurrentWeather } from "../api/currentWeather";
import { useNavigate } from "react-router-dom";

const Weather = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔐 Auth + CropInput guard
  useEffect(() => {
    const stored = sessionStorage.getItem("CropInput");
    if (!stored || stored === "undefined") {
      navigate("/CropRecommendation", { replace: true });
      return;
    }

    let location;
    try {
      const parsed = JSON.parse(stored);
      location = parsed?.location;
    } catch (e) {
      console.error("Invalid CropInput JSON", e);
      navigate("/CropRecommendation", { replace: true });
      return;
    }

    if (!location) {
      navigate("/CropRecommendation", { replace: true });
      return;
    }

    const fetchWeather = async () => {
      try {
        const data = await getCurrentWeather(location);
        setWeather({ ...data, location });
        setError(null);
      } catch (err) {
        console.error(err);
        // Show more useful backend/API error details
        setError(err.message || "Failed to load weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [navigate]);

  if (loading) {
    return <h2 style={{ color: "white", textAlign: "center" }}>Loading weather...</h2>;
  }

  if (error || !weather) {
    return (
      <div className="weather-page">
        <div className="weather-header">
          <h1>Weather Overview</h1>
          <p style={{ color: "white" }}>{error || "Weather data is unavailable."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-page">
      <div className="weather-header">
        <h1>Weather Overview</h1>
        <p>Location: <b>{weather.location}</b></p>
      </div>

      <div className="weather-main-card">
        <div className="temp-section">
          <h2>{weather.temperature}°C</h2>
          <span>{weather.condition}</span>
        </div>

        <div className="weather-meta">
          <p><b>Humidity:</b> {weather.humidity}%</p>
          <p><b>Wind:</b> {weather.windSpeed} km/h</p>
          <p><b>Visibility:</b> {weather.visibility} m</p>
          <p><b>Rainfall:</b> {weather.rainfall} mm</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
