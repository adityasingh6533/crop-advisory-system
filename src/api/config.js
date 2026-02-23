const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
  const value = process.env.REACT_APP_API_BASE_URL;
  if (!value) {
    return "http://localhost:5002";
  }
  return trimTrailingSlash(value);
};

export const getMlApiBaseUrl = () => {
  const value = process.env.REACT_APP_ML_API_URL;
  if (!value) {
    return "http://localhost:5001";
  }
  return trimTrailingSlash(value);
};
