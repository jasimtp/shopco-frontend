import axios from "axios";

const API_URL = "https://shopco-backend-qtvr.onrender.com/api/products";

export const getProducts = () => axios.get(API_URL);

export const getProductById = (id: string | number) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createProduct = (formData: FormData) => {
  return axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProduct = (id: string | number, formData: FormData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProduct = (id: string | number) => {
  return axios.delete(`${API_URL}/${id}`);
};