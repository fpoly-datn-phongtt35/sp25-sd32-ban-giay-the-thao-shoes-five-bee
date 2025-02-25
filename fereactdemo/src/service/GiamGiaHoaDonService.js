import axios from "../axiosConfig";

const REST_API_BASE_URL = "/giam-gia-hoa-don";

export const getGiamGiaHoaDon = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addGiamGiaHoaDon = (GiamGiaHoaDon) =>
  axios.post(`${REST_API_BASE_URL}/add`, GiamGiaHoaDon);

export const deleteGiamGiaHoaDon = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateGiamGiaHoaDon = (id, GiamGiaHoaDon) =>
  axios.post(`${REST_API_BASE_URL}/update/${id}`, GiamGiaHoaDon);

export const detailGiamGiaHoaDon = (id) =>
  axios.post(`${REST_API_BASE_URL}/detail/${id}`);
