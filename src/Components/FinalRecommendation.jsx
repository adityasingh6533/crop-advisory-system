import "../css/FinalRecommendation.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCropRecommendation } from "../api/recommend";

const FinalRecommendation = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [cropInput, setCropInput] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  /* ===== STATES ===== */
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

  /* ===== UI ===== */
  return (
    <div className="final-rec-page">
      <div className="final-rec-wrap">

        {/* HEADER */}
        <header className="final-rec-header">
          <span className="final-rec-badge">🌾 Your results</span>
          <h1>Recommended Crops for Your Farm</h1>
          <p>Based on soil, season & 14-day weather forecast</p>
        </header>

        {/* SUMMARY CARDS */}
        <div className="final-rec-summary">
          <div className="summary-item">
            <span className="summary-icon">📅</span>
            <span className="summary-label">Season:- </span>
            <span className="summary-value">{cropInput.season}</span>
          </div>
          <div className="summary-item">
            <span className="summary-icon">🌱</span>
            <span className="summary-label">Soil:- </span>
            <span className="summary-value">{cropInput.soilType}</span>
          </div>
          <div className="summary-item">
            <span className="summary-icon">🌡️</span>
            <span className="summary-label">Avg Temp:- </span>
            <span className="summary-value">{weather.avgTemp}°C</span>
          </div>
          <div className="summary-item">
            <span className="summary-icon">🌧️</span>
            <span className="summary-label">Rainfall:- </span>
            <span className="summary-value">{weather.totalRain} mm</span>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="final-rec-card">

          {/* CROPS */}
          <section className="rec-section rec-crops-section">
            <h2 className="rec-section-title">Recommended Crops</h2>
            <div className="crop-pills">
              {result.crops.map((c, i) => (
                <div key={i} className="crop-pill">
                  <span className="crop-pill-icon">🌾</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RISK */}
          <div className={`risk-badge risk-${(result.riskLevel || result.risk || "low").toLowerCase()}`}>
            <span className="risk-label">Risk level:-  </span>
            <span className="risk-value">{result.riskLevel || result.risk}</span>
          </div>

          {/* ADVISORY */}
          <section className="rec-section rec-advisory-section">
            <h2 className="rec-section-title">Advisory</h2>
            <p className="rec-advisory-text">{result.advisory}</p>
          </section>

          {/* REASONS */}
          <section className="rec-section rec-reasons-section">
            <h2 className="rec-section-title">Why these crops?</h2>
            <ul className="rec-reasons-list">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>

          {/* ACTIONS */}
          <div className="final-rec-actions">
            <button type="button" className="btn-primary" onClick={() => navigate("/Forecast")}>
              ← Back to Forecast
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate("/Dashboard")}>
              Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinalRecommendation;