import api from "../api/axiosConfig";

export const ticketService = {
  // The controller is named TicketController => route is /api/Ticket
  getAll: () => api.get("/Ticket"),
  getById: (id) => api.get(`/Ticket/${id}`),
  create: (payload) => api.post("/Ticket", payload),
  update: (id, payload) => api.put(`/Ticket/${id}`, payload),
  remove: (id) => api.delete(`/Ticket/${id}`),
  filter: (q) => api.get("/Ticket/filter", { params: q }),
  getByUser: (userId) => api.get(`/Ticket/user/${userId}`)
};