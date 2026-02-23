import "../css/FinalRecommendation.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCropRecommendation } from "../api/recommend";

const lang = localStorage.getItem("lang") || "en";

const text = {
  en: {
    loading: "Calculating best crops...",
    title: "Recommended Crops for Your Farm",
    subtitle: "Based on soil, season & 14-day weather forecast",
    labelSeason: "Season",
    labelSoil: "Soil",
    labelTemp: "Avg Temp",
    labelRain: "Rainfall",
    headingCrops: "Recommended Crops",
    labelRisk: "Risk Level",
    headingAdvisory: "Advisory",
    headingWhy: "Why these crops?",
    headingAction: "Action Plan",
    btnForecast: "<- Forecast",
    btnDashboard: "Dashboard",
    noCrops: "No crops recommended for these conditions.",
  },
  hi: {
    loading: "सबसे अच्छी फसलों की गणना की जा रही है...",
    title: "आपके खेत के लिए अनुशंसित फसलें",
    subtitle: "मिट्टी, मौसम और 14 दिनों के पूर्वानुमान के आधार पर",
    labelSeason: "सीजन",
    labelSoil: "मिट्टी",
    labelTemp: "औसत तापमान",
    labelRain: "वर्षा",
    headingCrops: "अनुशंसित फसलें",
    labelRisk: "जोखिम स्तर",
    headingAdvisory: "सलाह",
    headingWhy: "ये फसलें क्यों?",
    headingAction: "कार्य योजना",
    btnForecast: "<- पूर्वानुमान",
    btnDashboard: "डैशबोर्ड",
    noCrops: "इन परिस्थितियों के लिए कोई फसल अनुशंसित नहीं है।",
  },
};

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

    const run = async () => {
      try {
        const payload = {
          lang,
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

        const res = await getCropRecommendation(payload);
        setResult(res);
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
        <div className="final-rec-loading">{text[lang].loading}</div>
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

  const cropsList = result.recommendedCrops || [];

  return (
    <div className="final-rec-page">
      <div className="final-rec-wrap">
        <header className="final-rec-header">
          <h1>{text[lang].title}</h1>
          <p>{text[lang].subtitle}</p>
        </header>

        <div className="final-rec-summary">
          <div className="summary-item">
            <span className="summary-label">{text[lang].labelSeason}: </span>
            {cropInput.season}
          </div>
          <div className="summary-item">
            <span className="summary-label">{text[lang].labelSoil}: </span>
            {cropInput.soilType}
          </div>
          <div className="summary-item">
            <span className="summary-label">{text[lang].labelTemp}: </span>
            {weather.avgTemp}°C
          </div>
          <div className="summary-item">
            <span className="summary-label">{text[lang].labelRain}: </span>
            {weather.totalRain}mm
          </div>
        </div>

        <div className="final-rec-card">
          <section className="rec-section">
            <h2>{text[lang].headingCrops}</h2>
            <div className="crop-pills">
              {cropsList.length > 0 ? (
                cropsList.map((c, i) => (
                  <div key={i} className="crop-pill">
                    * {c}
                  </div>
                ))
              ) : (
                <p>{text[lang].noCrops}</p>
              )}
            </div>
          </section>

          <div className={`risk-badge risk-${normalizeRisk(result.riskLevel)}`}>
            {text[lang].labelRisk}: {result.riskLevel}
          </div>

          <section className="rec-section">
            <h2>{text[lang].headingAdvisory}</h2>
            <p className="rec-advisory-text">{result.advisory}</p>
          </section>

          {result.actionPlan && (
            <section className="rec-section">
              <h2>{text[lang].headingAction}</h2>
              <ul className="rec-reasons-list">
                {result.actionPlan.map((step, i) => (
                  <li key={i}>[x] {step}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="rec-section">
            <h2>{text[lang].headingWhy}</h2>
            <ul className="rec-reasons-list">
              {result.reasons?.map((r, i) => (
                <li key={i}>- {r}</li>
              ))}
            </ul>
          </section>

          <div className="final-rec-actions">
            <button onClick={() => navigate("/Forecast")}>
              {text[lang].btnForecast}
            </button>
            <button onClick={() => navigate("/Dashboard")}>
              {text[lang].btnDashboard}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalRecommendation;
