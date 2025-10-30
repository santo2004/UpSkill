import api from "../api/axiosConfig";

export const getAllTickets = async () => {
  const res = await api.get("/Ticket");
  return res.data;
};

export const createTicket = async (ticket) => {
  const res = await api.post("/Ticket", ticket);
  return res.data;
};

export const getTicketById = async (id) => {
  const res = await api.get(`/Ticket/${id}`);
  return res.data;
};
