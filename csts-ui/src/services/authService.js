import api from "../api/axiosConfig";

export const loginUser = async (credentials) => {
  const res = await api.post("/Auth/login", credentials);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/Auth/register", data);
  return res.data;
};
