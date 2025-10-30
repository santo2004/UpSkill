// src/services/commentService.js
import api from "../api/axiosConfig";

export const commentService = {
  getByTicket: (ticketId) => api.get(`/Comment/${ticketId}`),
  add: (payload) => api.post("/Comment", payload)
};
