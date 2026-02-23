import "../css/CropRecommendation.css";
import { createCropInput } from "../api/CropInputApi";
import { useEffect } from "react";
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
    optionsSoil: ["Select soil type", "Sandy", "Clay", "Loamy", "Black", "Red"],
    optionsSeason: ["Select season", "Kharif", "Rabi", "Zaid"],
    optionsIrrigation: ["Select irrigation", "Rainfed", "Canal", "Borewell"]
  },
  hi: {
    heading: "फसल अनुशंसा",
    subtitle: "अपनी भूमि के लिए उपयुक्त फसलें जानने के लिए बुनियादी विवरण दें",
    labelLocation: "स्थान / जिला",
    phLocation: "जैसे: लखनऊ",
    labelSoil: "मिट्टी का प्रकार",
    labelSeason: "सीजन (ऋतु)",
    labelIrrigation: "सिंचाई का प्रकार",
    btnSubmit: "मौसम देखें",
    alertRequired: "सभी फ़ील्ड अनिवार्य हैं!",
    alertSuccess: "फसल इनपुट सफलतापूर्वक जमा हो गया!",
    optionsSoil: ["मिट्टी का प्रकार चुनें", "रेतीली (Sandy)", "चिकनी (Clay)", "दोमट (Loamy)", "काली (Black)", "लाल (Red)"],
    optionsSeason: ["सीजन चुनें", "खरीफ", "रबी", "जायद"],
    optionsIrrigation: ["सिंचाई चुनें", "वर्षा आधारित (Rainfed)", "नहर (Canal)", "बोरवेल"]
  }
};

const CropRecommendation = () => {
  const navigate = useNavigate();

  
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
      soilType === text[lang].optionsSoil[0] ||
      season === text[lang].optionsSeason[0] ||
      irrigationType === text[lang].optionsIrrigation[0]
    ) {
      alert(text[lang].alertRequired);
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
      sessionStorage.setItem("CropInput", JSON.stringify(response.cropInput));
      alert(text[lang].alertSuccess);
      navigate("/weather");
    } catch (error) {
      console.error("Error submitting crop input:", error);
      alert("Error: " + error.message);
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
            <input type="text" placeholder={text[lang].phLocation} />
          </div>

          <div className="form-group">
            <label>{text[lang].labelSoil}</label>
            <select>
              {text[lang].optionsSoil.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{text[lang].labelSeason}</label>
            <select>
              {text[lang].optionsSeason.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{text[lang].labelIrrigation}</label>
            <select>
              {text[lang].optionsIrrigation.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
          </div>

          <button type="button" className="view-weather-btn" onClick={handleRecommendation}>
            {text[lang].btnSubmit}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
