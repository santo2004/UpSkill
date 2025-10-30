// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7233/api", // your backend API base URL
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
