import axios from "../axiosConfig";

const REST_API_BASE_URL = "/doanh-thu";

export const getDoanhThuNgayHienTai = () =>
    axios.get(`${REST_API_BASE_URL}/ngay-hien-tai`);

export const getDoanhThuThangHienTai = () =>
    axios.get(`${REST_API_BASE_URL}/thang-hien-tai`);

export const getDoanhThuNamHienTai = () =>
    axios.get(`${REST_API_BASE_URL}/nam-hien-tai`);

export const getDoanhThuTheoNgayCuThe = (ngay) =>
    axios.get(`${REST_API_BASE_URL}/ngay-cu-the`, { params: { ngay } });

export const getDoanhThuTheoKhoangNgay = (start, end) =>
    axios.get(`${REST_API_BASE_URL}/khoang-ngay`, { params: { start, end } });
