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
  if (riskLevel === "High") return "Ucch";
  if (riskLevel === "Moderate") return "Madhyam";
  return "Kam";
};

const translateValue = (value, lang, type) => {
  if (lang !== "hi") return value;

  const maps = {
    season: {
      Kharif: "Kharif",
      Rabi: "Rabi",
      Zaid: "Zaid",
      Annual: "Varshik",
    },
    soil: {
      Sandy: "Retili",
      Clay: "Chikni",
      Loamy: "Domat",
      Black: "Kaali",
      Red: "Laal",
      "Clay Loam": "Chikni Domat",
      "Sandy Loam": "Retili Domat",
    },
    irrigation: {
      Rainfed: "Varsha Aadharit",
      Canal: "Nahar",
      Borewell: "Borewell",
    },
    rainfall: {
      High: "Adhik",
      Moderate: "Madhyam",
      Low: "Kam",
    },
  };

  return maps[type]?.[value] || value;
};

const translateRuleReason = (reason, lang) => {
  if (lang !== "hi") return reason;

  const reasonMap = {
    "Requires standing water":
      "Is fasal ke liye khet me paryapt paani zaroori hai.",
    "High humidity supports growth":
      "Adhik nami is fasal ki vriddhi me sahayak hai.",
    "Clay soil retains moisture well":
      "Chikni mitti nami ko achchhi tarah banae rakhti hai.",
    "Good aeration required":
      "Achchhe vayusanchaar wali mitti upyukt hai.",
    "Moderate rainfall preferred":
      "Madhyam varsha iske liye upyukt rehti hai.",
    "Sensitive to waterlogging":
      "Jalbharav se yeh fasal prabhavit ho sakti hai.",
    "Black soil retains moisture":
      "Kaali mitti nami ko banae rakhti hai.",
    "Requires long warm season":
      "Lamba aur garm mausam iske liye anukool hai.",
    "Excess humidity invites pests":
      "Adhik nami se keeton ka khatra badhta hai.",
    "Short duration crop":
      "Yeh kam avadhi me taiyar hone wali fasal hai.",
    "Good nitrogen fixation":
      "Yeh mitti me nitrogen badhane me sahayak hai.",
    "Moderate water requirement":
      "Ise madhyam matra me paani chahiye.",
    "Tolerates very high temperature":
      "Yeh bahut adhik taapman sahan kar sakti hai.",
    "Thrives in sandy soils":
      "Yeh retili mitti me achchhi badhti hai.",
    "Well suited for rainfed areas":
      "Yeh varsha aadharit kshetron ke liye upyukt hai.",
    "Drought tolerant":
      "Yeh sukhe ko kaafi had tak sahan kar sakti hai.",
    "Less input intensive":
      "Isme apekshakrit kam lagat aur sansaadhan lagte hain.",
    "Needs balanced rainfall":
      "Ise santulit varsha ki zaroorat hoti hai.",
    "Fixes atmospheric nitrogen":
      "Yeh vaataavaran se nitrogen lekar mitti ko behtar banati hai.",
    "Deep rooting pattern":
      "Iski jadein gahraai tak jaati hain.",
    "Well-drained soil required":
      "Achchhi jalnikaasi wali mitti zaroori hai.",
    "Sensitive to excess moisture":
      "Adhik nami se yeh prabhavit hoti hai.",
    "Oilseed crop with stable demand":
      "Yeh tilhani fasal hai jiski maang sthir rehti hai.",
    "Cool climate required":
      "Ise thanda mausam chahiye.",
    "Sensitive to high temperature":
      "Adhik taapman se yeh prabhavit hoti hai.",
    "Needs controlled irrigation":
      "Ise niyantrit sinchai ki aavashyakta hoti hai.",
    "Low water requirement":
      "Ise kam paani ki zaroorat hoti hai.",
    "Oilseed crop": "Yeh ek tilhani fasal hai.",
    "Legume crop improves soil":
      "Dalahani fasal hone se yeh mitti ki gunwatta sudhaarti hai.",
    "Prefers dry climate":
      "Yeh shushk jalvayu me behtar rehti hai.",
    "Sensitive to excess water":
      "Adhik paani se yeh prabhavit hoti hai.",
    "Short duration pulse":
      "Yeh kam avadhi ki dalhani fasal hai.",
    "Needs cool, dry finish":
      "Antim badhavar ke samay thanda aur shushk mausam behtar hota hai.",
    "Improves soil nitrogen":
      "Yeh mitti me nitrogen badhane me madad karti hai.",
    "Prefers steady moisture":
      "Ise santulit nami pasand hai.",
    "Cool temperature requirement":
      "Ise thande taapman ki zaroorat hoti hai.",
    "High market demand":
      "Bazaar me iski maang adhik rehti hai.",
    "Needs steady irrigation":
      "Ise niyamit sinchai ki zaroorat hoti hai.",
    "Sensitive to frost":
      "Paala ise nuksaan pahuncha sakta hai.",
    "High labor intensity":
      "Isme shram adhik lagta hai.",
    "Requires warm temperature":
      "Ise garm taapman ki aavashyakta hoti hai.",
    "Sandy soil prevents waterlogging":
      "Retili mitti jalbharav ko rokti hai.",
    "Needs frequent light irrigation":
      "Ise thodi-thodi aur baar-baar sinchai chahiye.",
    "Fast growing vegetable":
      "Yeh tezi se badhne wali sabzi hai.",
    "Prefers warm climate":
      "Yeh garm jalvayu me achchhi rehti hai.",
    "Long duration crop":
      "Yeh lambi avadhi ki fasal hai.",
    "High water requirement":
      "Ise adhik paani ki aavashyakta hoti hai.",
    "High investment but high return":
      "Isme lagat adhik hai, lekin laabh bhi achchha mil sakta hai.",
  };

  return reasonMap[reason] || reason;
};

const evaluateTemperatureScore = (range, avgTemp, dynamicReasons, cropName, lang) => {
  const min = range?.min ?? avgTemp;
  const max = range?.max ?? avgTemp;

  if (avgTemp >= min && avgTemp <= max) {
    dynamicReasons.push(
      lang === "hi"
        ? `${cropName} ${min}C se ${max}C ke beech achchhe se badhti hai aur anumaanit ausat taapman ${avgTemp}C hai.`
        : `${cropName} thrives between ${min}C and ${max}C and the forecasted average is ${avgTemp}C.`
    );
    return 1.3;
  }

  const margin = 2;
  if (avgTemp >= min - margin && avgTemp <= max + margin) {
    dynamicReasons.push(
      lang === "hi"
        ? `${cropName} ki pasandida ${min}-${max}C seema ke kareeb vartamaan taapman ${avgTemp}C hai.`
        : `${cropName} is marginally within the preferred ${min}-${max}C range (current ${avgTemp}C).`
    );
    return 0.7;
  }

  dynamicReasons.push(
    lang === "hi"
      ? `${cropName} ke liye ${min}-${max}C behtar hai, lekin vartamaan ausat taapman ${avgTemp}C hai.`
      : `${cropName} prefers ${min}-${max}C but current average is ${avgTemp}C.`
  );
  return 0.2;
};

const scoreCropRule = (rule, context) => {
  const {
    soilN,
    soilType,
    irrigationN,
    irrigationType,
    avgTemp,
    seasonN,
    rainfallLevel,
    lang,
  } = context;
  const dynamicReasons = [];
  let score = 0;

  const soilMatch = rule.soil.some((soil) => toLower(soil) === soilN);
  if (soilMatch) {
    score += 1.5;
    dynamicReasons.push(
      lang === "hi"
        ? `${rule.crop} aapke diye gaye ${translateValue(soilType, lang, "soil")} mitti prakar ke liye upyukt hai.`
        : `${rule.crop} suits the ${soilType} soil you provided.`
    );
  } else {
    dynamicReasons.push(
      lang === "hi"
        ? `${rule.crop} ${rule.soil
            .map((soil) => translateValue(soil, lang, "soil"))
            .join(", ")} jaise mitti me behtar rehti hai.`
        : `${rule.crop} prefers soils like ${rule.soil.join(", ")}.`
    );
  }

  const irrigationMatch = rule.irrigation.some((irr) => toLower(irr) === irrigationN);
  if (irrigationMatch) {
    score += 1;
    dynamicReasons.push(
      lang === "hi"
        ? `${rule.crop} ${translateValue(irrigationType, lang, "irrigation")} sinchai ka achchha upayog kar sakti hai.`
        : `${rule.crop} can make good use of ${irrigationType} irrigation.`
    );
  } else {
    dynamicReasons.push(
      lang === "hi"
        ? `${rule.crop} aamtaur par ${rule.irrigation
            .map((irr) => translateValue(irr, lang, "irrigation"))
            .join(", ")} sinchai ke saath behtar rehti hai.`
        : `${rule.crop} typically pairs with ${rule.irrigation.join(", ")} irrigation.`
    );
  }

  score += evaluateTemperatureScore(rule.temp, avgTemp, dynamicReasons, rule.crop, lang);

  const rainfallScore = evaluateRainfallMatch(rule.rainfall, rainfallLevel);
  score += rainfallScore;
  if (rainfallScore >= 0.9) {
    dynamicReasons.push(
      lang === "hi"
        ? `Anumaanit ${translateValue(rainfallLevel, lang, "rainfall")} varsha ${rule.crop} ki ${translateValue(rule.rainfall, lang, "rainfall")} varsha aavashyakta se mel khaati hai.`
        : `Forecasted ${rainfallLevel} rain aligns with the ${rule.rainfall} requirement.`
    );
  } else {
    dynamicReasons.push(
      lang === "hi"
        ? `Varsha star ${translateValue(rainfallLevel, lang, "rainfall")} hai, jabki ${rule.crop} ko ${translateValue(rule.rainfall, lang, "rainfall")} varsha pasand hai.`
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
        ? "Buvai tab tak rokein jab tak agli do baarishon me kam se kam 5 mm varsha na ho jae."
        : "Hold off sowing until the next two rainfall events give at least 5mm each."
    );
  }

  if (rainfallLevel === "Low" && irrigationN === "rainfed") {
    plan.push(
      lang === "hi"
        ? "Poorak sinchai (drip/micro) ki yojana banaen ya sukha sahan karne wali fasal chunein."
        : "Plan supplemental irrigation (drip/micro) or pick a drought-resilient crop."
    );
  }

  if (hotDays >= 3) {
    plan.push(
      lang === "hi"
        ? "Garmi ke tanaav ko kam karne ke liye subah jaldi ya shaam ko sinchai karein."
        : "Water in the cooler hours (early morning/evening) to cut heat stress."
    );
  }

  if (rainyDays >= 5 && rainfallLevel === "High") {
    plan.push(
      lang === "hi"
        ? "Agli buvai se pehle khet ki jalnikaasi jaanch lein taki jalbharav se bacha ja sake."
        : "Check field drainage before the next sowing window to avoid waterlogging."
    );
  }

  if (plan.length === 0) {
    plan.push(
      lang === "hi"
        ? "Saamanya roop se aage badhein aur mausam me tez badlaav ke liye roz nazar rakhein."
        : "Proceed as normal and monitor the weather daily for sharp changes."
    );
  }

  return plan;
};

const i18n = {
  en: {
    sow: "Conditions are suitable for sowing.",
    delay: "Weather risk is high. Delay sowing.",
    noReliableMatch:
      "No strong rule-based crop match was found for the selected soil, season, irrigation, and forecast conditions.",
    noReliableAdvice:
      "Weather may be manageable, but the current rule set does not support a confident crop recommendation for these inputs.",
    tempRisk: "Temperature risk detected.",
    rainRisk: "Low rainfall detected.",
    heat: "Heat stress expected.",
    confidenceSuffix: " (real-time advisory)",
  },
  hi: {
    sow: "Buvai ke liye paristhitiyan anukool hain.",
    delay: "Mausam jokhim bhara hai. Buvai taalne ki salah hai.",
    noReliableMatch:
      "Diye gaye mitti, season, sinchai aur mausam ki sthitiyon ke liye koi majboot rule-based match nahi mila.",
    noReliableAdvice:
      "Mausam shayad sambhala ja sakta hai, lekin vartamaan rules in inputs par koi bharosemand crop recommendation nahi dete.",
    tempRisk: "Taapman se juda jokhim paaya gaya.",
    rainRisk: "Kam varsha paai gai.",
    heat: "Garmi ka tanaav ho sakta hai.",
    confidenceSuffix: " (real-time advisory)",
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

    const bestCrop = scored[0];
    const hasReliableMatch = Boolean(bestCrop && bestCrop.score >= 2.6);

    const recommendedCrops = hasReliableMatch
      ? scored
          .filter((item) => item.score >= 1.5)
          .slice(0, 4)
          .map((item) => item.crop)
      : [];

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

    const finalReasons = [...new Set([
      ...riskReasons,
      ...(bestCrop?.dynamicReasons || []),
      ...(bestCrop?.ruleReasons || []),
    ])];

    if (!hasReliableMatch) {
      finalReasons.unshift(t.noReliableMatch);
    }

    if (!finalReasons.length) {
      finalReasons.push(decision === "SOW_NOW" ? t.sow : t.delay);
    }

    const actionPlan = buildActionPlan({
      decision,
      rainfallLevel,
      irrigationN,
      hotDays,
      rainyDays,
      lang,
    });
    const matchFactor = bestCrop ? bestCrop.score : 0;
    const confidenceValue = hasReliableMatch
      ? Math.min(98, Math.max(55, 65 + Math.round(matchFactor * 8) - riskScore * 2))
      : Math.min(70, Math.max(35, 40 + Math.round(matchFactor * 6) - riskScore * 2));
    const confidence = `${confidenceValue}%${t.confidenceSuffix || ""}`;
    const advisory = hasReliableMatch
      ? decision === "SOW_NOW"
        ? t.sow
        : t.delay
      : t.noReliableAdvice;

    return res.json({
      location,
      decision,
      recommendedCrops,
      riskLevel: translateRiskLevel(riskLevel, lang),
      advisory,
      reasons: finalReasons,
      actionPlan,
      confidence,
    });
  } catch (err) {
    return res.status(500).json({ message: "Recommendation failed" });
  }
};

module.exports = { getCropRecommendation };
