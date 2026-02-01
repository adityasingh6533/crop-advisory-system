import "../css/DiseaseDetection.css";
import { useNavigate } from "react-router-dom";

const DiseaseDetection = () => {
  const navigate = useNavigate();

  return (
    <div className="disease-page">
      <div className="overlay">

        <div className="disease-card">
          <h1 className="disease-title">Crop Disease Detection</h1>
          <p className="disease-subtitle">
            Upload a leaf image to detect crop disease using AI
          </p>

          <div className="upload-box">
            <input type="file" accept="image/*" />
          </div>

          <button
            className="detect-btn"
            onClick={() => navigate("/Weather")}
          >
            Analyze Disease
          </button>

          <p className="note">
            Supported: Tomato, Potato, Apple, Corn leaves
          </p>
        </div>

      </div>
    </div>
  );
};

export default DiseaseDetection;
