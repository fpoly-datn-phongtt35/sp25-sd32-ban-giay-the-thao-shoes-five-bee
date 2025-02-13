import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/giamGiaHoaDon";

export const getPhieuGiamGia = () => axios.get(REST_API_BASE_URL);

export const addPhieuGiamGia = (phieuGiamGia) =>
  axios.post(`${REST_API_BASE_URL}/add`, phieuGiamGia);

export const deletePhieuGiamGia = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`, id);

export const updatePhieuGiamGia = (id, phieuGiamGia) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, phieuGiamGia);

export const detailPhieuGiamGia = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);
