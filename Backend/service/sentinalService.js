const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

class SentinelError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "SentinelError";
    this.status = status;
  }
}

const ensureSentinelCredentials = () => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new SentinelError("Sentinel credentials are missing in Backend/.env", 500);
  }
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
  ensureSentinelCredentials();

  const response = await fetch("https://services.sentinel-hub.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
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

const fetchNDVI = async (bbox) => {
  const normalizedBbox = validateBbox(bbox);
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
        bounds: {
          bbox: normalizedBbox,
          properties: {
            crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
          },
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange,
              maxCloudCoverage: 30,
            },
          },
        ],
      },
      output: {
        width: 512,
        height: 512,
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
            input: ["B04", "B08"],
            output: { bands: 3 }
          };
        }

        function evaluatePixel(sample) {
          let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);

          if (ndvi < 0.2) return [1, 0, 0];
          if (ndvi < 0.5) return [1, 1, 0];
          return [0, 1, 0];
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

module.exports = {
  getAccessToken,
  fetchNDVI,
  SentinelError,
};
