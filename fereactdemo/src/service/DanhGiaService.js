import axios from "axios";
const REST_API_BASE_URL = "http://localhost:5000/danh-gia";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

export const getDanhGiaByHoaDonChiTietId = (hoaDonChiTietId) =>
    axios.get(`${REST_API_BASE_URL}/${hoaDonChiTietId}`, config);

export const addDanhGia = (danhGia) =>
    axios.post(`${REST_API_BASE_URL}/add`, danhGia, config);

export const getProductDanhGiaById = (giayId) =>
    axios.get(`${REST_API_BASE_URL}/san-pham/${giayId}`, config)

export const getDanhGiaByUserAndHoaDonChiTiet = (userId, hoaDonChiTietId) =>
    axios.get(`${REST_API_BASE_URL}`, config, {
        params: {
            userId: userId,
            hoaDonChiTietId: hoaDonChiTietId,
        },
    });
