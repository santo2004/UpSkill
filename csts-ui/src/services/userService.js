// src/services/userService.js
import api from "../api/axiosConfig";

export const userService = {
  getAll: () => api.get("/Users"),
  getById: (id) => api.get(`/Users/${id}`),
  updateStatus: (id, isActive) => api.put(`/Users/${id}/status`, isActive, {
    headers: { "Content-Type": "application/json" }
  }),
  remove: (id) => api.delete(`/Users/${id}`)
};