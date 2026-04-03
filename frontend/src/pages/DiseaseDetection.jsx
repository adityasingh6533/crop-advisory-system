import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DiseaseDetection.css";
import { detectDisease } from "../api/diseaseApi";
import { getRecommendation } from "../api/leafKnowledge";

const text = {
  en: {
    title: "Crop Disease Detection",
    subtitle: "Upload a leaf image to detect crop disease using AI",
    uploadFirst: "Upload image first",
    analyzing: "Analyzing...",
    analyze: "Analyze Disease",
    note: "Supported: 14 crops, 38 classes (diseases + healthy leaves)",
    predicted: "Predicted Disease",
    confidence: "Confidence",
    cause: "Cause",
    treatment: "Treatment",
    prevention: "Prevention",
    analyzeAnother: "Analyze Another Image",
    continue: "Continue - Weather Advisory",
    predictionFailed: "Prediction failed",
  },
  hi: {
    title: "फसल रोग पहचान",
    subtitle: "पत्ते की फोटो अपलोड करें और AI से रोग पहचानें",
    uploadFirst: "पहले इमेज अपलोड करें",
    analyzing: "जांच हो रही है...",
    analyze: "रोग जांचें",
    note: "14 फसलें, 38 प्रकार के रोग समर्थित",
    predicted: "पहचाना गया रोग",
    confidence: "विश्वसनीयता",
    cause: "कारण",
    treatment: "उपचार",
    prevention: "बचाव",
    analyzeAnother: "नई इमेज जांचें",
    continue: "आगे बढ़ें - मौसम सलाह",
    predictionFailed: "पूर्वानुमान विफल",
  },
};

const DiseaseDetection = () => {
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang") === "hi" ? "hi" : "en";
  const t = text[lang];

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const compressImage = async (imageFile) => {
    const maxDimension = 900;
    const quality = 0.82;

    if (!imageFile.type.startsWith("image/")) {
      return imageFile;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    try {
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = objectUrl;
      });

      const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
      const targetWidth = Math.max(1, Math.round(img.width * ratio));
      const targetHeight = Math.max(1, Math.round(img.height * ratio));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return imageFile;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );

      if (!blob) return imageFile;

      return new File([blob], imageFile.name.replace(/\.[^.]+$/, ".jpg"), {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } catch {
      return imageFile;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleUpload = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const optimizedFile = await compressImage(selected);
    setFile(optimizedFile);
    setPreview(URL.createObjectURL(optimizedFile));
    setPrediction(null);
  };

  const analyze = async () => {
    if (!file) {
      alert(t.uploadFirst);
      return;
    }

    try {
      setLoading(true);
      const result = await detectDisease(file);
      const rec = getRecommendation(result.label, lang);

      setPrediction({
        label: result.label,
        confidence: Number(result.confidence || 0).toFixed(2),
        cause: rec?.title || result.label,
        treatment: rec?.management || [],
        prevention: rec?.prevention || [],
      });
    } catch (error) {
      alert(error?.message || t.predictionFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disease-page">
      <div className="overlay">
        <div className="disease-card">
          {!prediction && (
            <>
              <h1 className="disease-title">{t.title}</h1>
              <p className="disease-subtitle">{t.subtitle}</p>

              <div className="upload-box">
                <input type="file" accept="image/*" onChange={handleUpload} />
              </div>

              {preview && (
                <div className="preview">
                  <img src={preview} alt="preview" />
                </div>
              )}

              <button className="detect-btn" onClick={analyze} disabled={loading}>
                {loading ? t.analyzing : t.analyze}
              </button>

              <p className="note">{t.note}</p>
            </>
          )}

          {prediction && (
            <div className="result-ui">
              <h2 className="result-heading">{t.predicted}</h2>
              <h1 className="result-disease">{prediction.label}</h1>
              <div className="treatment-box">
                <h3>{t.cause}</h3>
                <p>{prediction.cause}</p>

                <h3>{t.treatment}</h3>
                <ul>
                  {prediction.treatment.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>

                <h3>{t.prevention}</h3>
                <ul>
                  {prediction.prevention.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="actions">
                <button className="detect-btn" onClick={() => setPrediction(null)}>
                  {t.analyzeAnother}
                </button>
                <button className="next-btn" onClick={() => navigate("/weather")}>
                  {t.continue}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;

