import axios from "axios";
const REST_API_BASE_URL = "http://localhost:5000/danh-gia";

export const getDanhGiaByHoaDonChiTietId = (hoaDonChiTietId) =>
    axios.get(`${REST_API_BASE_URL}/${hoaDonChiTietId}`);

export const addDanhGia = (danhGia) =>
    axios.post(`${REST_API_BASE_URL}/add`, danhGia);

export const getProductDanhGiaById = (giayId) =>
    axios.get(`${REST_API_BASE_URL}/${giayId}`)
