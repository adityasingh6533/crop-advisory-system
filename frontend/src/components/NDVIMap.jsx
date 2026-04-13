import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";
import "../css/NDVI.css";
import { getApiBaseUrl } from "../api/config";

const lang = localStorage.getItem("lang") || "en";

const text = {
  en: {
    eyebrow: "Field Health",
    title: "Check Your Field Easily",
    subtitle:
      "Search your farm area, draw the field on the map, and get a simple health result first.",
    locationPlaceholder: "Enter village, farm, or landmark",
    centerMap: "Center Map",
    searching: "Searching...",
    fieldNamePlaceholder: "Field name",
    loadField: "Load saved field",
    saveField: "Save Field",
    uploadGeoJson: "Upload GeoJSON",
    clearField: "Clear Field",
    step1: "Search your farm area",
    step2: "Draw the field on the map",
    step3: "Press Analyze Field",
    profileTitle: "Farm Details",
    currentCrop: "Current crop",
    currentCropPlaceholder: "e.g. Wheat",
    growthStage: "Growth stage",
    soilType: "Soil type",
    season: "Season",
    irrigation: "Irrigation",
    mapEditor: "Field map",
    noField: "No field drawn",
    points: "boundary points",
    drawField: "Draw field",
    editPoints: "Edit points",
    redraw: "Redraw",
    fieldArea: "Field area",
    requestBox: "Request box",
    centerPoint: "Center point",
    waitingField: "Waiting for field boundary",
    drawFieldFirst: "Draw a field first",
    analyze: "Analyze Field",
    analyzing: "Analyzing...",
    quickResult: "Quick Result",
    healthScore: "Health score",
    averageNdvi: "Average NDVI",
    risk: "Risk",
    quickAdvice: "Quick advice",
    urgency: "Urgency",
    showDetails: "Show More Details",
    hideDetails: "Hide Details",
    detailsTitle: "Full Analysis",
    coverage: "Coverage",
    uniformity: "Uniformity",
    weakArea: "Weak area",
    strongArea: "Strong area",
    fieldProblems: "Likely field problems",
    nextActions: "Recommended next actions",
    noProblems: "No major field-wide NDVI warning was found.",
    integratedDecision: "Farm decision",
    priorityActions: "Priority actions",
    recommendedCrops: "Suggested crops",
    noCropRecommendation: "No crop recommendation available yet.",
    planningRisk: "Planning risk",
    weatherSummary: "Weather summary",
    fieldHistory: "Field history",
    previousComparison: "Previous comparison",
    noHistory: "No previous scans saved for this field yet.",
    compareHint: "Run and save at least two scans to unlock comparison.",
    scoreChange: "Health score change",
    ndviChange: "Average NDVI change",
    uniformityChange: "Uniformity change",
    riskMoved: "Risk moved",
    ndviCaption:
      "This NDVI image is clipped to your exact field boundary, so it is more useful than a large area scan.",
    generated: "Field NDVI and advisory generated successfully.",
    searchFirst: "Enter a location before searching.",
    locationNotFound: "Location not found. Try a village name or nearby landmark.",
    centered: "Map centered. Now draw the field on the map.",
    geoJsonLoaded: "Field boundary loaded from file.",
    fieldCreated: "Field boundary created.",
    fieldUpdated: "Field boundary updated.",
    fieldRemoved: "Field boundary removed. Draw a new one.",
    drawBoundaryFirst: "Draw or upload the exact field boundary first.",
    saveFieldFirst: "Draw the field boundary before saving it.",
    enterFieldName: "Enter a field name before saving.",
    fieldSaved: "Field saved successfully.",
    loadedField: "Saved field loaded.",
    unknownField: "Untitled Field",
    weatherUnavailable:
      "Weather advisory is unavailable right now, but field NDVI is ready.",
  },
  hi: {
    eyebrow: "खेत स्वास्थ्य",
    title: "अपने खेत को आसानी से जांचें",
    subtitle:
      "अपने खेत का स्थान खोजें, मैप पर सीमा बनाएं, और पहले सरल स्वास्थ्य परिणाम देखें।",
    locationPlaceholder: "गांव, खेत या नज़दीकी स्थान लिखें",
    centerMap: "मैप सेट करें",
    searching: "खोज रहा है...",
    fieldNamePlaceholder: "खेत का नाम",
    loadField: "सहेजा हुआ खेत खोलें",
    saveField: "खेत सेव करें",
    uploadGeoJson: "GeoJSON अपलोड करें",
    clearField: "खेत हटाएं",
    step1: "पहले खेत का स्थान खोजें",
    step2: "मैप पर खेत की सीमा बनाएं",
    step3: "फिर विश्लेषण बटन दबाएं",
    profileTitle: "खेत की जानकारी",
    currentCrop: "वर्तमान फसल",
    currentCropPlaceholder: "जैसे गेहूं",
    growthStage: "फसल अवस्था",
    soilType: "मिट्टी का प्रकार",
    season: "सीजन",
    irrigation: "सिंचाई",
    mapEditor: "खेत का मैप",
    noField: "कोई खेत नहीं बना",
    points: "सीमा बिंदु",
    drawField: "खेत बनाएं",
    editPoints: "बिंदु बदलें",
    redraw: "फिर से बनाएं",
    fieldArea: "खेत का क्षेत्रफल",
    requestBox: "रिक्वेस्ट बॉक्स",
    centerPoint: "केंद्र बिंदु",
    waitingField: "खेत की सीमा का इंतज़ार है",
    drawFieldFirst: "पहले खेत बनाएं",
    analyze: "खेत का विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",
    quickResult: "सरल परिणाम",
    healthScore: "स्वास्थ्य स्कोर",
    averageNdvi: "औसत NDVI",
    risk: "जोखिम",
    quickAdvice: "त्वरित सलाह",
    urgency: "तुरंत ध्यान",
    showDetails: "और जानकारी दिखाएं",
    hideDetails: "जानकारी छुपाएं",
    detailsTitle: "पूरा विश्लेषण",
    coverage: "कवरेज",
    uniformity: "एकरूपता",
    weakArea: "कमजोर हिस्सा",
    strongArea: "मजबूत हिस्सा",
    fieldProblems: "संभावित समस्याएं",
    nextActions: "अगले कदम",
    noProblems: "पूरे खेत में कोई बड़ी NDVI समस्या नहीं दिखी।",
    integratedDecision: "मिलीजुली खेत सलाह",
    priorityActions: "अभी क्या करें",
    recommendedCrops: "उपयुक्त फसलें",
    noCropRecommendation: "अभी कोई फसल सुझाव उपलब्ध नहीं है।",
    planningRisk: "योजना जोखिम",
    weatherSummary: "मौसम सार",
    fieldHistory: "खेत का इतिहास",
    previousComparison: "पिछली तुलना",
    noHistory: "इस खेत के लिए अभी कोई पुराना स्कैन सेव नहीं है।",
    compareHint: "तुलना देखने के लिए कम से कम दो स्कैन सेव करें।",
    scoreChange: "स्वास्थ्य स्कोर बदलाव",
    ndviChange: "औसत NDVI बदलाव",
    uniformityChange: "एकरूपता बदलाव",
    riskMoved: "जोखिम बदला",
    ndviCaption:
      "यह NDVI चित्र केवल आपके बनाए हुए खेत की सीमा पर आधारित है, इसलिए यह बड़े क्षेत्र की तुलना में अधिक उपयोगी है।",
    generated: "खेत का NDVI और सलाह तैयार हो गई।",
    searchFirst: "खोजने से पहले स्थान लिखें।",
    locationNotFound: "स्थान नहीं मिला। गांव या नज़दीकी जगह का नाम लिखें।",
    centered: "मैप सेट हो गया। अब खेत की सीमा बनाएं।",
    geoJsonLoaded: "फाइल से खेत की सीमा लोड हो गई।",
    fieldCreated: "खेत की सीमा बन गई।",
    fieldUpdated: "खेत की सीमा अपडेट हो गई।",
    fieldRemoved: "खेत की सीमा हट गई। फिर से बनाएं।",
    drawBoundaryFirst: "पहले खेत की सही सीमा बनाएं या अपलोड करें।",
    saveFieldFirst: "सेव करने से पहले खेत की सीमा बनाएं।",
    enterFieldName: "सेव करने से पहले खेत का नाम लिखें।",
    fieldSaved: "खेत सफलतापूर्वक सेव हो गया।",
    loadedField: "सहेजा हुआ खेत खुल गया।",
    unknownField: "बिना नाम का खेत",
    weatherUnavailable:
      "अभी मौसम सलाह उपलब्ध नहीं है, लेकिन खेत का NDVI तैयार है।",
  },
};

const hindiText = {
  eyebrow: "खेत स्वास्थ्य",
  title: "अपने खेत को आसानी से जांचें",
  subtitle:
    "अपने खेत का स्थान खोजें, मैप पर सीमा बनाएं, और पहले सरल स्वास्थ्य परिणाम देखें।",
  locationPlaceholder: "गांव, खेत या नजदीकी स्थान लिखें",
  centerMap: "मैप सेट करें",
  searching: "खोज रहा है...",
  uploadGeoJson: "GeoJSON अपलोड करें",
  clearField: "खेत हटाएं",
  step1: "पहले खेत का स्थान खोजें",
  step2: "मैप पर खेत की सीमा बनाएं",
  step3: "फिर विश्लेषण बटन दबाएं",
  mapEditor: "खेत का मैप",
  noField: "कोई खेत नहीं बना",
  points: "सीमा बिंदु",
  drawField: "खेत बनाएं",
  editPoints: "बिंदु बदलें",
  redraw: "फिर से बनाएं",
  fieldArea: "खेत का क्षेत्रफल",
  requestBox: "रिक्वेस्ट बॉक्स",
  centerPoint: "केंद्र बिंदु",
  waitingField: "खेत की सीमा का इंतजार है",
  drawFieldFirst: "पहले खेत बनाएं",
  analyze: "खेत का विश्लेषण करें",
  analyzing: "विश्लेषण हो रहा है...",
  quickResult: "सरल परिणाम",
  healthScore: "स्वास्थ्य स्कोर",
  averageNdvi: "औसत NDVI",
  risk: "जोखिम",
  quickAdvice: "त्वरित सलाह",
  urgency: "तुरंत ध्यान",
  showDetails: "और जानकारी दिखाएं",
  hideDetails: "जानकारी छुपाएं",
  detailsTitle: "पूरा विश्लेषण",
  coverage: "कवरेज",
  uniformity: "एकरूपता",
  weakArea: "कमजोर हिस्सा",
  strongArea: "मजबूत हिस्सा",
  fieldProblems: "संभावित समस्याएं",
  nextActions: "अगले कदम",
  noProblems: "पूरे खेत में कोई बड़ी NDVI समस्या नहीं दिखी।",
  ndviCaption:
    "यह NDVI चित्र केवल आपके बनाए हुए खेत की सीमा पर आधारित है, इसलिए यह बड़े क्षेत्र की तुलना में अधिक उपयोगी है।",
  generated: "खेत का NDVI तैयार हो गया।",
  searchFirst: "खोजने से पहले स्थान लिखें।",
  locationNotFound: "स्थान नहीं मिला। गांव या नजदीकी जगह का नाम लिखें।",
  centered: "मैप सेट हो गया। अब खेत की सीमा बनाएं।",
  geoJsonLoaded: "फाइल से खेत की सीमा लोड हो गई।",
  fieldCreated: "खेत की सीमा बन गई।",
  fieldUpdated: "खेत की सीमा अपडेट हो गई।",
  fieldRemoved: "खेत की सीमा हट गई। फिर से बनाएं।",
  drawBoundaryFirst: "पहले खेत की सही सीमा बनाएं या अपलोड करें।",
};

const copy = lang === "hi" ? { ...text.en, ...hindiText } : text.en;

const hiLabels = {
  Sandy: "रेतीली",
  Clay: "चिकनी",
  Loamy: "दोमट",
  Black: "काली",
  Red: "लाल",
  "Clay Loam": "चिकनी दोमट",
  "Sandy Loam": "रेतीली दोमट",
  Kharif: "खरीफ",
  Rabi: "रबी",
  Zaid: "जायद",
  Rainfed: "वर्षा आधारित",
  Canal: "नहर",
  Borewell: "बोरवेल",
  Sowing: "बुवाई",
  Vegetative: "विकास अवस्था",
  Flowering: "फूल अवस्था",
  Fruiting: "फल अवस्था",
  Maturity: "पकने की अवस्था",
  Excellent: "बहुत अच्छा",
  Good: "अच्छा",
  Moderate: "मध्यम",
  Poor: "कमज़ोर",
  Low: "कम",
  Medium: "मध्यम",
  High: "अधिक",
  "Not available": "उपलब्ध नहीं",
  "Vegetation looks strong and consistent. Keep irrigation and nutrient management steady.":
    "फसल की हरियाली मजबूत और एक जैसी दिख रही है। सिंचाई और पोषण प्रबंधन नियमित रखें।",
  "Crop health is generally good. Inspect weaker patches and maintain current practices.":
    "फसल की स्थिति सामान्यतः अच्छी है। कमजोर हिस्सों की जांच करें और मौजूदा प्रबंधन जारी रखें।",
  "Parts of the field may be under stress. Check irrigation uniformity, nutrient deficiency, or pest pressure.":
    "खेत के कुछ हिस्सों में तनाव हो सकता है। सिंचाई की समानता, पोषक तत्वों की कमी या कीट दबाव जांचें।",
  "Vegetation vigor is weak. Prioritize field inspection for water stress, disease, or poor emergence.":
    "फसल की ताकत कमजोर दिख रही है। पानी की कमी, बीमारी या खराब जमाव के लिए खेत की जल्दी जांच करें।",
  "Satellite coverage is limited, so part of the field may be obscured by cloud or missing pixels.":
    "सैटेलाइट कवरेज सीमित है, इसलिए खेत का कुछ हिस्सा बादल या मिसिंग पिक्सल से छिपा हो सकता है।",
  "Retry on another date or compare with the next clear-sky image before taking major action.":
    "बड़ा फैसला लेने से पहले किसी और तारीख पर फिर जांचें या अगली साफ तस्वीर से तुलना करें।",
  "The field shows overall weak vegetation vigor.":
    "पूरे खेत में फसल की ताकत कमजोर दिख रही है।",
  "Inspect the field first for water stress, poor emergence, disease, or nutrient deficiency.":
    "सबसे पहले खेत में पानी की कमी, खराब जमाव, बीमारी या पोषक तत्वों की कमी जांचें।",
  "The field is performing below ideal vigor levels.":
    "खेत की स्थिति आदर्श हरियाली स्तर से नीचे है।",
  "Check irrigation distribution and nutrient availability in weaker sections of the field.":
    "खेत के कमजोर हिस्सों में सिंचाई की पहुंच और पोषक उपलब्धता जांचें।",
  "Overall crop vigor looks stable. Focus management on isolated weak patches instead of the whole field.":
    "कुल मिलाकर फसल स्थिर दिख रही है। पूरे खेत पर नहीं, सिर्फ कमजोर हिस्सों पर ध्यान दें।",
  "Some field patches are significantly stressed compared with the rest of the field.":
    "खेत के कुछ हिस्से बाकी खेत की तुलना में काफी ज्यादा तनाव में हैं।",
  "Scout the lowest-vigor patches on the field edge and low-lying areas for disease or waterlogging.":
    "खेत की किनारी और नीचे वाले हिस्सों में बीमारी या जलभराव के लिए जांच करें।",
  "Vegetation is uneven across the field, which suggests patchy stress.":
    "खेत में हरियाली एक जैसी नहीं है, जो टुकड़ों में तनाव दिखाती है।",
  "Split the field into management zones and avoid applying the same treatment everywhere.":
    "खेत को अलग-अलग प्रबंधन हिस्सों में बांटें और हर जगह एक जैसा उपचार न करें।",
  "Field uniformity is decent, so broad field-level actions are more likely to work consistently.":
    "खेत की एकरूपता ठीक है, इसलिए पूरे खेत के स्तर पर की गई कार्रवाई समान असर दे सकती है।",
  "Delay high-cost input decisions until you verify plant stand and canopy development on ground.":
    "महंगे इनपुट देने से पहले जमीन पर पौधों की स्थिति और बढ़वार की जांच करें।",
  "Treat this as a field inspection priority before making blanket input decisions.":
    "एक साथ बड़ा इनपुट देने से पहले इस खेत की प्राथमिक जांच करें।",
  "Protect the crop from stress now because yield-sensitive growth stages are active.":
    "अभी फसल को तनाव से बचाएं क्योंकि उपज के लिए संवेदनशील अवस्था चल रही है।",
  "Weather-based crop planner suggests delaying fresh sowing in similar conditions.":
    "मौसम आधारित सलाह के अनुसार ऐसी स्थिति में नई बुवाई थोड़ा टालना बेहतर है।",
  "Weather-based crop planner considers conditions suitable for current field operations.":
    "मौसम आधारित सलाह के अनुसार मौजूदा खेत कार्यों के लिए स्थिति ठीक है।",
  "Complete farm profile to unlock crop-specific planning advice.":
    "फसल-विशिष्ट सलाह पाने के लिए खेत की पूरी जानकारी भरें।",
};

const translateLabel = (value) => (lang === "hi" ? hiLabels[value] || value : value);

const DEFAULT_CENTER = [28.6139, 77.209];
const DEFAULT_ZOOM = 16;
const toLatLngTuples = (points) => points.map((point) => [point.lat, point.lon]);

const formatCoordinate = (value) => Number(value).toFixed(6);

const getBboxFromPoints = (points) => {
  if (!points.length) {
    return null;
  }

  return [
    Math.min(...points.map((point) => point.lon)),
    Math.min(...points.map((point) => point.lat)),
    Math.max(...points.map((point) => point.lon)),
    Math.max(...points.map((point) => point.lat)),
  ];
};

const getGeometryFromPoints = (points) => {
  if (points.length < 3) {
    return null;
  }

  const ring = points.map((point) => [point.lon, point.lat]);
  const [firstLon, firstLat] = ring[0];
  const [lastLon, lastLat] = ring[ring.length - 1];

  if (firstLon !== lastLon || firstLat !== lastLat) {
    ring.push([firstLon, firstLat]);
  }

  return {
    type: "Polygon",
    coordinates: [ring],
  };
};

const getPolygonAreaHectares = (points) => {
  if (points.length < 3) {
    return 0;
  }

  const averageLat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
  const metersPerLat = 111320;
  const metersPerLon = 111320 * Math.cos((averageLat * Math.PI) / 180);

  const projected = points.map((point) => ({
    x: point.lon * metersPerLon,
    y: point.lat * metersPerLat,
  }));

  let area = 0;

  for (let index = 0; index < projected.length; index += 1) {
    const current = projected[index];
    const next = projected[(index + 1) % projected.length];
    area += current.x * next.y - next.x * current.y;
  }

  return Math.abs(area / 2) / 10000;
};

const extractPolygonFromLayer = (layer) => {
  const latLngGroups = layer.getLatLngs();
  const firstRing = latLngGroups?.[0] || [];

  return firstRing.map((point) => ({
    lat: Number(point.lat),
    lon: Number(point.lng),
  }));
};

const extractPolygonFromGeoJson = (content) => {
  const parsed = JSON.parse(content);

  const getPolygonCoordinates = (geometry) => {
    if (!geometry) return null;
    if (geometry.type === "Polygon") return geometry.coordinates?.[0] || null;
    if (geometry.type === "MultiPolygon") return geometry.coordinates?.[0]?.[0] || null;
    return null;
  };

  if (parsed.type === "FeatureCollection") {
    for (const feature of parsed.features || []) {
      const polygon = getPolygonCoordinates(feature.geometry);
      if (polygon) return polygon;
    }
  }

  if (parsed.type === "Feature") {
    return getPolygonCoordinates(parsed.geometry);
  }

  return getPolygonCoordinates(parsed);
};

function MapViewportController({ center, polygonPoints }) {
  const map = useMap();

  useEffect(() => {
    if (polygonPoints.length >= 3) {
      const bounds = L.latLngBounds(toLatLngTuples(polygonPoints));
      map.fitBounds(bounds.pad(0.25), { animate: true, duration: 0.8 });
      return;
    }

    map.flyTo(center, DEFAULT_ZOOM, { duration: 0.8 });
  }, [center, map, polygonPoints]);

  return null;
}

function NDVIMap() {
  const featureGroupRef = useRef(null);
  const fileInputRef = useRef(null);
  const [location, setLocation] = useState("");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [fieldPoints, setFieldPoints] = useState([]);
  const [image, setImage] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [message, setMessage] = useState(copy.searchFirst);

  const geometry = useMemo(() => getGeometryFromPoints(fieldPoints), [fieldPoints]);
  const bbox = useMemo(() => getBboxFromPoints(fieldPoints), [fieldPoints]);
  const areaHectares = useMemo(
    () => getPolygonAreaHectares(fieldPoints).toFixed(2),
    [fieldPoints]
  );
  const bboxPreview = bbox ? bbox.map((value) => formatCoordinate(value)).join(", ") : "Draw a field first";

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const clearExistingLayers = () => {
    if (featureGroupRef.current?.clearLayers) {
      featureGroupRef.current.clearLayers();
    }
  };

  const syncPolygonState = (points) => {
    setFieldPoints(points);
    setImage(null);
    setStats(null);
  };

  const handleLocationSubmit = async () => {
    const trimmedLocation = location.trim();

    if (!trimmedLocation) {
      setMessage(copy.searchFirst);
      return;
    }

    try {
      setSearching(true);
      setMessage("");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmedLocation)}`
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setMessage(copy.locationNotFound);
        return;
      }

      const nextCenter = [Number(data[0].lat), Number(data[0].lon)];
      setCenter(nextCenter);
      clearExistingLayers();
      syncPolygonState([]);
      setMessage(copy.centered);
    } catch (error) {
      console.error(error);
      setMessage(copy.locationNotFound);
    } finally {
      setSearching(false);
    }
  };

  const handleGeoJsonUpload = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      const polygon = extractPolygonFromGeoJson(content);

      if (!polygon || polygon.length < 4) {
        throw new Error("No valid polygon found in the uploaded file.");
      }

      const nextPoints = polygon
        .slice(0, -1)
        .map(([lon, lat]) => ({
          lat: Number(lat),
          lon: Number(lon),
        }))
        .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));

      if (nextPoints.length < 3) {
        throw new Error("Polygon must contain at least 3 valid points.");
      }

      syncPolygonState(nextPoints);
      const nextBbox = getBboxFromPoints(nextPoints);
      setCenter([
        (nextBbox[1] + nextBbox[3]) / 2,
        (nextBbox[0] + nextBbox[2]) / 2,
      ]);
      setMessage(copy.geoJsonLoaded);
    } catch (error) {
      console.error(error);
      setMessage(error.message || copy.geoJsonLoaded);
    } finally {
      event.target.value = "";
    }
  };

  const handleCreated = (event) => {
    clearExistingLayers();
    const points = extractPolygonFromLayer(event.layer);
    syncPolygonState(points);
    setMessage(copy.fieldCreated);
  };

  const handleEdited = (event) => {
    event.layers.eachLayer((layer) => {
      const points = extractPolygonFromLayer(layer);
      syncPolygonState(points);
    });
    setMessage(copy.fieldUpdated);
  };

  const handleDeleted = () => {
    syncPolygonState([]);
    setMessage(copy.fieldRemoved);
  };

  const fetchNDVI = async () => {
    if (!geometry || !bbox) {
      setMessage(copy.drawBoundaryFirst);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const payload = {
        bbox,
        geometry,
      };

      const requests = [
        fetch(`${getApiBaseUrl()}/api/ndvi`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
        fetch(`${getApiBaseUrl()}/api/ndvi/stats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
      ];

      const settledResponses = await Promise.allSettled(requests);
      const [imageResult, statsResult] = settledResponses;

      if (imageResult.status !== "fulfilled") {
        throw imageResult.reason || new Error("NDVI image request failed.");
      }

      if (statsResult.status !== "fulfilled") {
        throw statsResult.reason || new Error("NDVI health score request failed.");
      }

      const imageResponse = imageResult.value;
      const statsResponse = statsResult.value;

      if (!imageResponse.ok) {
        const contentType = imageResponse.headers.get("content-type") || "";
        let errorMessage = "NDVI request failed.";

        if (contentType.includes("application/json")) {
          const errorData = await imageResponse.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          errorMessage = await imageResponse.text();
        }

        throw new Error(errorMessage);
      }

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "NDVI health score fetch failed.");
      }

      const blob = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(blob);
      const statsData = await statsResponse.json();

      setImage((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return imageUrl;
      });
      setStats(statsData);
      setShowDetails(false);
      setMessage(copy.generated);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to generate NDVI image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ndvi-page">
      <div className="ndvi-card">
        <div className="ndvi-hero">
          <div className="ndvi-copy">
            <p className="ndvi-eyebrow">{copy.eyebrow}</p>
            <h1 className="ndvi-title ndvi-title-simple">{copy.title}</h1>
            <p className="ndvi-sub ndvi-sub-simple">{copy.subtitle}</p>

            <div className="ndvi-searchbar">
              <input
                className="ndvi-input ndvi-location-input"
                type="text"
                placeholder={copy.locationPlaceholder}
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
              <button className="ndvi-btn" onClick={handleLocationSubmit} disabled={searching}>
                {searching ? copy.searching : copy.centerMap}
              </button>
            </div>

            <div className="ndvi-toolbar">
              <button
                className="ndvi-btn ndvi-btn-ghost"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                {copy.uploadGeoJson}
              </button>
              <button
                className="ndvi-btn ndvi-btn-ghost"
                onClick={() => {
                  clearExistingLayers();
                  syncPolygonState([]);
                  setMessage(copy.fieldRemoved);
                }}
                type="button"
              >
                {copy.clearField}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.geojson"
                onChange={handleGeoJsonUpload}
                hidden
              />
            </div>

            <div className="ndvi-steps">
              <div className="ndvi-step">1. {copy.step1}</div>
              <div className="ndvi-step">2. {copy.step2}</div>
              <div className="ndvi-step">3. {copy.step3}</div>
            </div>
          </div>

          <div className="ndvi-map-stage">
            <div className="ndvi-map-glow" />
            <div className="ndvi-map-shell">
              <div className="ndvi-map-shell-header">
                <span className="ndvi-map-pill">{copy.mapEditor}</span>
                <span className="ndvi-map-pill ndvi-map-pill-muted">
                  {fieldPoints.length ? `${fieldPoints.length} ${copy.points}` : copy.noField}
                </span>
              </div>

              <div className="ndvi-map-frame">
                <MapContainer
                  center={center}
                  zoom={DEFAULT_ZOOM}
                  className="ndvi-real-map"
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapViewportController center={center} polygonPoints={fieldPoints} />
                  <FeatureGroup ref={featureGroupRef}>
                    {fieldPoints.length >= 3 ? (
                      <Polygon positions={toLatLngTuples(fieldPoints)} pathOptions={{ color: "#98ffbe" }} />
                    ) : null}
                    <EditControl
                      position="topright"
                      onCreated={handleCreated}
                      onEdited={handleEdited}
                      onDeleted={handleDeleted}
                      draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        polygon: {
                          allowIntersection: false,
                          showArea: true,
                          shapeOptions: {
                            color: "#98ffbe",
                            fillColor: "#52b788",
                            fillOpacity: 0.25,
                            weight: 2,
                          },
                        },
                      }}
                      edit={{
                        edit: true,
                        remove: true,
                      }}
                    />
                  </FeatureGroup>
                </MapContainer>
                <div className="ndvi-map-hud">
                  <span>{copy.drawField}</span>
                  <span>{copy.editPoints}</span>
                  <span>{copy.redraw}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ndvi-data-strip">
          <div className="ndvi-data-card">
            <span className="ndvi-data-label">{copy.fieldArea}</span>
            <strong>{fieldPoints.length >= 3 ? `${areaHectares} ha` : copy.waitingField}</strong>
          </div>
          <div className="ndvi-data-card">
            <span className="ndvi-data-label">{copy.requestBox}</span>
            <strong>{bboxPreview}</strong>
          </div>
          <div className="ndvi-data-card">
            <span className="ndvi-data-label">{copy.centerPoint}</span>
            <strong>
              {formatCoordinate(center[0])}, {formatCoordinate(center[1])}
            </strong>
          </div>
        </div>

        {stats ? (
          <>
            <div className="ndvi-step-title ndvi-result-title">{copy.quickResult}</div>
            <div className="ndvi-health-grid">
              <div className="ndvi-health-card ndvi-health-score">
                <span className="ndvi-data-label">{copy.healthScore}</span>
                <strong>{stats.health.score}/100</strong>
                <p>{translateLabel(stats.health.status)}</p>
              </div>
              <div className="ndvi-health-card">
                <span className="ndvi-data-label">{copy.averageNdvi}</span>
                <strong>{stats.meanNdvi}</strong>
                <p>{copy.urgency}: {translateLabel(stats.insights.urgency)}</p>
              </div>
              <div className="ndvi-health-card">
                <span className="ndvi-data-label">{copy.risk}</span>
                <strong>{translateLabel(stats.health.risk)}</strong>
                <p>{copy.healthScore}: {stats.health.score}</p>
              </div>
              <div className="ndvi-health-card ndvi-health-advice">
                <span className="ndvi-data-label">{copy.quickAdvice}</span>
                <strong>{translateLabel(stats.health.advice)}</strong>
              </div>
            </div>
          </>
        ) : null}

        {stats ? (
          <div className="ndvi-actions ndvi-actions-center ndvi-details-toggle">
            <button className="ndvi-btn ndvi-btn-ghost" type="button" onClick={() => setShowDetails((previous) => !previous)}>
              {showDetails ? copy.hideDetails : copy.showDetails}
            </button>
          </div>
        ) : null}

        {showDetails && stats ? (
          <>
            <div className="ndvi-step-title ndvi-result-title">{copy.detailsTitle}</div>
            <div className="ndvi-diagnostics-grid">
              <div className="ndvi-health-card">
                <span className="ndvi-data-label">{copy.coverage}</span>
                <strong>{stats.insights.coveragePercent}%</strong>
              </div>
              <div className="ndvi-health-card">
                <span className="ndvi-data-label">{copy.uniformity}</span>
                <strong>{stats.insights.uniformityScore}/100</strong>
              </div>
              <div className="ndvi-health-card">
                <span className="ndvi-data-label">{copy.weakArea}</span>
                <strong>{stats.insights.weakAreaPercent}%</strong>
              </div>
              <div className="ndvi-health-card">
                <span className="ndvi-data-label">{copy.strongArea}</span>
                <strong>{stats.insights.strongAreaPercent}%</strong>
              </div>
            </div>

            <div className="ndvi-logic-grid">
              <div className="ndvi-logic-card">
                <span className="ndvi-data-label">{copy.fieldProblems}</span>
                {stats.insights.problems.length ? (
                  <ul className="ndvi-logic-list">
                    {stats.insights.problems.map((problem) => (
                      <li key={problem}>{translateLabel(problem)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ndvi-logic-empty">{copy.noProblems}</p>
                )}
              </div>
              <div className="ndvi-logic-card">
                <span className="ndvi-data-label">{copy.nextActions}</span>
                <ul className="ndvi-logic-list">
                  {stats.insights.recommendations.map((item) => (
                    <li key={item}>{translateLabel(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : null}

        {message ? <p className="ndvi-message">{message}</p> : null}

        <div className="ndvi-actions">
          <button className="ndvi-btn ndvi-btn-primary" onClick={fetchNDVI} disabled={loading}>
            {loading ? copy.analyzing : copy.analyze}
          </button>
        </div>

        {image && (
          <div className="ndvi-result">
            <img src={image} alt="NDVI visualization" />
            <p className="ndvi-result-caption">
              {copy.ndviCaption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NDVIMap;
