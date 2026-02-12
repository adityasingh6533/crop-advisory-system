import "../css/Weather.css";
import { useEffect, useState } from "react";
import { getCurrentWeather } from "../api/currentWeather";
import { useNavigate } from "react-router-dom";

// Language Rule
const lang = localStorage.getItem("lang") || "en";

// UI Text (Hindi / English)
const text = {
  en: {
    loading: "Loading weather...",
    heading: "Weather Overview",
    unavailable: "Weather data is unavailable.",
    location: "Location",
    humidity: "Humidity",
    wind: "Wind",
    visibility: "Visibility",
    rainfall: "Rainfall",
    btnForecast: "View 7–14 Days Forecast →"
  },
  hi: {
    loading: "मौसम की जानकारी लोड हो रही है...",
    heading: "मौसम का अवलोकन",
    unavailable: "मौसम का डेटा उपलब्ध नहीं है।",
    location: "स्थान",
    humidity: "नमी (Humidity)",
    wind: "हवा की गति",
    visibility: "दृश्यता (Visibility)",
    rainfall: "वर्षा",
    btnForecast: "7–14 दिनों का पूर्वानुमान देखें →"
  }
};

const Weather = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err.message || (lang === "hi" ? "मौसम डेटा लोड करने में विफल।" : "Failed to load weather data."));
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [navigate]);

  if (loading) {
    return <h2 style={{ color: "skyblue", textAlign: "center" }}>{text[lang].loading}</h2>;
  }

  if (error || !weather) {
    return (
      <div className="weather-page">
        <div className="weather-header">
          <h1>{text[lang].heading}</h1>
          <p style={{ color: "white" }}>{error || text[lang].unavailable}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-page">
      <div className="weather-header">
        <h1>{text[lang].heading}</h1>
        <p>{text[lang].location}: <b>{weather.location}</b></p>
      </div>

      <div className="weather-main-card">
        <div className="temp-section">
          <h2>{weather.temperature}°C</h2>
          <span>{weather.condition}</span>
        </div>

        <div className="weather-meta">
          <p><b>{text[lang].humidity}:</b> {weather.humidity}%</p>
          <p><b>{text[lang].wind}:</b> {weather.windSpeed} km/h</p>
          <p><b>{text[lang].visibility}:</b> {weather.visibility} m</p>
          <p><b>{text[lang].rainfall}:</b> {weather.rainfall} mm</p>
        </div>
      </div>

      <div className="forecast-btn-wrapper">
        <button
          className="forecast-btn"
          onClick={() => navigate("/Forecast")}
        >
          {text[lang].btnForecast}
        </button>
      </div>
    </div>
  );
};

export default Weather;