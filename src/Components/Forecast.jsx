import "../css/Weather.css";
import "../css/Forecast.css";
import { useEffect, useState } from "react";
import { getWeatherForecast } from "../api/ForecastWeather";
import { useNavigate } from "react-router-dom";

// Language Rule
const lang = localStorage.getItem("lang") || "en";

// UI Text (Hindi / English)
const text = {
  en: {
    loading: "Loading forecast...",
    heading: "Weather Forecast",
    unavailable: "Forecast unavailable",
    location: "Location",
    trendTitle: "7–14 Day Trend",
    rain: "Rain",
    outlook: "Outlook",
    insight: "Seasonal Insight",
    btnRecommendation: "🌾 View Crop Recommendation"
  },
  hi: {
    loading: "पूर्वानुमान लोड हो रहा है...",
    heading: "मौसम का पूर्वानुमान",
    unavailable: "पूर्वानुमान उपलब्ध नहीं है",
    location: "स्थान",
    trendTitle: "7-14 दिनों का रुझान",
    rain: "बारिश",
    outlook: "संभावना",
    insight: "मौसमी जानकारी (Insight)",
    btnRecommendation: "🌾 फसल अनुशंसा देखें"
  }
};

const Forecast = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("CropInput");
    if (!stored) {
      navigate("/CropRecommendation", { replace: true });
      return;
    }

    let location;
    try {
      location = JSON.parse(stored)?.location;
    } catch {
      navigate("/CropRecommendation", { replace: true });
      return;
    }

    if (!location) {
      navigate("/CropRecommendation", { replace: true });
      return;
    }

    const run = async () => {
      try {
        const res = await getWeatherForecast(location);
        
        // 🔢 CALCULATE SUMMARY FROM TREND
        let totalTemp = 0;
        let totalRain = 0;
        let rainyDays = 0;
        let hotDays = 0;

        res.trend.forEach((day) => {
          totalTemp += day.avgTemp;
          const rain = parseFloat(day.rainTrend) || 0;
          totalRain += rain;
          if (rain > 5) rainyDays++;
          if (day.avgTemp > 35) hotDays++;
        });

        const avgTemp = Math.round(totalTemp / res.trend.length);

        const weatherSummary = {
          avgTemp,
          totalRain: Math.round(totalRain),
          rainyDays,
          hotDays
        };

        sessionStorage.setItem("weatherSummary", JSON.stringify(weatherSummary));
        setData(res);
        setError(null);
      } catch (e) {
        setError(e.message || (lang === "hi" ? "पूर्वानुमान लोड करने में असमर्थ" : "Unable to load forecast"));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [navigate]);

  if (loading) {
    return <h2 style={{ color: "white", textAlign: "center" }}>{text[lang].loading}</h2>;
  }

  if (error || !data) {
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
        <p>{text[lang].location}: <b>{data.location}</b></p>
      </div>

      <h2 className="forecast-title">{text[lang].trendTitle}</h2>

      <div className="forecast-row">
        {data.trend.map((d) => (
          <div className={`day ${d.isOutlook ? "outlook" : ""}`} key={d.date}>
            <div><b>{d.date}</b></div>
            <div>{d.condition}</div>
            <div>{d.avgTemp}°C</div>
            <div>{text[lang].rain}: {d.rainTrend}</div>
            {d.isOutlook && <div className="outlook-badge">{text[lang].outlook}</div>}
          </div>
        ))}
      </div>

      <div className="seasonal-insight">
        <h3>{text[lang].insight}</h3>
        <p>{data.insight}</p>
      </div>

      <div className="forecast-action">
        <button
          className="recommend-btn"
          onClick={() => navigate("/Recommendation")}
        >
          {text[lang].btnRecommendation}
        </button>
      </div>
    </div>
  );
};

export default Forecast;