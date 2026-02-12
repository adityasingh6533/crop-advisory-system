import "../css/Dashboard.css";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Language Rule: LocalStorage se lang nikaalo ya default "en"
const lang = localStorage.getItem("lang") || "en";

// UI Text (Hindi / English) - Jaisa tumne image mein dikhaya tha
const text = {
  en: {
    welcome: "Welcome",
    logout: "Logout",
    heading: "Welcome to Crop Advisory Dashboard",
    subtitle: "Plan smarter farming decisions with weather-based crop guidance",
    btnRecommendation: "🌾 Get Crop Recommendation",
    btnWeather: "🌦️ Check Weather Forecast",
    btnPlanning: "📅 Seasonal Crop Planning",
    btnSoil: "🌱 Soil Based Suggestions",
    btnDisease: "🧪 Crop Disease Detection"
  },
  hi: {
    welcome: "स्वागत है",
    logout: "लॉगआउट",
    heading: "फसल सलाह डैशबोर्ड में आपका स्वागत है",
    subtitle: "मौसम आधारित फसल मार्गदर्शन के साथ बेहतर खेती के निर्णय लें",
    btnRecommendation: "🌾 फसल अनुशंसा प्राप्त करें",
    btnWeather: "🌦️ मौसम पूर्वानुमान देखें",
    btnPlanning: "📅 मौसमी फसल योजना",
    btnSoil: "🌱 मिट्टी आधारित सुझाव",
    btnDisease: "🧪 फसल रोग पहचान"
  }
};

const user = JSON.parse(sessionStorage.getItem("user")) || { FirstName: "User", Email: "user@email.com", Username: "User" };

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/SignIn");
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        {/* ===== USER INFO BAR ===== */}
        <div className="user-info-bar">
          <div className="user-left">
            <div className="avatar">👤</div>
            <div className="user-text">
              <h3 className="username">
                {text[lang].welcome}, {user.Username} 
              </h3>
              <p className="email">{user.Email}</p>
            </div>
          </div>

          <div className="user-right">
            <button
              className="logout-btn"
              onClick={() => {
                sessionStorage.removeItem("user");
                window.location.href = "/SignIn";
              }}
            >
              {text[lang].logout}
            </button>
          </div>
        </div>

        <h1 className="dashboard-heading">
          {text[lang].heading}
        </h1>

        <p className="dashboard-subtitle">
          {text[lang].subtitle}
        </p>

        <div className="dashboard-actions">
          <div className="action-card">
            <button onClick={() => window.location.href = '/CropRecommendation'}>
              {text[lang].btnRecommendation}
            </button>
          </div>

          <div className="action-card">
            <button onClick={() => window.location.href = '/Forecast'}>
              {text[lang].btnWeather}
            </button>
          </div>

          <div className="action-card">
            <button onClick={() => window.location.href = '/SeasonalPlanning'}>
              {text[lang].btnPlanning}
            </button>
          </div>

          <div className="action-card">
            <button onClick={() => window.location.href = '/Soil'}>
              {text[lang].btnSoil}
            </button>
          </div>

          <div className="action-card">
            <button onClick={() => window.location.href = '/Detect'}>
              {text[lang].btnDisease}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;