import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/dia-chi";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getDiaChi = () => axios.get(REST_API_BASE_URL, config);

export const getDiaChiByKhachHangId = (idUser) =>
  axios.get(`${REST_API_BASE_URL}/user/${idUser}`, config);

export const getDiaChiById = (diaChiId) =>
  axios.get(`${REST_API_BASE_URL}/${diaChiId}`, config);

export const addDiaChi = (idUser, diaChi) =>
  axios.post(`${REST_API_BASE_URL}/add/user/${idUser}`, diaChi, config);

export const updateDiaChi = (id, diaChi) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, diaChi, config);

export const deleteDiaChi = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`, config);
