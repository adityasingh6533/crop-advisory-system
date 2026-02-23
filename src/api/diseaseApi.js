import { getMlApiBaseUrl } from "./config";

const envBaseUrl = process.env.REACT_APP_ML_API_URL;
const baseUrls = [
  envBaseUrl || getMlApiBaseUrl(),
  "http://127.0.0.1:5001",
  "http://localhost:5001",
].filter(Boolean);

export const detectDisease = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  let lastError = null;

  for (const baseUrl of baseUrls) {
    try {
      const response = await fetch(`${baseUrl}/predict`, {
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
    }
  }

  throw new Error(
    lastError?.message ||
      "Could not connect to ML server. Start Backend/ML/server.py on port 5001."
  );
};
