import axios from "../axiosConfig";

const REST_API_BASE_URL = "/danh-muc";

export const getDanhMuc = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addDanhMuc = (danhMuc) =>
    axios.post(`${REST_API_BASE_URL}/add`, danhMuc);

export const deleteDanhMuc = (id) =>
    axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateDanhMuc = (danhMuc) =>
    axios.post(`${REST_API_BASE_URL}/update`, danhMuc, {
        headers: {
            "Content-Type": "application/json",
        },
    });

