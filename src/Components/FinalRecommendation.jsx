import "../css/FinalRecommendation.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCropRecommendation } from "../api/recommend";

const normalizeRisk = (risk) => {
  if (!risk) return "low";
  return risk.toString().trim().toLowerCase();
};

const FinalRecommendation = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [cropInput, setCropInput] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/SignIn");
      return;
    }

    const storedCrop = sessionStorage.getItem("CropInput");
    const storedWeather = sessionStorage.getItem("weatherSummary");

    if (!storedCrop || !storedWeather) {
      navigate("/CropRecommendation", { replace: true });
      return;
    }

    const crop = JSON.parse(storedCrop);
    const weatherSummary = JSON.parse(storedWeather);

    setCropInput(crop);
    setWeather(weatherSummary);

    const payload = {
      cropInput: {
        season: crop.season,
        soilType: crop.soilType,
        irrigationType: crop.irrigationType,
      },
      weatherSummary: {
        avgTemp: weatherSummary.avgTemp,
        totalRain: weatherSummary.totalRain,
        rainyDays: weatherSummary.rainyDays,
        hotDays: weatherSummary.hotDays,
      },
    };

    const run = async () => {
      try {
        const res = await getCropRecommendation(payload);
        setResult(res);
        sessionStorage.setItem("recommendationResult", JSON.stringify(res));
      } catch (e) {
        setError(e.message || "Failed to generate recommendation");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [navigate]);

  if (loading) {
    return (
      <div className="final-rec-page">
        <div className="final-rec-loading">Calculating best crops…</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="final-rec-page">
        <div className="final-rec-loading">{error}</div>
      </div>
    );
  }

  return (
    <div className="final-rec-page">
      <div className="final-rec-wrap">

        <header className="final-rec-header">
          <h1>Recommended Crops for Your Farm</h1>
          <p>Based on soil, season & 14-day weather forecast</p>
        </header>

        <div className="final-rec-summary">
          <div className="summary-item">
            <span className="summary-label">Season:- </span>
            <span className="summary-value">{cropInput.season}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Soil:- </span>
            <span className="summary-value">{cropInput.soilType}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Avg Temp:- </span>
            <span className="summary-value">{weather.avgTemp}°C</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Rainfall:- </span>
            <span className="summary-value">{weather.totalRain} mm</span>
          </div>
        </div>

        <div className="final-rec-card">

          <section className="rec-section">
            <h2>Recommended Crops</h2>
            <div className="crop-pills">
              {result.crops.map((c, i) => (
                <div key={i} className="crop-pill">🌾 {c}</div>
              ))}
            </div>
          </section>

          <div className={`risk-badge risk-${normalizeRisk(result.riskLevel || result.risk)}`}>
            Risk Level: {result.riskLevel || result.risk}
          </div>

          <section className="rec-section">
            <h2>Advisory</h2>
            <p className="rec-advisory-text">{result.advisory}</p>
          </section>

          <section className="rec-section">
            <h2>Why these crops?</h2>
            <ul className="rec-reasons-list">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>

          <div className="final-rec-actions">
            <button onClick={() => navigate("/Forecast")}>← Forecast</button>
            <button onClick={() => navigate("/Dashboard")}>Dashboard</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinalRecommendation;