import axios from "../axiosConfig";

const REST_API_BASE_URL = "/kieu-dang";

export const getKieuDang = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addKieuDang = (kieuDang) =>
  axios.post(`${REST_API_BASE_URL}/add`, kieuDang);

export const deleteKieuDang = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateKieuDang = (kieuDang) =>
  axios.post(`${REST_API_BASE_URL}/update`, kieuDang, {
    headers: {
      "Content-Type": "application/json",
    },
  });
