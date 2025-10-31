import api from "../api/axiosConfig";

export const userService = {
  getAll: () => api.get("/Users"),
  getById: (id) => api.get(`/Users/${id}`),
  updateStatus: (id, isActive) => api.put(`/Users/${id}/status`, { isActive }),
  remove: (id) => api.delete(`/Users/${id}`)
};
