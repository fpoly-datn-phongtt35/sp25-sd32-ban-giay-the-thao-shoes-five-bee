import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/chucVu";

export const getChucVu = () => axios.get(REST_API_BASE_URL);

export const addChucVu = (chucVu) =>
  axios.post(`${REST_API_BASE_URL}/add`, chucVu);

export const deleteChucVu = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateChucVu = (id, chucVu) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, chucVu);

export const detailChucVu = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);
