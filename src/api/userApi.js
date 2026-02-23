const RENDER_BACKEND_BASE = "https://crop-advisory-backend.onrender.com";
const baseURL = `${RENDER_BACKEND_BASE}/api/user`;
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
    return new Error("Network error. Check internet connection or backend availability.");
  }
  return error;
};

const parseErrorResponse = async (response, fallbackMessage) => {
  const rawText = await response.text();

  if (rawText) {
    try {
      const data = JSON.parse(rawText);
      if (data?.error) return data.error;
      if (data?.message) return data.message;
    } catch {
      // Non-JSON response
    }
  }

  const compactText = rawText ? ` ${rawText.replace(/\s+/g, " ").slice(0, 120)}` : "";
  return `${fallbackMessage} (HTTP ${response.status})${compactText}`;
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
      const message = await parseErrorResponse(response, "Sign-up failed");
      throw new Error(message);
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
      const message = await parseErrorResponse(response, "Sign-in failed");
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    const readableError = toReadableNetworkError(error);
    console.error("Error signing in:", readableError);
    throw readableError;
  }
};
