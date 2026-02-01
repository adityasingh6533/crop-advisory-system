const getCropRecommendation = (req, res) => {
  try {
    const { cropInput, weatherSummary } = req.body;

    if (!cropInput || !weatherSummary) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    const { season, soilType, irrigationType } = cropInput;
    const {
      avgTemp,
      totalRain,
      rainyDays,
      hotDays,
      coldDays,
      humidityAvg,
      windRisk
    } = weatherSummary;

    let crops = [];
    let reasons = [];
    let risk = "Low";
    let advisory = "Conditions are suitable for sowing.";

    /* =========================
       🌡️ TEMPERATURE RULES
    ========================== */

    if (avgTemp < 10) {
      crops.push("Wheat", "Barley", "Mustard");
      reasons.push("Low temperature suitable for rabi crops");
    }

    if (avgTemp >= 10 && avgTemp <= 20) {
      crops.push("Pea", "Gram", "Lentil");
      reasons.push("Moderate temperature favors legumes");
    }

    if (avgTemp > 20 && avgTemp <= 30) {
      crops.push("Rice", "Maize", "Cotton", "Soybean");
      reasons.push("Warm climate supports kharif crops");
    }

    if (avgTemp > 30) {
      crops.push("Millet", "Sorghum", "Groundnut");
      reasons.push("Heat-tolerant crops recommended");
      risk = "Moderate";
    }

    /* =========================
       🌧️ RAINFALL RULES
    ========================== */

    if (totalRain < 50) {
      reasons.push("Low rainfall detected");
      advisory = "Irrigation planning is required";
      risk = "Moderate";
    }

    if (totalRain >= 50 && totalRain <= 150) {
      reasons.push("Moderate rainfall supports healthy crop growth");
    }

    if (totalRain > 150) {
      crops.push("Rice", "Jute");
      reasons.push("High rainfall favors water-loving crops");
      risk = "Moderate";
    }

    if (rainyDays >= 7) {
      reasons.push("Consistent rainfall expected");
    }

    /* =========================
       🔥 HEAT STRESS CHECK
    ========================== */

    if (hotDays >= 4) {
      risk = "High";
      advisory = "High heat stress detected. Avoid sensitive crops.";
      crops = crops.filter(
        c => !["Wheat", "Barley", "Mustard"].includes(c)
      );
    }

    /* =========================
       ❄️ COLD STRESS CHECK
    ========================== */

    if (coldDays >= 4) {
      advisory = "Cold stress possible. Delay sowing if needed.";
      crops.push("Mustard", "Pea");
    }

    /* =========================
       💧 HUMIDITY RULES
    ========================== */

    if (humidityAvg > 75) {
      reasons.push("High humidity increases disease risk");
      advisory += " Use fungicide prevention.";
      risk = "Moderate";
    }

    /* =========================
       🌪️ WIND RISK
    ========================== */

    if (windRisk === "High") {
      reasons.push("Strong winds may damage tall crops");
      crops = crops.filter(
        c => !["Sugarcane", "Maize"].includes(c)
      );
      risk = "Moderate";
    }

    /* =========================
       🌱 SOIL TYPE RULES
    ========================== */

    if (soilType === "Sandy") {
      crops.push("Groundnut", "Millet");
      reasons.push("Sandy soil drains quickly");
    }

    if (soilType === "Clay") {
      crops.push("Rice", "Wheat");
      reasons.push("Clay soil retains moisture well");
    }

    if (soilType === "Loamy") {
      crops.push("Vegetables", "Pulses");
      reasons.push("Loamy soil is highly fertile");
    }

    /* =========================
       🚰 IRRIGATION RULES
    ========================== */

    if (irrigationType === "Rainfed" && totalRain < 60) {
      advisory = "Rainfed farming risky due to low rainfall";
      risk = "High";
    }

    if (irrigationType === "Canal") {
      reasons.push("Stable irrigation available");
    }

    if (irrigationType === "Borewell") {
      reasons.push("Groundwater irrigation available");
    }

    /* =========================
       🌾 SEASON RULES
    ========================== */

    if (season === "Rabi") {
      crops = crops.filter(c =>
        ["Wheat", "Mustard", "Gram", "Pea"].includes(c)
      );
    }

    if (season === "Kharif") {
      crops = crops.filter(c =>
        ["Rice", "Maize", "Cotton", "Soybean"].includes(c)
      );
    }

    if (season === "Zaid") {
      crops = crops.filter(c =>
        ["Vegetables", "Watermelon", "Cucumber"].includes(c)
      );
    }

    /* =========================
       🧹 CLEANUP
    ========================== */

    crops = [...new Set(crops)];

    if (crops.length === 0) {
      crops.push("Consult local expert");
      advisory = "Weather conditions are unstable";
      risk = "High";
    }

    /* =========================
       ✅ FINAL RESPONSE
    ========================== */

    return res.json({
      location: cropInput.location,
      crops,
      riskLevel: risk,
      advisory,
      reasons
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Recommendation failed" });
  }
};

module.exports = { getCropRecommendation };