import api from "../api/axiosConfig";

export const ticketService = {
  getAll: () => api.get("/Tickets"),
  getMyTickets: () => api.get("/Tickets/my"),
  getById: (id) => api.get(`/Tickets/${id}`),
  create: (payload) => api.post("/Tickets", payload),
  update: (id, payload) => api.put(`/Tickets/${id}`, payload),
  remove: (id) => api.delete(`/Tickets/${id}`)
};
