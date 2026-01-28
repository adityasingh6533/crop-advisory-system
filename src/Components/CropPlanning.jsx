import "../css/CropPlanning.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SeasonalPlanning = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/SignIn");
    }
  }, [navigate]);

  return (
    <div className="season-container">
      <div className="season-card">

        <h1 className="season-heading">Seasonal Crop Planning</h1>
        <p className="season-subtitle">
          Plan crops efficiently based on season and regional conditions
        </p>

        <div className="season-grid">

          <div className="season-box kharif">
            <h2>Kharif</h2>
            <p>Monsoon crops suitable for high rainfall</p>
            <ul>
              <li>🌾 Rice</li>
              <li>🌽 Maize</li>
              <li>🌱 Cotton</li>
              <li>🫘 Soybean</li>
            </ul>
          </div>

          <div className="season-box rabi">
            <h2>Rabi</h2>
            <p>Winter crops grown with irrigation support</p>
            <ul>
              <li>🌾 Wheat</li>
              <li>🫘 Gram</li>
              <li>🌱 Mustard</li>
              <li>🥔 Potato</li>
            </ul>
          </div>

          <div className="season-box zaid">
            <h2>Zaid</h2>
            <p>Short-duration summer crops</p>
            <ul>
              <li>🥒 Cucumber</li>
              <li>🍉 Watermelon</li>
              <li>🥬 Vegetables</li>
              <li>🌽 Fodder</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SeasonalPlanning;
