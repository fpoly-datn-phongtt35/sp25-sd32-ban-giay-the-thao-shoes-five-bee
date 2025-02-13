import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/khachHang";

export const getAllKhachHang = () => axios.get(REST_API_BASE_URL);

export const addKhachHang = (khachHang) =>
  axios.post(`${REST_API_BASE_URL}/add`, khachHang);

export const deleteKhachHang = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateKhachHang = (id, khachHang) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, khachHang);

export const detailKhachHang = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);
