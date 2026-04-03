const KNOWLEDGE = {
  healthy: {
    en: {
      title: "Healthy Plant",
      medicine: "No treatment required",
      dose: "-",
      interval: "-",
      management: [
        "Maintain proper irrigation.",
        "Apply balanced fertilizer.",
        "Monitor leaves weekly for early symptoms.",
      ],
      prevention: ["Keep field and tools clean."],
    },
    hi: {
      title: "स्वस्थ पौधा",
      medicine: "किसी दवा की आवश्यकता नहीं",
      dose: "-",
      interval: "-",
      management: [
        "संतुलित सिंचाई बनाए रखें।",
        "संतुलित उर्वरक का उपयोग करें।",
        "पत्तों की साप्ताहिक निगरानी करें।",
      ],
      prevention: ["खेत और उपकरण साफ रखें।"],
    },
  },
  fungal_leaf: {
    en: {
      title: "Fungal Leaf Infection",
      medicine: "Mancozeb / Chlorothalonil (as locally approved)",
      dose: "2-3 g per liter water",
      interval: "Every 7 days (2-3 sprays)",
      management: [
        "Remove infected leaves and debris.",
        "Avoid overhead irrigation.",
        "Improve air circulation in canopy.",
      ],
      prevention: ["Follow crop rotation.", "Irrigate in morning hours."],
    },
    hi: {
      title: "फफूंद जनित पत्ती रोग",
      medicine: "मैनकोजेब / क्लोरोथालोनिल (स्थानीय सलाह अनुसार)",
      dose: "2-3 ग्राम प्रति लीटर पानी",
      interval: "हर 7 दिन (2-3 छिड़काव)",
      management: [
        "संक्रमित पत्तियां और अवशेष हटाएं।",
        "ऊपरी सिंचाई से बचें।",
        "पौधों में हवा का प्रवाह बढ़ाएं।",
      ],
      prevention: ["फसल चक्र अपनाएं।", "सुबह सिंचाई करें।"],
    },
  },
  fungal_rust: {
    en: {
      title: "Rust Fungal Infection",
      medicine: "Propiconazole (as locally approved)",
      dose: "1 ml per liter water",
      interval: "Every 5-7 days",
      management: [
        "Remove heavily infected leaves.",
        "Reduce canopy humidity.",
        "Use resistant varieties in next cycle.",
      ],
      prevention: ["Avoid dense planting.", "Use clean planting material."],
    },
    hi: {
      title: "रस्ट फफूंद रोग",
      medicine: "प्रोपिकोनाजोल (स्थानीय सलाह अनुसार)",
      dose: "1 मि.ली. प्रति लीटर पानी",
      interval: "हर 5-7 दिन",
      management: [
        "अधिक संक्रमित पत्तियां हटाएं।",
        "नमी कम रखें और वेंटिलेशन बढ़ाएं।",
        "अगली फसल में प्रतिरोधी किस्में लगाएं।",
      ],
      prevention: ["घनी बुवाई से बचें।", "स्वच्छ रोपण सामग्री उपयोग करें।"],
    },
  },
  bacterial: {
    en: {
      title: "Bacterial Infection",
      medicine: "Copper oxychloride / approved bactericide",
      dose: "2 g per liter water",
      interval: "Every 5-7 days",
      management: [
        "Avoid handling wet plants.",
        "Remove infected leaves quickly.",
        "Disinfect pruning tools.",
      ],
      prevention: ["Use certified seeds/seedlings."],
    },
    hi: {
      title: "बैक्टीरियल रोग",
      medicine: "कॉपर ऑक्सीक्लोराइड / स्वीकृत बैक्टीरिसाइड",
      dose: "2 ग्राम प्रति लीटर पानी",
      interval: "हर 5-7 दिन",
      management: [
        "गीले पौधों को न छुएं।",
        "संक्रमित पत्तियां तुरंत हटाएं।",
        "उपकरणों को कीटाणुरहित रखें।",
      ],
      prevention: ["प्रमाणित बीज/रोपाई का उपयोग करें।"],
    },
  },
  viral: {
    en: {
      title: "Viral Infection",
      medicine: "No direct curative spray",
      dose: "-",
      interval: "-",
      management: [
        "Remove severely infected plants.",
        "Control vectors (whitefly/aphids).",
        "Disinfect tools and hands regularly.",
      ],
      prevention: ["Use resistant varieties and clean nursery stock."],
    },
    hi: {
      title: "वायरल रोग",
      medicine: "सीधा उपचार उपलब्ध नहीं",
      dose: "-",
      interval: "-",
      management: [
        "अधिक संक्रमित पौधे हटा दें।",
        "व्हाइटफ्लाई/एफिड जैसे वाहकों को नियंत्रित करें।",
        "उपकरण और हाथ नियमित रूप से साफ करें।",
      ],
      prevention: ["प्रतिरोधी किस्में और साफ रोपाई सामग्री उपयोग करें।"],
    },
  },
  pest: {
    en: {
      title: "Pest / Mite Infestation",
      medicine: "Use approved miticide/insecticide only if threshold is reached",
      dose: "As per label and local advisory",
      interval: "Repeat as per product interval",
      management: [
        "Remove heavily infested leaves.",
        "Spray water on leaf undersides to reduce mite load.",
        "Monitor population before re-spray.",
      ],
      prevention: ["Maintain plant vigor and avoid water stress."],
    },
    hi: {
      title: "कीट / माइट प्रकोप",
      medicine: "सीमा पार होने पर ही स्वीकृत माइटिसाइड/कीटनाशी उपयोग करें",
      dose: "लेबल और स्थानीय सलाह अनुसार",
      interval: "उत्पाद निर्देश अनुसार दोहराएं",
      management: [
        "अधिक प्रभावित पत्तियां हटाएं।",
        "पत्तियों के नीचे पानी का स्प्रे करें।",
        "फिर से छिड़काव से पहले निगरानी करें।",
      ],
      prevention: ["पौधे को तनाव-मुक्त और संतुलित स्थिति में रखें।"],
    },
  },
  bacterial_vector: {
    en: {
      title: "Vector-borne Bacterial Disease",
      medicine: "No complete cure after severe infection",
      dose: "-",
      interval: "-",
      management: [
        "Control insect vector aggressively.",
        "Remove severely affected plants/trees.",
        "Use certified disease-free nursery material.",
      ],
      prevention: ["Frequent scouting and vector management program."],
    },
    hi: {
      title: "वाहक-जनित बैक्टीरियल रोग",
      medicine: "गंभीर संक्रमण के बाद पूर्ण उपचार कठिन",
      dose: "-",
      interval: "-",
      management: [
        "कीट वाहकों का सख्त नियंत्रण करें।",
        "अधिक संक्रमित पौधे/पेड़ हटाएं।",
        "प्रमाणित रोग-मुक्त रोपाई का उपयोग करें।",
      ],
      prevention: ["नियमित निगरानी और वेक्टर नियंत्रण कार्यक्रम अपनाएं।"],
    },
  },
};

const CLASS_TYPE_BY_LABEL = {
  "Apple Scab": "fungal_leaf",
  "Apple Black Rot": "fungal_leaf",
  "Apple Cedar Rust": "fungal_rust",
  "Apple Healthy": "healthy",
  "Blueberry Healthy": "healthy",
  "Cherry Powdery Mildew": "fungal_leaf",
  "Cherry Healthy": "healthy",
  "Corn Cercospora Leaf Spot": "fungal_leaf",
  "Corn Common Rust": "fungal_rust",
  "Corn Northern Leaf Blight": "fungal_leaf",
  "Corn Healthy": "healthy",
  "Grape Black Rot": "fungal_leaf",
  "Grape Esca (Black Measles)": "fungal_leaf",
  "Grape Leaf Blight": "fungal_leaf",
  "Grape Healthy": "healthy",
  "Orange Huanglongbing (Citrus Greening)": "bacterial_vector",
  "Peach Bacterial Spot": "bacterial",
  "Peach Healthy": "healthy",
  "Bell Pepper Bacterial Spot": "bacterial",
  "Bell Pepper Healthy": "healthy",
  "Potato Early Blight": "fungal_leaf",
  "Potato Late Blight": "fungal_leaf",
  "Potato Healthy": "healthy",
  "Raspberry Healthy": "healthy",
  "Soybean Healthy": "healthy",
  "Squash Powdery Mildew": "fungal_leaf",
  "Strawberry Leaf Scorch": "fungal_leaf",
  "Strawberry Healthy": "healthy",
  "Tomato Bacterial Spot": "bacterial",
  "Tomato Early Blight": "fungal_leaf",
  "Tomato Late Blight": "fungal_leaf",
  "Tomato Leaf Mold": "fungal_leaf",
  "Tomato Septoria Leaf Spot": "fungal_leaf",
  "Tomato Spider Mites": "pest",
  "Tomato Target Spot": "fungal_leaf",
  "Tomato Yellow Leaf Curl Virus": "viral",
  "Tomato Mosaic Virus": "viral",
  "Tomato Healthy": "healthy",
};

function normalizeLabel(label) {
  return (label || "").replaceAll("___", " ").replace(/\s+/g, " ").trim();
}

export function getRecommendation(label, lang = "en") {
  const normalized = normalizeLabel(label);
  const type = CLASS_TYPE_BY_LABEL[normalized] || "fungal_leaf";
  const langKey = lang === "hi" ? "hi" : "en";
  const advice = KNOWLEDGE[type][langKey];

  return {
    label: normalized,
    type,
    ...advice,
  };
}

