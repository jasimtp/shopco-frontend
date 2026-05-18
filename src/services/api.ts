import axios from "axios";

const API = axios.create({
  baseURL: "https://shopco-backend-qtvr.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // 👇 fix: headers ensure cheyyunnu
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;