import api from "../api/axiosConfig";

export const getAllUsers = async () => {
  const res = await api.get("/User");
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/User/${id}`);
  return res.data;
};
