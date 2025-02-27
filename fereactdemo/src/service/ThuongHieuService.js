import axios from "../axiosConfig";

const REST_API_BASE_URL = "/thuong-hieu";

export const getThuongHieu = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addThuongHieu = (thuongHieu) =>
  axios.post(`${REST_API_BASE_URL}/add`, thuongHieu);

export const deleteThuongHieu = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateThuongHieu = (thuongHieu) =>
  axios.post(`${REST_API_BASE_URL}/update`, thuongHieu, {
    headers: {
      "Content-Type": "application/json",
    },
  });

