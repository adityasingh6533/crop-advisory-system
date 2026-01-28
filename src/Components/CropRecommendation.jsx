import "../css/CropRecommendation.css";
import { createCropInput } from "../api/CropInputApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CropRecommendation = () => {
  const navigate = useNavigate();

  // 🔐 Auth Guard
  useEffect(() => {
  const user = sessionStorage.getItem("user");
  if (!user) {
    navigate("/SignIn", { replace: true });
  }
}, [navigate]);


  const handleRecommendation = async () => {
    const location = document.querySelector('input[type="text"]').value;
    const soilType = document.querySelectorAll('select')[0].value;
    const season = document.querySelectorAll('select')[1].value;
    const irrigationType = document.querySelectorAll('select')[2].value;

    if (
      !location ||
      soilType === "Select soil type" ||
      season === "Select season" ||
      irrigationType === "Select irrigation"
    ) {
      alert("All fields are required!");
      return;
    }

    const cropInputData = {
      location,
      soilType,
      season,
      irrigationType,
    };

    try {
      const response = await createCropInput(cropInputData);

      
     sessionStorage.setItem(
  "CropInput",
  JSON.stringify(response.cropInput)
);
      alert("Crop input submitted successfully!");
      navigate("/weather")
    } catch (error) {
      console.error("Error submitting crop input:", error);
      alert("Error submitting crop input: " + error.message);
    }
  };

  return (
    <div className="crop-container">
      <div className="crop-card">

        <h1 className="crop-heading">Crop Recommendation</h1>
        <p className="crop-subtitle">
          Provide basic details to get suitable crops for your land
        </p>

        <div className="crop-form">

          <div className="form-group">
            <label>Location / District</label>
            <input type="text" placeholder="e.g. Lucknow" />
          </div>

          <div className="form-group">
            <label>Soil Type</label>
            <select>
              <option>Select soil type</option>
              <option>Sandy</option>
              <option>Clay</option>
              <option>Loamy</option>
              <option>Black</option>
              <option>Red</option>
            </select>
          </div>

          <div className="form-group">
            <label>Season</label>
            <select>
              <option>Select season</option>
              <option>Kharif</option>
              <option>Rabi</option>
              <option>Zaid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Irrigation Type</label>
            <select>
              <option>Select irrigation</option>
              <option>Rainfed</option>
              <option>Canal</option>
              <option>Borewell</option>
            </select>
          </div>

          <button type="button" className="recommend-btn" onClick={handleRecommendation}>
            Get Recommendation
          </button>

        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
