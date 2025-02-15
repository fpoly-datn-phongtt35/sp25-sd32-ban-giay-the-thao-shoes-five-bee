import axios from "../axiosConfig";

const REST_API_URL = "/mau-sac";

export const getMauSac = () => axios.post(`${REST_API_URL}/getAll`);

export const addMauSac = (mauSac) => axios.post(`${REST_API_URL}/add`, mauSac);

export const deleteMauSac = (id) =>
  axios.post(`${REST_API_URL}/delete/${id}`);

export const updateMauSac = (id, mauSac) =>
  axios.post(`${REST_API_URL}/update/${id}`, mauSac);
