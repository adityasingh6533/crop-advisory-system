import { getApiBaseUrl } from "./config";

const BASE_URL = `${getApiBaseUrl()}/api/ndvi`;
const TOKEN_STORAGE_KEY = "token";

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token) {
    throw new Error("Sign in to save fields and view NDVI history.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const parseJson = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || fallbackMessage);
  }

  return data;
};

export const listNDVIFields = async () => {
  const response = await fetch(`${BASE_URL}/fields`, {
    headers: getAuthHeaders(),
  });

  return parseJson(response, "Failed to load saved fields");
};

export const saveNDVIField = async (payload) => {
  const response = await fetch(`${BASE_URL}/fields`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return parseJson(response, "Failed to save field");
};

export const saveNDVIFieldScan = async (fieldId, stats) => {
  const response = await fetch(`${BASE_URL}/fields/${fieldId}/scans`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ stats }),
  });

  return parseJson(response, "Failed to save NDVI scan");
};

export const getNDVIFieldHistory = async (fieldId) => {
  const response = await fetch(`${BASE_URL}/fields/${fieldId}/history`, {
    headers: getAuthHeaders(),
  });

  return parseJson(response, "Failed to load NDVI history");
};
