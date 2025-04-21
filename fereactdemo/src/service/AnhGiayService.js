import axios from "../axiosConfig";

const REST_API_BASE_URL = "/anh-giay";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getAnhGiay = () => axios.get(`${REST_API_BASE_URL}/getAll`, config);

export const addAnhGiay = (formData) => {
  return axios.post(`${REST_API_BASE_URL}/add`, formData, config, {
    headers: {
      "body": "multipart/form-data",
    },
  });
};

export const deleteAnhGiay = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);

export const updateAnhGiay = (id, formData) =>
  axios.post(`${REST_API_BASE_URL}/update/${id}`, formData, config);
