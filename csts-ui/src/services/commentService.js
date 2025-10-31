// src/services/commentService.js
import api from "../api/axiosConfig";

export const commentService = {
  getByTicket: (ticketId) => api.get(`/Comment/ticket/${ticketId}`),
  getByUser: (userId) => api.get(`/Comment/user/${userId}`),
  add: (payload) => api.post("/Comment", payload)
};