const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const isLocalHost = (hostname) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "[::1]";

const getBrowserOrigin = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const { protocol, host, hostname } = window.location;
  if (isLocalHost(hostname)) {
    return "";
  }

  return `${protocol}//${host}`;
};

export const getApiBaseUrl = () => {
  const value = process.env.REACT_APP_API_BASE_URL;
  if (value) {
    return trimTrailingSlash(value);
  }

  const browserOrigin = getBrowserOrigin();
  if (browserOrigin) {
    return trimTrailingSlash(browserOrigin);
  }

  return "http://localhost:5002";
};

export const getMlApiBaseUrl = () => {
  const value = process.env.REACT_APP_ML_API_URL;
  if (value) {
    return trimTrailingSlash(value);
  }

  return "http://localhost:5001";
};
