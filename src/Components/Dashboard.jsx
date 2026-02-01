import "../css/Dashboard.css";
import React from "react";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


const user = JSON.parse(sessionStorage.getItem("user")) || { FirstName: "User", Email: "user@email.com" };

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
      <h3 className="username">Welcome, {user.Username} </h3>
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
    Logout
  </button>
    
  </div>
</div>


        <h1 className="dashboard-heading">
          Welcome to Crop Advisory Dashboard
        </h1>


        <p className="dashboard-subtitle">
          Plan smarter farming decisions with weather-based crop guidance
        </p>

        <div className="dashboard-actions">
          <div className="action-card">
            <button onClick={() => window.location.href = '/CropRecommendation'}>
              🌾 Get Crop Recommendation
            </button>
          </div>

          <div className="action-card">
           <button onClick={() => window.location.href = '/Forecast'}>
             🌦️ Check Weather Forecast
           </button>
          </div>

          <div className="action-card">
            <button onClick={() => window.location.href = '/SeasonalPlanning'}>
              📅 Seasonal Crop Planning
            </button>
          </div>

          <div className="action-card">
            <button onClick={() => window.location.href = '/Soil'}>
              🌱 Soil Based Suggestions
            </button>
          </div>

          <div className="action-card">
    <button onClick={() => window.location.href = '/Detect'}>
      🧪 Crop Disease Detection
    </button>
  </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
