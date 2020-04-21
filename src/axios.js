import axios from "axios";
const API = axios.create({
  baseURL:"http://localhost:8080",
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
