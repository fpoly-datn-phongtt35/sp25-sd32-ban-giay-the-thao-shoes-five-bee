import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/hangKhachHang";

export const getAllHangKhachHang = () => axios.get(REST_API_BASE_URL);

export const addHangKhachHang = (hangKhachHang) =>
  axios.post(`${REST_API_BASE_URL}/add`, hangKhachHang);

export const deleteHangKhachHang = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateHangKhachHang = (id, hangKhachHang) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, hangKhachHang);

export const detailHangKhachHang = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);
