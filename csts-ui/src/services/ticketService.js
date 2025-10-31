import api from "../api/axiosConfig";

export const ticketService = {
  getAll: () => api.get("/Ticket"),
  getById: (id) => api.get(`/Ticket/${id}`),
  create: (payload) => api.post("/Ticket", payload),
  update: (id, payload) => api.put(`/Ticket/${id}`, payload),
  remove: (id) => api.delete(`/Ticket/${id}`),
  assign: (id, payload) => api.put(`/Ticket/${id}/assign`, payload),
  filter: (q) => api.get("/Ticket/filter", { params: q }),
  getByUser: (userId) => api.get(`/Ticket/user/${userId}`),
};
