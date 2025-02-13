import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/giamGiaChiTietHoaDon";

export const getPhieuGiamGiaChiTiet = () => axios.get(REST_API_BASE_URL);

export const addPhieuGiamGiaChiTiet = (phieuGiamGiaChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/add`, phieuGiamGiaChiTiet);

export const deletePhieuGiamGiaChiTiet = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`, id);

export const updatePhieuGiamGiaChiTiet = (id, phieuGiamGiaChiTiet) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, phieuGiamGiaChiTiet);

export const detailPhieuGiamGiaChiTiet = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);
