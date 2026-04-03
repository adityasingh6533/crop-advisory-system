const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const isLocalHost = (hostname) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "[::1]";

const PRODUCTION_API_FALLBACK = "https://crop-advisory-system-6.onrender.com";
const PRODUCTION_ML_API_FALLBACK = "https://crop-advisory-system-2.onrender.com";

export const getApiBaseUrl = () => {
  const value = process.env.REACT_APP_API_BASE_URL;
  if (value) {
    return trimTrailingSlash(value);
  }

  if (typeof window !== "undefined" && isLocalHost(window.location.hostname)) {
    return "http://localhost:5002";
  }

  return PRODUCTION_API_FALLBACK;
};

export const getMlApiBaseUrl = () => {
  const value = process.env.REACT_APP_ML_API_URL;
  if (value) {
    return trimTrailingSlash(value);
  }

  if (typeof window !== "undefined" && !isLocalHost(window.location.hostname)) {
    return PRODUCTION_ML_API_FALLBACK;
  }

  return "http://localhost:5001";
};
