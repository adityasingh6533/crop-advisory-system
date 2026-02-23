import { getMlApiBaseUrl } from "./config";

const envBaseUrl = process.env.REACT_APP_ML_API_URL;
const isLocalHost = () =>
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]");

const baseUrls = isLocalHost()
  ? [envBaseUrl || getMlApiBaseUrl(), "http://127.0.0.1:5001", "http://localhost:5001"].filter(Boolean)
  : [envBaseUrl || getMlApiBaseUrl()].filter(Boolean);

const fetchWithTimeout = async (url, options = {}, timeoutMs = 120000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const detectDisease = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  let lastError = null;

  for (const baseUrl of baseUrls) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await fetchWithTimeout(`${baseUrl}/predict`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          const details = err.details ? ` (${err.details})` : "";
          throw new Error((err.error || "Prediction failed") + details);
        }

        return response.json();
      } catch (error) {
        lastError = error;
        if (error?.name === "AbortError" && attempt < 2) {
          // Render free-tier cold starts can exceed the first attempt timeout.
          await delay(4000);
          continue;
        }
        break;
      }
    }
  }

  throw new Error(
    lastError?.name === "AbortError"
      ? "ML prediction timed out. Render service may be cold-starting; retry once in 20-30 seconds."
      : lastError?.message ||
        "Could not connect to ML server. Verify REACT_APP_ML_API_URL or start Backend/ML/server.py on port 5001."
  );
};
