const cropRules = require("../data/cropRules");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");
const toLower = (value) => normalizeText(value).toLowerCase();

const rainfallWeights = { low: 1, moderate: 2, high: 3 };

const determineRainfallLevel = (totalRain = 0) => {
  if (totalRain >= 50) return "High";
  if (totalRain >= 20) return "Moderate";
  if (totalRain > 0) return "Low";
  return "Low";
};

const evaluateRainfallMatch = (ruleRainfall, actualLevel) => {
  const ruleLevel = rainfallWeights[toLower(ruleRainfall)] || 2;
  const actual = rainfallWeights[toLower(actualLevel)] || 2;
  const diff = Math.abs(ruleLevel - actual);
  return Math.max(0.3, 1.2 - diff * 0.4);
};

const translateRiskLevel = (riskLevel, lang) => {
  if (lang !== "hi") return riskLevel;
  if (riskLevel === "High") return "उच्च";
  if (riskLevel === "Moderate") return "मध्यम";
  return "कम";
};

const translateValue = (value, lang, type) => {
  if (lang !== "hi") return value;

  const maps = {
    season: {
      Kharif: "खरीफ",
      Rabi: "रबी",
      Zaid: "जायद",
      Annual: "वार्षिक",
    },
    soil: {
      Sandy: "रेतीली",
      Clay: "चिकनी",
      Loamy: "दोमट",
      Black: "काली",
      Red: "लाल",
      "Clay Loam": "चिकनी दोमट",
      "Sandy Loam": "रेतीली दोमट",
    },
    irrigation: {
      Rainfed: "वर्षा आधारित",
      Canal: "नहर",
      Borewell: "बोरवेल",
    },
    rainfall: {
      High: "अधिक",
      Moderate: "मध्यम",
      Low: "कम",
    },
  };

  return maps[type]?.[value] || value;
};

const translateRuleReason = (reason, lang) => {
  if (lang !== "hi") return reason;

  const reasonMap = {
    "Requires standing water": "इस फसल के लिए खेत में पर्याप्त पानी जरूरी है।",
    "High humidity supports growth": "अधिक नमी इस फसल की वृद्धि में सहायक है।",
    "Clay soil retains moisture well": "चिकनी मिट्टी नमी को अच्छी तरह बनाए रखती है।",
    "Good aeration required": "अच्छे वायुसंचार वाली मिट्टी उपयुक्त है।",
    "Moderate rainfall preferred": "मध्यम वर्षा इसके लिए उपयुक्त रहती है।",
    "Sensitive to waterlogging": "जलभराव से यह फसल प्रभावित हो सकती है।",
    "Black soil retains moisture": "काली मिट्टी नमी को बनाए रखती है।",
    "Requires long warm season": "लंबा और गर्म मौसम इसके लिए अनुकूल है।",
    "Excess humidity invites pests": "अधिक नमी से कीटों का खतरा बढ़ता है।",
    "Short duration crop": "यह कम अवधि में तैयार होने वाली फसल है।",
    "Good nitrogen fixation": "यह मिट्टी में नाइट्रोजन बढ़ाने में सहायक है।",
    "Moderate water requirement": "इसे मध्यम मात्रा में पानी चाहिए।",
    "Tolerates very high temperature": "यह बहुत अधिक तापमान सहन कर सकती है।",
    "Thrives in sandy soils": "यह रेतीली मिट्टी में अच्छी बढ़ती है।",
    "Well suited for rainfed areas": "यह वर्षा आधारित क्षेत्रों के लिए उपयुक्त है।",
    "Drought tolerant": "यह सूखे को काफी हद तक सहन कर सकती है।",
    "Less input intensive": "इसमें अपेक्षाकृत कम लागत और संसाधन लगते हैं।",
    "Needs balanced rainfall": "इसे संतुलित वर्षा की जरूरत होती है।",
    "Fixes atmospheric nitrogen": "यह वातावरण से नाइट्रोजन लेकर मिट्टी को बेहतर बनाती है।",
    "Deep rooting pattern": "इसकी जड़ें गहराई तक जाती हैं।",
    "Well-drained soil required": "अच्छी जलनिकासी वाली मिट्टी जरूरी है।",
    "Sensitive to excess moisture": "अधिक नमी से यह प्रभावित होती है।",
    "Oilseed crop with stable demand": "यह तिलहनी फसल है जिसकी मांग स्थिर रहती है।",
    "Cool climate required": "इसे ठंडा मौसम चाहिए।",
    "Sensitive to high temperature": "अधिक तापमान से यह प्रभावित होती है।",
    "Needs controlled irrigation": "इसे नियंत्रित सिंचाई की आवश्यकता होती है।",
    "Low water requirement": "इसे कम पानी की जरूरत होती है।",
    "Oilseed crop": "यह एक तिलहनी फसल है।",
    "Legume crop improves soil": "दलहनी फसल होने से यह मिट्टी की गुणवत्ता सुधारती है।",
    "Prefers dry climate": "यह शुष्क जलवायु में बेहतर रहती है।",
    "Sensitive to excess water": "अधिक पानी से यह प्रभावित होती है।",
    "Short duration pulse": "यह कम अवधि की दलहनी फसल है।",
    "Needs cool, dry finish": "अंतिम बढ़वार के समय ठंडा और शुष्क मौसम बेहतर होता है।",
    "Improves soil nitrogen": "यह मिट्टी में नाइट्रोजन बढ़ाने में मदद करती है।",
    "Prefers steady moisture": "इसे संतुलित नमी पसंद है।",
    "Cool temperature requirement": "इसे ठंडे तापमान की जरूरत होती है।",
    "High market demand": "बाजार में इसकी मांग अधिक रहती है।",
    "Needs steady irrigation": "इसे नियमित सिंचाई की जरूरत होती है।",
    "Sensitive to frost": "पाला इसे नुकसान पहुंचा सकता है।",
    "High labor intensity": "इसमें श्रम अधिक लगता है।",
    "Requires warm temperature": "इसे गर्म तापमान की आवश्यकता होती है।",
    "Sandy soil prevents waterlogging": "रेतीली मिट्टी जलभराव को रोकती है।",
    "Needs frequent light irrigation": "इसे थोड़ी-थोड़ी और बार-बार सिंचाई चाहिए।",
    "Fast growing vegetable": "यह तेजी से बढ़ने वाली सब्जी है।",
    "Prefers warm climate": "यह गर्म जलवायु में अच्छी रहती है।",
    "Long duration crop": "यह लंबी अवधि की फसल है।",
    "High water requirement": "इसे अधिक पानी की आवश्यकता होती है।",
    "High investment but high return": "इसमें लागत अधिक है, लेकिन लाभ भी अच्छा मिल सकता है।",
  };

  return reasonMap[reason] || reason;
};

const evaluateTemperatureScore = (range, avgTemp, dynamicReasons, cropName, lang) => {
  const min = range?.min ?? avgTemp;
  const max = range?.max ?? avgTemp;

  if (avgTemp >= min && avgTemp <= max) {
    dynamicReasons.push(
      lang === "hi"
        ? `${cropName} ${min}°C से ${max}°C के बीच अच्छे से बढ़ती है और अनुमानित औसत तापमान ${avgTemp}°C है।`
        : `${cropName} thrives between ${min}°C and ${max}°C and the forecasted average is ${avgTemp}°C.`
    );
    return 1.3;
  }

  const margin = 2;
  if (avgTemp >= min - margin && avgTemp <= max + margin) {
    dynamicReasons.push(
      lang === "hi"
        ? `${cropName} की पसंदीदा ${min}-${max}°C सीमा के करीब वर्तमान तापमान ${avgTemp}°C है।`
        : `${cropName} is marginally within the preferred ${min}-${max}°C range (current ${avgTemp}°C).`
    );
    return 0.7;
  }

  dynamicReasons.push(
    lang === "hi"
      ? `${cropName} के लिए ${min}-${max}°C बेहतर है, लेकिन वर्तमान औसत तापमान ${avgTemp}°C है।`
      : `${cropName} prefers ${min}-${max}°C but current average is ${avgTemp}°C.`
  );
  return 0.2;
};

const scoreCropRule = (rule, context) => {
  const { soilN, soilType, irrigationN, irrigationType, avgTemp, seasonN, rainfallLevel, lang } = context;
  const dynamicReasons = [];
  let score = 0;

  const soilMatch = rule.soil.some((soil) => toLower(soil) === soilN);
  if (soilMatch) {
    score += 1.5;
    dynamicReasons.push(
      lang === "hi"
        ? `${rule.crop} आपके दिए गए ${translateValue(soilType, lang, "soil")} मिट्टी प्रकार के लिए उपयुक्त है।`
        : `${rule.crop} suits the ${soilType} soil you provided.`
    );
  } else {
    dynamicReasons.push(
      lang === "hi"
        ? `${rule.crop} ${rule.soil.map((soil) => translateValue(soil, lang, "soil")).join(", ")} जैसी मिट्टी में बेहतर रहती है।`
        : `${rule.crop} prefers soils like ${rule.soil.join(", ")}.`
    );
  }

  const irrigationMatch = rule.irrigation.some((irr) => toLower(irr) === irrigationN);
  if (irrigationMatch) {
    score += 1;
    dynamicReasons.push(
      lang === "hi"
        ? `${rule.crop} ${translateValue(irrigationType, lang, "irrigation")} सिंचाई का अच्छा उपयोग कर सकती है।`
        : `${rule.crop} can make good use of ${irrigationType} irrigation.`
    );
  } else {
    dynamicReasons.push(
      lang === "hi"
        ? `${rule.crop} आमतौर पर ${rule.irrigation.map((irr) => translateValue(irr, lang, "irrigation")).join(", ")} सिंचाई के साथ बेहतर रहती है।`
        : `${rule.crop} typically pairs with ${rule.irrigation.join(", ")} irrigation.`
    );
  }

  score += evaluateTemperatureScore(rule.temp, avgTemp, dynamicReasons, rule.crop, lang);

  const rainfallScore = evaluateRainfallMatch(rule.rainfall, rainfallLevel);
  score += rainfallScore;
  if (rainfallScore >= 0.9) {
    dynamicReasons.push(
      lang === "hi"
        ? `अनुमानित ${translateValue(rainfallLevel, lang, "rainfall")} वर्षा ${rule.crop} की ${translateValue(rule.rainfall, lang, "rainfall")} वर्षा आवश्यकता से मेल खाती है।`
        : `Forecasted ${rainfallLevel} rain aligns with the ${rule.rainfall} requirement.`
    );
  } else {
    dynamicReasons.push(
      lang === "hi"
        ? `वर्षा स्तर ${translateValue(rainfallLevel, lang, "rainfall")} है, जबकि ${rule.crop} को ${translateValue(rule.rainfall, lang, "rainfall")} वर्षा पसंद है।`
        : `Rainfall is ${rainfallLevel} while ${rule.crop} prefers ${rule.rainfall} rain.`
    );
  }

  const normalizedSeason = toLower(rule.season);
  if (normalizedSeason === seasonN) {
    score += 0.8;
  } else if (normalizedSeason === "annual") {
    score += 0.35;
  }

  return {
    crop: rule.crop,
    score: Number(Math.max(0, score).toFixed(2)),
    dynamicReasons,
    ruleReasons: (rule.reasons || []).map((reason) => translateRuleReason(reason, lang)),
  };
};

const buildActionPlan = ({ decision, rainfallLevel, irrigationN, hotDays, rainyDays, lang }) => {
  const plan = [];

  if (decision === "DELAY_SOWING") {
    plan.push(
      lang === "hi"
        ? "बुवाई तब तक रोकें जब तक अगली दो बारिशों में कम से कम 5 मिमी वर्षा न हो जाए।"
        : "Hold off sowing until the next two rainfall events give at least 5mm each."
    );
  }

  if (rainfallLevel === "Low" && irrigationN === "rainfed") {
    plan.push(
      lang === "hi"
        ? "पूरक सिंचाई (ड्रिप/माइक्रो) की योजना बनाएं या सूखा सहन करने वाली फसल चुनें।"
        : "Plan supplemental irrigation (drip/micro) or pick a drought-resilient crop."
    );
  }

  if (hotDays >= 3) {
    plan.push(
      lang === "hi"
        ? "गर्मी के तनाव को कम करने के लिए सुबह जल्दी या शाम को सिंचाई करें।"
        : "Water in the cooler hours (early morning/evening) to cut heat stress."
    );
  }

  if (rainyDays >= 5 && rainfallLevel === "High") {
    plan.push(
      lang === "hi"
        ? "अगली बुवाई से पहले खेत की जलनिकासी जांच लें ताकि जलभराव से बचा जा सके।"
        : "Check field drainage before the next sowing window to avoid waterlogging."
    );
  }

  if (plan.length === 0) {
    plan.push(
      lang === "hi"
        ? "सामान्य रूप से आगे बढ़ें और मौसम में तेज बदलाव के लिए रोज नजर रखें।"
        : "Proceed as normal and monitor the weather daily for sharp changes."
    );
  }

  return plan;
};

const i18n = {
  en: {
    sow: "Conditions are suitable for sowing.",
    delay: "Weather risk is high. Delay sowing.",
    tempRisk: "Temperature risk detected.",
    rainRisk: "Low rainfall detected.",
    heat: "Heat stress expected.",
    confidenceSuffix: " (real-time advisory)",
  },
  hi: {
    sow: "बुवाई के लिए परिस्थितियां अनुकूल हैं।",
    delay: "मौसम जोखिम भरा है। बुवाई टालने की सलाह है।",
    tempRisk: "तापमान से जुड़ा जोखिम पाया गया।",
    rainRisk: "कम वर्षा पाई गई।",
    heat: "गर्मी का तनाव हो सकता है।",
    confidenceSuffix: " (रियल-टाइम मौसम डेटा)",
  },
};

const getCropRecommendation = (req, res) => {
  try {
    const { cropInput, weatherSummary, lang = "en" } = req.body;

    if (!cropInput || !weatherSummary) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    const { season, soilType, irrigationType, location } = cropInput;
    const { avgTemp = 0, totalRain = 0, rainyDays = 0, hotDays = 0 } = weatherSummary;

    const seasonN = toLower(season);
    const soilN = toLower(soilType);
    const irrigationN = toLower(irrigationType);
    const t = i18n[lang] || i18n.en;

    const rainfallLevel = determineRainfallLevel(totalRain);
    const context = {
      soilN,
      soilType,
      irrigationN,
      irrigationType,
      avgTemp,
      seasonN,
      rainfallLevel,
      lang,
    };

    const seasonSpecificRules = cropRules.filter(
      (rule) => toLower(rule.season) === seasonN || toLower(rule.season) === "annual"
    );
    const candidateRules = seasonSpecificRules.length ? seasonSpecificRules : cropRules;

    const scored = candidateRules.map((rule) => scoreCropRule(rule, context));
    scored.sort((a, b) => b.score - a.score);

    const recommendedCrops = scored
      .filter((item) => item.score >= 1.5)
      .slice(0, 4)
      .map((item) => item.crop);

    if (!recommendedCrops.length && scored.length > 0) {
      recommendedCrops.push(scored[0].crop);
    }

    let riskScore = 0;
    const riskReasons = [];

    if (avgTemp > 38 || avgTemp < 12) {
      riskScore += 2;
      riskReasons.push(t.tempRisk);
    }

    if (irrigationN === "rainfed" && rainfallLevel === "Low" && rainyDays < 3) {
      riskScore += 2;
      riskReasons.push(t.rainRisk);
    }

    if (hotDays >= 3 && avgTemp > 32) {
      riskScore += 1;
      riskReasons.push(t.heat);
    }

    const decision = riskScore >= 4 ? "DELAY_SOWING" : "SOW_NOW";
    const riskLevel = riskScore >= 5 ? "High" : riskScore >= 3 ? "Moderate" : "Low";

    const bestCrop = scored[0];
    const finalReasons = [...new Set([
      ...riskReasons,
      ...(bestCrop?.dynamicReasons || []),
      ...(bestCrop?.ruleReasons || []),
    ])];

    if (!finalReasons.length) {
      finalReasons.push(decision === "SOW_NOW" ? t.sow : t.delay);
    }

    const actionPlan = buildActionPlan({ decision, rainfallLevel, irrigationN, hotDays, rainyDays, lang });
    const matchFactor = bestCrop ? bestCrop.score : 0;
    const confidenceValue = Math.min(98, Math.max(55, 65 + Math.round(matchFactor * 8) - riskScore * 2));
    const confidence = `${confidenceValue}%${t.confidenceSuffix || ""}`;

    return res.json({
      location,
      decision,
      recommendedCrops,
      riskLevel: translateRiskLevel(riskLevel, lang),
      advisory: decision === "SOW_NOW" ? t.sow : t.delay,
      reasons: finalReasons,
      actionPlan,
      confidence,
    });
  } catch (err) {
    return res.status(500).json({ message: "Recommendation failed" });
  }
};

module.exports = { getCropRecommendation };
