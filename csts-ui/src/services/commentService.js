import api from "../api/axiosConfig";

export const commentService = {
  getByTicket: (ticketId) => api.get(`/Comment/ticket/${ticketId}`),
  add: (payload) => api.post("/Comment", payload)
};