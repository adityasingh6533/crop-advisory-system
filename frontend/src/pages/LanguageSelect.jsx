import { useNavigate } from "react-router-dom";
import "../css/LanguageSelect.css";

const LanguageSelect = () => {
  const navigate = useNavigate();

  const selectLang = (lang) => {
    localStorage.setItem("lang", lang);
    navigate("/home");
  };

  return (
    <div className="lang-page">
      <div className="lang-overlay">
        <h1>Select Language / भाषा चुनें</h1>

        <div className="lang-buttons">
          <button onClick={() => selectLang("en")}>English</button>
          <button onClick={() => selectLang("hi")}>हिंदी</button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;