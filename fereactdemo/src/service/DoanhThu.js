import axios from "../axiosConfig";

const REST_API_BASE_URL = "/doanh-thu";

// Lấy token từ localStorage
const token = localStorage.getItem("token");

const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    }
};

// Các hàm API
export const getDoanhThuNgayHienTai = () =>
    axios.get(`${REST_API_BASE_URL}/ngay-hien-tai`, config);

export const getDoanhThuThangHienTai = () =>
    axios.get(`${REST_API_BASE_URL}/thang-hien-tai`, config);

export const getDoanhThuNamHienTai = () =>
    axios.get(`${REST_API_BASE_URL}/nam-hien-tai`, config);

// 🛠️ Gộp params vào config chuẩn
export const getDoanhThuTheoNgayCuThe = (ngay) =>
    axios.get(`${REST_API_BASE_URL}/ngay-cu-the`, {
        ...config,
        params: { ngay }
    });

export const getDoanhThuTheoKhoangNgay = (start, end) =>
    axios.get(`${REST_API_BASE_URL}/khoang-ngay`, {
        ...config,
        params: { start, end }
    });

// 🆕 Thêm đúng các hàm mới để lọc theo năm, tháng cụ thể
export const getDoanhThuNamCuThe = (year) =>
    axios.get(`${REST_API_BASE_URL}/nam-cu-the`, {
        ...config,
        params: { year }
    });

export const getDoanhThuThangCuThe = (year, month) =>
    axios.get(`${REST_API_BASE_URL}/thang-cu-the`, {
        ...config,
        params: { year, month }
    });
