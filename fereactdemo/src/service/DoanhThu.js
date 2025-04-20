import axios from "../axiosConfig";

const REST_API_BASE_URL = "/doanh-thu";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

export const getDoanhThuNgayHienTai = () =>
    axios.get(`${REST_API_BASE_URL}/ngay-hien-tai`, config);

export const getDoanhThuThangHienTai = () =>
    axios.get(`${REST_API_BASE_URL}/thang-hien-tai`, config);

export const getDoanhThuNamHienTai = () =>
    axios.get(`${REST_API_BASE_URL}/nam-hien-tai`, config);

export const getDoanhThuTheoNgayCuThe = (ngay) =>
    axios.get(`${REST_API_BASE_URL}/ngay-cu-the`, { params: { ngay } }, config);

export const getDoanhThuTheoKhoangNgay = (start, end) =>
    axios.get(`${REST_API_BASE_URL}/khoang-ngay`, { params: { start, end } }, config);
