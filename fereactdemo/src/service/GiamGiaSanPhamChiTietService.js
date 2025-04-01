import axios from "../axiosConfig";


const REST_API_BASE_URL = "/giam-gia-ct-sp";

export const getPhieuGiamGiaChiTiet = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const searchPhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/search`, data);

export const addPhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/add`, data);

export const updatePhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/update`, data);

export const detailPhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/detail`, data);

export const deletePhieuGiamGiaChiTiet = (data) =>
    axios.post(`${REST_API_BASE_URL}/delete`, data);