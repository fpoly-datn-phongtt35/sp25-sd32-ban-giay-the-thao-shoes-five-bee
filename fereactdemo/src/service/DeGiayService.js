import axios from "../axiosConfig";

const REST_API_BASE_URL = "/de-giay";


// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getDeGiay = () => axios.post(`${REST_API_BASE_URL}/getAll`, config);

export const addDeGiay = (deGiay) =>
  axios.post(`${REST_API_BASE_URL}/add`, deGiay, config);

export const deleteDeGiay = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);

export const updateDeGiay = (deGiay) =>
  axios.post(`${REST_API_BASE_URL}/update`, deGiay, config, {
    headers: {
      "Content-Type": "application/json",
    },
  });
