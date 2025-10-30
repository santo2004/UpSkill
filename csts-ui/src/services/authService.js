// src/services/authService.js
import api from "../api/axiosConfig";

export const authService = {
  login: (payload) => api.post("/Auth/login", payload),
  register: (payload) => api.post("/Auth/register", payload)
};
