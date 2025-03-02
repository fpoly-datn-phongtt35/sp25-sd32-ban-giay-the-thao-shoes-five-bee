import axios from "../axiosConfig";

const REST_API_BASE_URL = "/mau-sac";

export const getMauSac = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addMauSac = (mauSac) =>
  axios.post(`${REST_API_BASE_URL}/add`, mauSac);

export const deleteMauSac = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateMauSac = (mauSac) =>
  axios.post(`${REST_API_BASE_URL}/update`, mauSac, {
    headers: {
      "Content-Type": "application/json",
    },
  });

