import axios from "../axiosConfig";

const REST_API_BASE_URL = "/kieu-dang";

export const getKieuDang = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addKieuDang = (kieuDang) =>
  axios.post(`${REST_API_BASE_URL}/add`, kieuDang);

export const deleteKieuDang = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`, id);

export const updateKieuDang = (id, kieuDang) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, kieuDang);
