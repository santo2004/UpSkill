import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7233/api", // change port if your backend runs on another port
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
}, (error) => Promise.reject(error));

export default api;