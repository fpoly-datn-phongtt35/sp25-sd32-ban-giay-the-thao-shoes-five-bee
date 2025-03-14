import axios from "../axiosConfig";

const REST_API_BASE_URL = "/de-giay";

export const getDeGiay = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addDeGiay = (deGiay) =>
  axios.post(`${REST_API_BASE_URL}/add`, deGiay);

export const deleteDeGiay = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateDeGiay = (deGiay) =>
  axios.post(`${REST_API_BASE_URL}/update`, deGiay, {
    headers: {
      "Content-Type": "application/json",
    },
  });
