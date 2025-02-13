import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/nhanVien";

export const getAllNhanVien = () => axios.get(REST_API_BASE_URL);

export const addNhanVien = (nhanVien) =>
  axios.post(`${REST_API_BASE_URL}/add`, nhanVien);

export const deleteNhanVien = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateNhanVien = (id, nhanVien) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, nhanVien);

export const detailNhanVien = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);
