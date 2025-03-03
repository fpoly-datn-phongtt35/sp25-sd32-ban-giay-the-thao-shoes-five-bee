import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/dia-chi";

export const getDiaChi = () => axios.get(REST_API_BASE_URL);

export const getDiaChiByKhachHangId = (idUser) =>
  axios.get(`${REST_API_BASE_URL}/user/${idUser}`);

export const getDiaChiById = (diaChiId) =>
  axios.get(`${REST_API_BASE_URL}/${diaChiId}`);

export const addDiaChi = (idUser, diaChi) =>
  axios.post(`${REST_API_BASE_URL}/add/user/${idUser}`, diaChi);

export const updateDiaChi = (id, diaChi) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, diaChi);

export const deleteDiaChi = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);
