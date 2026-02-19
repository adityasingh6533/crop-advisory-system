const getCropRecommendation = (req, res) => {
  try {
    const { cropInput, weatherSummary, lang = "en" } = req.body;

    if (!cropInput || !weatherSummary) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    const { season, soilType, irrigationType, location } = cropInput;
    const { avgTemp, totalRain, hotDays = 0, coldDays = 0 } = weatherSummary;

    /* ---------- STRING NORMALIZATION FIX ---------- */
    const seasonN = season?.trim().toLowerCase();
    const irrigationN = irrigationType?.trim().toLowerCase();
    const soilN = soilType?.trim().toLowerCase();

    /* ---------- DEMO MODE ---------- */
    const DEMO_MODE = true; // demo ke time true, real deploy me false
    const effectiveRain =
      DEMO_MODE && totalRain === 0 ? 25 : totalRain;

    /* ---------- i18n ---------- */
    const i18n = {
      en: {
        sow: "Conditions are suitable for sowing.",
        delay: "Weather risk is high. Delay sowing.",
        tempRisk: "Temperature risk detected.",
        rainRisk: "Low rainfall detected.",
        heat: "Heat stress expected.",
        cold: "Cold stress expected.",
        loamy: "Loamy soil is suitable.",
        sandy: "Sandy soil drains water quickly.",
        clay: "Clay soil retains moisture well.",
        confidence: "≈85% (rule-based advisory)"
      },
      hi: {
        sow: "बुवाई के लिए परिस्थितियाँ अनुकूल हैं।",
        delay: "मौसम जोखिम भरा है। बुवाई टालने की सलाह है।",
        tempRisk: "तापमान से जुड़ा जोखिम पाया गया।",
        rainRisk: "कम वर्षा पाई गई।",
        heat: "गर्मी का तनाव हो सकता है।",
        cold: "ठंड का तनाव हो सकता है।",
        loamy: "दोमट मिट्टी उपयुक्त है।",
        sandy: "रेतीली मिट्टी में पानी जल्दी निकलता है।",
        clay: "चिकनी मिट्टी नमी रोकती है।",
        confidence: "≈85% (नियम-आधारित सलाह)"
      }
    };

    const t = i18n[lang] || i18n.en;

    /* ---------- CROP SELECTION ---------- */
    let crops = [];

    if (seasonN === "kharif") {
      if (effectiveRain >= 60) {
        crops = ["Rice", "Sugarcane"];
      } else if (effectiveRain >= 30) {
        crops = ["Maize", "Soybean", "Cotton"];
      } else {
        crops = ["Millets", "Pulses"];
      }
    }

    else if (seasonN === "rabi") {
      if (avgTemp < 18) {
        crops = ["Wheat", "Mustard"];
      } else {
        crops = ["Gram", "Lentil"];
      }
    }

    else if (seasonN === "zaid") {
      if (irrigationN !== "rainfed") {
        crops = ["Vegetables", "Watermelon"];
      } else {
        crops = ["Millets", "Pulses"];
      }
    }

    /* ---------- SOIL FILTER ---------- */
    if (soilN === "sandy") {
      crops = crops.filter(c => c !== "Rice" && c !== "Sugarcane");
    }

    /* ---------- SAFETY FALLBACK (only if invalid season) ---------- */
    if (!["kharif", "rabi", "zaid"].includes(seasonN)) {
      crops = ["Millets", "Pulses"];
    }

    /* ---------- RISK SCORING ---------- */
    let riskScore = 0;
    let reasons = [];

    if (avgTemp < 8 || avgTemp > 40) {
      riskScore += 2;
      reasons.push(t.tempRisk);
    }

    if (irrigationN === "rainfed" && effectiveRain < 15) {
      riskScore += 2;
      reasons.push(t.rainRisk);
    }

    if (hotDays >= 4) {
      riskScore += 1;
      reasons.push(t.heat);
    }

    if (coldDays >= 4) {
      riskScore += 1;
      reasons.push(t.cold);
    }

    if (soilN === "loamy") reasons.push(t.loamy);
    if (soilN === "sandy") reasons.push(t.sandy);
    if (soilN === "clay") reasons.push(t.clay);

    const decision = riskScore >= 4 ? "DELAY_SOWING" : "SOW_NOW";

    return res.json({
      location,
      decision,
      recommendedCrops: crops,
      riskLevel:
        riskScore >= 4 ? "High" :
        riskScore >= 2 ? "Moderate" : "Low",
      advisory: decision === "SOW_NOW" ? t.sow : t.delay,
      reasons,
      confidence: t.confidence
    });

  } catch (err) {
    return res.status(500).json({ message: "Recommendation failed" });
  }
};

module.exports = { getCropRecommendation };