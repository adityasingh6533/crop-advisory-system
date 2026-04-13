import "../css/Dashboard.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contextProvider/context";

const lang = localStorage.getItem("lang") || "en";

const text = {
  en: {
    welcome: "Welcome",
    logout: "Logout",
    heading: "Welcome to Crop Advisory Dashboard",
    subtitle: "Plan smarter farming decisions with weather-based crop guidance",
    btnRecommendation: "Get Crop Recommendation",
    btnWeather: "Check Weather Forecast",
    btnPlanning: "Seasonal Crop Planning",
    btnSoil: "Soil Based Suggestions",
    btnDisease: "Crop Disease Detection",
    ndvi: "Crop Health Analysis",
  },
  hi: {
    welcome: "स्वागत है",
    logout: "लॉगआउट",
    heading: "फसल सलाह डैशबोर्ड में आपका स्वागत है",
    subtitle: "मौसम आधारित फसल मार्गदर्शन के साथ बेहतर खेती के निर्णय लें",
    btnRecommendation: "फसल अनुशंसा प्राप्त करें",
    btnWeather: "मौसम पूर्वानुमान देखें",
    btnPlanning: "मौसमी फसल योजना",
    btnSoil: "मिट्टी आधारित सुझाव",
    btnDisease: "फसल रोग पहचान",
    ndvi: "फसल स्वास्थ्य विश्लेषण",
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { state, logoutUser } = useAppContext();
  const user = state.user || {
    FirstName: "User",
    Email: "user@email.com",
    Username: "User",
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/signin");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="user-info-bar">
          <div className="user-left">
            <div className="avatar">User</div>
            <div className="user-text">
              <h3 className="username">
                {text[lang].welcome}, {user.Username}
              </h3>
              <p className="email">{user.Email}</p>
            </div>
          </div>

          <div className="user-right">
            <button className="logout-btn" onClick={handleLogout}>
              {text[lang].logout}
            </button>
          </div>
        </div>

        <h1 className="dashboard-heading">{text[lang].heading}</h1>

        <p className="dashboard-subtitle">{text[lang].subtitle}</p>

        <div className="dashboard-actions">
          <div className="action-card">
            <button onClick={() => navigate("/croprecommendation")}>
              {text[lang].btnRecommendation}
            </button>
          </div>

          <div className="action-card">
            <button onClick={() => navigate("/forecast")}>
              {text[lang].btnWeather}
            </button>
          </div>

          <div className="action-card">
            <button onClick={() => navigate("/detect")}>
              {text[lang].btnDisease}
            </button>
          </div>

          <div className="action-card">
            <button onClick={() => navigate("/ndvi")}>
              {text[lang].ndvi}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
