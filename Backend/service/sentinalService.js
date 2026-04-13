const getSentinelCredentials = () => {
  const clientId =
    process.env.CLIENT_ID ||
    process.env.SENTINEL_CLIENT_ID ||
    process.env.SENTINELHUB_CLIENT_ID;
  const clientSecret =
    process.env.CLIENT_SECRET ||
    process.env.SENTINEL_CLIENT_SECRET ||
    process.env.SENTINELHUB_CLIENT_SECRET;

  return { clientId, clientSecret };
};

class SentinelError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "SentinelError";
    this.status = status;
  }
}

const ensureSentinelCredentials = () => {
  const { clientId, clientSecret } = getSentinelCredentials();

  if (!clientId || !clientSecret) {
    throw new SentinelError("Sentinel credentials are missing in Backend/.env", 500);
  }

  return { clientId, clientSecret };
};

const validateBbox = (bbox) => {
  if (!Array.isArray(bbox) || bbox.length !== 4) {
    throw new SentinelError(
      "bbox must be an array of 4 numbers: [minLon, minLat, maxLon, maxLat]",
      400
    );
  }

  const values = bbox.map(Number);

  if (values.some((value) => !Number.isFinite(value))) {
    throw new SentinelError("bbox must contain only valid numbers", 400);
  }

  const [minLon, minLat, maxLon, maxLat] = values;

  if (minLon >= maxLon || minLat >= maxLat) {
    throw new SentinelError("bbox coordinates are invalid", 400);
  }

  return values;
};

const validateGeometry = (geometry) => {
  if (!geometry || geometry.type !== "Polygon" || !Array.isArray(geometry.coordinates)) {
    throw new SentinelError("geometry must be a GeoJSON Polygon", 400);
  }

  const [ring] = geometry.coordinates;

  if (!Array.isArray(ring) || ring.length < 4) {
    throw new SentinelError("geometry polygon must contain at least 4 positions", 400);
  }

  const normalizedRing = ring.map((position) => {
    if (!Array.isArray(position) || position.length < 2) {
      throw new SentinelError("geometry positions must be [longitude, latitude]", 400);
    }

    const lon = Number(position[0]);
    const lat = Number(position[1]);

    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      throw new SentinelError("geometry positions must contain valid numbers", 400);
    }

    return [lon, lat];
  });

  const [firstLon, firstLat] = normalizedRing[0];
  const [lastLon, lastLat] = normalizedRing[normalizedRing.length - 1];

  if (firstLon !== lastLon || firstLat !== lastLat) {
    normalizedRing.push([firstLon, firstLat]);
  }

  if (normalizedRing.length < 4) {
    throw new SentinelError("geometry polygon must contain at least 3 unique points", 400);
  }

  return {
    type: "Polygon",
    coordinates: [normalizedRing],
  };
};

const getDateRange = () => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 30);

  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
};

const getAccessToken = async () => {
  const { clientId, clientSecret } = ensureSentinelCredentials();

  const response = await fetch("https://services.sentinel-hub.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new SentinelError(
      `Failed to get Sentinel access token: ${response.status} ${errorText}`,
      response.status
    );
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new SentinelError("Sentinel token response did not include an access token", 502);
  }

  return data.access_token;
};

const buildFieldBounds = (bbox, geometry) => ({
  bbox,
  geometry: geometry || undefined,
  properties: {
    crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
  },
});

const NDVI_BANDS = {
  critical: 0.1,
  weak: 0.25,
  stable: 0.45,
  strong: 0.65,
};

const fetchNDVI = async ({ bbox, geometry }) => {
  const normalizedBbox = validateBbox(bbox);
  const normalizedGeometry = geometry ? validateGeometry(geometry) : null;
  const token = await getAccessToken();
  const timeRange = getDateRange();

  const response = await fetch("https://services.sentinel-hub.com/api/v1/process", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        bounds: buildFieldBounds(normalizedBbox, normalizedGeometry),
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange,
              maxCloudCoverage: 20,
            },
          },
        ],
      },
      output: {
        width: 768,
        height: 768,
        responses: [
          {
            identifier: "default",
            format: { type: "image/png" },
          },
        ],
      },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B08", "dataMask"],
            output: { bands: 4 }
          };
        }

        function evaluatePixel(sample) {
          let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);

          if (!isFinite(ndvi)) {
            ndvi = -1;
          }

          let color = [1, 0.08, 0.05];

          if (ndvi >= ${NDVI_BANDS.strong}) color = [0.05, 0.55, 0.18];
          else if (ndvi >= ${NDVI_BANDS.stable}) color = [0.32, 0.74, 0.24];
          else if (ndvi >= ${NDVI_BANDS.weak}) color = [0.94, 0.78, 0.16];
          else if (ndvi >= ${NDVI_BANDS.critical}) color = [0.92, 0.42, 0.12];

          return [color[0], color[1], color[2], sample.dataMask];
        }
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new SentinelError(
      `Failed to fetch NDVI image: ${response.status} ${errorText}`,
      response.status
    );
  }

  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const estimatePercentAtOrBelowValue = (value, anchors) => {
  if (!anchors.length) return 0;

  const sorted = anchors
    .filter(
      (anchor) =>
        Number.isFinite(anchor.percentile) &&
        Number.isFinite(anchor.value)
    )
    .sort((left, right) => left.value - right.value);

  if (!sorted.length) return 0;
  if (value <= sorted[0].value) return sorted[0].percentile;
  if (value >= sorted[sorted.length - 1].value) {
    return sorted[sorted.length - 1].percentile;
  }

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];

    if (value > current.value) continue;

    if (current.value === previous.value) {
      return current.percentile;
    }

    const ratio = (value - previous.value) / (current.value - previous.value);
    const percentile =
      previous.percentile + ratio * (current.percentile - previous.percentile);

    return clamp(Math.round(percentile), 0, 100);
  }

  return clamp(Math.round(sorted[sorted.length - 1].percentile), 0, 100);
};

const deriveHealthSummary = (meanNdvi, minNdvi) => {
  const score = Math.max(0, Math.min(100, Math.round(((meanNdvi + 1) / 2) * 100)));

  if (meanNdvi >= 0.65) {
    return {
      score,
      status: "Excellent",
      advice: "Vegetation looks strong and consistent. Keep irrigation and nutrient management steady.",
      risk: "Low",
    };
  }

  if (meanNdvi >= 0.45) {
    return {
      score,
      status: "Good",
      advice: "Crop health is generally good. Inspect weaker patches and maintain current practices.",
      risk: minNdvi < 0.2 ? "Moderate" : "Low",
    };
  }

  if (meanNdvi >= 0.25) {
    return {
      score,
      status: "Moderate",
      advice: "Parts of the field may be under stress. Check irrigation uniformity, nutrient deficiency, or pest pressure.",
      risk: "Moderate",
    };
  }

  return {
    score,
    status: "Poor",
    advice: "Vegetation vigor is weak. Prioritize field inspection for water stress, disease, or poor emergence.",
    risk: "High",
  };
};

const deriveFieldInsights = ({
  meanNdvi,
  minNdvi,
  maxNdvi,
  p10,
  p25,
  p50,
  p75,
  p90,
  sampleCount,
  noDataCount,
}) => {
  const coveragePercent =
    sampleCount + noDataCount > 0
      ? Math.round((sampleCount / (sampleCount + noDataCount)) * 100)
      : 0;
  const variability = Number((p90 - p10).toFixed(3));
  const uniformityScore = clamp(Math.round(100 - variability * 100), 0, 100);
  const percentileAnchors = [
    { percentile: 0, value: minNdvi },
    { percentile: 10, value: p10 },
    { percentile: 25, value: p25 },
    { percentile: 50, value: p50 },
    { percentile: 75, value: p75 },
    { percentile: 90, value: p90 },
    { percentile: 100, value: maxNdvi },
  ];
  const criticalAreaPercent = estimatePercentAtOrBelowValue(
    NDVI_BANDS.critical,
    percentileAnchors
  );
  const weakAreaPercent = estimatePercentAtOrBelowValue(
    NDVI_BANDS.weak,
    percentileAnchors
  );
  const productiveAreaPercent = clamp(
    100 - estimatePercentAtOrBelowValue(NDVI_BANDS.stable, percentileAnchors),
    0,
    100
  );
  const strongAreaPercent = clamp(
    100 - estimatePercentAtOrBelowValue(NDVI_BANDS.strong, percentileAnchors),
    0,
    100
  );

  const problems = [];
  const recommendations = [];

  if (coveragePercent < 70) {
    problems.push("Satellite coverage is limited, so part of the field may be obscured by cloud or missing pixels.");
    recommendations.push("Retry on another date or compare with the next clear-sky image before taking major action.");
  }

  if (meanNdvi < NDVI_BANDS.weak) {
    problems.push("The field shows overall weak vegetation vigor.");
    recommendations.push("Inspect the field first for water stress, poor emergence, disease, or nutrient deficiency.");
  } else if (meanNdvi < NDVI_BANDS.stable) {
    problems.push("The field is performing below ideal vigor levels.");
    recommendations.push("Check irrigation distribution and nutrient availability in weaker sections of the field.");
  } else {
    recommendations.push("Overall crop vigor looks stable. Focus management on isolated weak patches instead of the whole field.");
  }

  if (criticalAreaPercent >= 15 || minNdvi < NDVI_BANDS.critical) {
    problems.push("Some field patches are significantly stressed compared with the rest of the field.");
    recommendations.push("Scout the lowest-vigor patches on the field edge and low-lying areas for disease or waterlogging.");
  }

  if (variability > 0.35) {
    problems.push("Vegetation is uneven across the field, which suggests patchy stress.");
    recommendations.push("Split the field into management zones and avoid applying the same treatment everywhere.");
  } else {
    recommendations.push("Field uniformity is decent, so broad field-level actions are more likely to work consistently.");
  }

  if (p50 < 0.35) {
    recommendations.push("Delay high-cost input decisions until you verify plant stand and canopy development on ground.");
  }

  let urgency = "Low";
  if (meanNdvi < NDVI_BANDS.weak || criticalAreaPercent >= 15) urgency = "High";
  else if (meanNdvi < NDVI_BANDS.stable || variability > 0.35 || weakAreaPercent >= 40) urgency = "Medium";

  return {
    coveragePercent,
    uniformityScore,
    variability,
    criticalAreaPercent,
    weakAreaPercent,
    productiveAreaPercent,
    strongAreaPercent,
    urgency,
    problems,
    recommendations: [...new Set(recommendations)].slice(0, 4),
  };
};

const fetchNDVIStats = async ({ bbox, geometry }) => {
  const normalizedBbox = validateBbox(bbox);
  const normalizedGeometry = geometry ? validateGeometry(geometry) : null;
  const token = await getAccessToken();
  const timeRange = getDateRange();

  const response = await fetch("https://services.sentinel-hub.com/api/v1/statistics", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        bounds: buildFieldBounds(normalizedBbox, normalizedGeometry),
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange,
              maxCloudCoverage: 20,
            },
          },
        ],
      },
      aggregation: {
        timeRange,
        aggregationInterval: {
          of: "P30D",
        },
        evalscript: `
          //VERSION=3
          function setup() {
            return {
              input: [{
                bands: ["B04", "B08", "SCL", "dataMask"]
              }],
              output: [
                { id: "ndvi", bands: 1 },
                { id: "dataMask", bands: 1 }
              ]
            };
          }

          function evaluatePixel(sample) {
            let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
            let validMask = sample.dataMask;

            if (!isFinite(ndvi) || sample.SCL === 6) {
              validMask = 0;
            }

            return {
              ndvi: [ndvi],
              dataMask: [validMask]
            };
          }
        `,
        resx: 10,
        resy: 10,
      },
      calculations: {
        ndvi: {
          statistics: {
            default: {
              percentiles: {
                k: [10, 25, 50, 75, 90],
              },
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new SentinelError(
      `Failed to fetch NDVI stats: ${response.status} ${errorText}`,
      response.status
    );
  }

  const data = await response.json();
  const interval = data?.data?.[0]?.outputs?.ndvi?.bands?.B0?.stats;

  if (!interval) {
    throw new SentinelError("NDVI statistics response was incomplete", 502);
  }

  const meanNdvi = Number(interval.mean ?? 0);
  const minNdvi = Number(interval.min ?? 0);
  const maxNdvi = Number(interval.max ?? 0);
  const sampleCount = Number(interval.sampleCount ?? 0);
  const noDataCount = Number(interval.noDataCount ?? 0);
  const p10 = Number(interval.percentiles?.["10.0"] ?? minNdvi);
  const p25 = Number(interval.percentiles?.["25.0"] ?? meanNdvi);
  const p50 = Number(interval.percentiles?.["50.0"] ?? meanNdvi);
  const p75 = Number(interval.percentiles?.["75.0"] ?? meanNdvi);
  const p90 = Number(interval.percentiles?.["90.0"] ?? maxNdvi);
  const health = deriveHealthSummary(meanNdvi, minNdvi);
  const insights = deriveFieldInsights({
    meanNdvi,
    minNdvi,
    maxNdvi,
    p10,
    p25,
    p50,
    p75,
    p90,
    sampleCount,
    noDataCount,
  });

  return {
    meanNdvi: Number(meanNdvi.toFixed(3)),
    minNdvi: Number(minNdvi.toFixed(3)),
    maxNdvi: Number(maxNdvi.toFixed(3)),
    p10Ndvi: Number(p10.toFixed(3)),
    p25Ndvi: Number(p25.toFixed(3)),
    medianNdvi: Number(p50.toFixed(3)),
    p75Ndvi: Number(p75.toFixed(3)),
    topNdvi: Number(p90.toFixed(3)),
    sampleCount,
    noDataCount,
    health,
    insights,
  };
};

module.exports = {
  getAccessToken,
  fetchNDVI,
  fetchNDVIStats,
  SentinelError,
};
