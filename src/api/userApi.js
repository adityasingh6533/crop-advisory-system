import { getApiBaseUrl } from "./config";

const baseURL = `${getApiBaseUrl()}/api/user`;
const REQUEST_TIMEOUT_MS = 20000;

const fetchWithTimeout = async (url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const toReadableNetworkError = (error) => {
  if (error?.name === "AbortError") {
    return new Error("Request timed out. Please try again.");
  }
  if (error instanceof TypeError) {
    return new Error("Network error. Check internet connection or server CORS/API URL settings.");
  }
  return error;
};

export const createUser = async (userData) => {
  try {
    const response = await fetchWithTimeout(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const readableError = toReadableNetworkError(error);
    console.error("Error creating user:", readableError);
    throw readableError;
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await fetchWithTimeout(`${baseURL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Sign-in failed");
    }

    return await response.json();
  } catch (error) {
    const readableError = toReadableNetworkError(error);
    console.error("Error signing in:", readableError);
    throw readableError;
  }
};
