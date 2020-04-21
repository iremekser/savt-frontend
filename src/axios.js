import axios from "axios";
const API = axios.create({
  baseURL: process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_API_URL_PRODUCTION
    : process.env.VUE_APP_API_URL_DEVELOPMENT,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(
  config => {
    const $config = config;

    return $config;
  },

  error => {
    Promise.reject(error);
  }
);

export default API;
