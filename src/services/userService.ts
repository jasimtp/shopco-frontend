import axios from "axios";

const API_URL = "https://shopco-backend-qtvr.onrender.com/api/users";

export const getUsers = () => {
  return axios.get(API_URL);
};

export const deleteUser = (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};