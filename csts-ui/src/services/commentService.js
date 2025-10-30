import api from "../api/axiosConfig";

export const getCommentsByTicket = async (ticketId) => {
  const res = await api.get(`/Comment/ticket/${ticketId}`);
  return res.data;
};

export const addComment = async (comment) => {
  const res = await api.post("/Comment", comment);
  return res.data;
};
