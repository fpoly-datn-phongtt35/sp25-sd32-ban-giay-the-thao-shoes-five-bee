import axios from "../axiosConfig";


const REST_API_BASE_URL = "/giam-gia-ct-sp";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

export const getPhieuGiamGiaChiTiet = () => axios.post(`${REST_API_BASE_URL}/getAll`, config);

export const searchPhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/search`, data, config);

export const addPhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/add`, data, config);

export const updatePhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/update`, data, config);

export const detailPhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/detail`, data, config);

export const deletePhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/delete`, data, config);