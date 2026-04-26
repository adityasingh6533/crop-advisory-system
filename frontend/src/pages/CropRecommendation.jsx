import "../css/CropRecommendation.css";
import { useState } from "react";
import { createCropInput } from "../api/CropInputApi";
import { useNavigate } from "react-router-dom";

const lang = localStorage.getItem("lang") || "en";

const text = {
  en: {
    heading: "Crop Recommendation",
    subtitle: "Provide basic details to get suitable crops for your land",
    labelLocation: "Location / District",
    phLocation: "e.g. Lucknow",
    labelSoil: "Soil Type",
    labelSeason: "Season",
    labelIrrigation: "Irrigation Type",
    btnSubmit: "View Weather",
    alertRequired: "All fields are required!",
    alertSuccess: "Crop input submitted successfully!",
    optionsSoil: [
      { value: "", label: "Select soil type" },
      { value: "Sandy", label: "Sandy" },
      { value: "Clay", label: "Clay" },
      { value: "Loamy", label: "Loamy" },
      { value: "Black", label: "Black" },
      { value: "Red", label: "Red" },
    ],
    optionsSeason: [
      { value: "", label: "Select season" },
      { value: "Kharif", label: "Kharif" },
      { value: "Rabi", label: "Rabi" },
      { value: "Zaid", label: "Zaid" },
    ],
    optionsIrrigation: [
      { value: "", label: "Select irrigation" },
      { value: "Rainfed", label: "Rainfed" },
      { value: "Canal", label: "Canal" },
      { value: "Borewell", label: "Borewell" },
    ],
  },
  hi: {
    heading: "Fasal Anushansa",
    subtitle: "Apni bhoomi ke liye upyukt fasale jaanne ke liye buniyadi vivaran dein",
    labelLocation: "Sthaan / Jila",
    phLocation: "Jaise: Lucknow",
    labelSoil: "Mitti ka Prakar",
    labelSeason: "Season (Ritu)",
    labelIrrigation: "Sinchai ka Prakar",
    btnSubmit: "Mausam Dekhen",
    alertRequired: "Sabhi fields anivarya hain!",
    alertSuccess: "Fasal input safaltapurvak jama ho gaya!",
    optionsSoil: [
      { value: "", label: "Mitti ka prakar chunein" },
      { value: "Sandy", label: "Retili (Sandy)" },
      { value: "Clay", label: "Chikni (Clay)" },
      { value: "Loamy", label: "Domat (Loamy)" },
      { value: "Black", label: "Kaali (Black)" },
      { value: "Red", label: "Laal (Red)" },
    ],
    optionsSeason: [
      { value: "", label: "Season chunein" },
      { value: "Kharif", label: "Kharif" },
      { value: "Rabi", label: "Rabi" },
      { value: "Zaid", label: "Zaid" },
    ],
    optionsIrrigation: [
      { value: "", label: "Sinchai chunein" },
      { value: "Rainfed", label: "Varsha Aadharit (Rainfed)" },
      { value: "Canal", label: "Nahar (Canal)" },
      { value: "Borewell", label: "Borewell" },
    ],
  },
};

const CropRecommendation = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [irrigationType, setIrrigationType] = useState("");

  const handleRecommendation = async () => {
    if (!location.trim() || !soilType || !season || !irrigationType) {
      alert(text[lang].alertRequired);
      return;
    }

    const cropInputData = {
      location: location.trim(),
      soilType,
      season,
      irrigationType,
    };

    try {
      const response = await createCropInput(cropInputData);
      sessionStorage.setItem("CropInput", JSON.stringify(response.cropInput));
      alert(text[lang].alertSuccess);
      navigate("/weather");
    } catch (error) {
      console.error("Error submitting crop input:", error);
      sessionStorage.setItem("CropInput", JSON.stringify(cropInputData));
      alert(
        lang === "hi"
          ? "Crop input server par save nahi ho paya, lekin advisory flow continue kiya ja raha hai."
          : "Crop input could not be saved on the server, but the advisory flow will continue."
      );
      navigate("/weather");
    }
  };

  return (
    <div className="crop-container">
      <div className="crop-card">
        <h1 className="crop-heading">{text[lang].heading}</h1>
        <p className="crop-subtitle">{text[lang].subtitle}</p>

        <div className="crop-form">
          <div className="form-group">
            <label>{text[lang].labelLocation}</label>
            <input
              type="text"
              placeholder={text[lang].phLocation}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>{text[lang].labelSoil}</label>
            <select
              value={soilType}
              onChange={(event) => setSoilType(event.target.value)}
            >
              {text[lang].optionsSoil.map((opt) => (
                <option key={`soil-${opt.value || "placeholder"}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{text[lang].labelSeason}</label>
            <select
              value={season}
              onChange={(event) => setSeason(event.target.value)}
            >
              {text[lang].optionsSeason.map((opt) => (
                <option
                  key={`season-${opt.value || "placeholder"}`}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{text[lang].labelIrrigation}</label>
            <select
              value={irrigationType}
              onChange={(event) => setIrrigationType(event.target.value)}
            >
              {text[lang].optionsIrrigation.map((opt) => (
                <option
                  key={`irrigation-${opt.value || "placeholder"}`}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="view-weather-btn"
            onClick={handleRecommendation}
          >
            {text[lang].btnSubmit}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
