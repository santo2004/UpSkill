// src/services/userService.js
import api from "../api/axiosConfig";

export const userService = {
  getAll: () => api.get("/User"),
  getById: (id) => api.get(`/User/${id}`),
  create: (payload) => api.post("/User", payload),
  update: (id, payload) => api.put(`/User/${id}`, payload),
  remove: (id) => api.delete(`/User/${id}`)
};
