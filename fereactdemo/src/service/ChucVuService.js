import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/role";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getChucVu = () => axios.get(`${REST_API_BASE_URL}/getAll`, config);
export const addChucVu = (chucVu) => axios.post(`${REST_API_BASE_URL}/add`, chucVu, config);
export const deleteChucVu = (id) => axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);
export const updateChucVu = (chucVu) => axios.put(`${REST_API_BASE_URL}/update`, chucVu, config);
export const detailChucVu = (id) => axios.get(`${REST_API_BASE_URL}/detail/${id}`, config);
