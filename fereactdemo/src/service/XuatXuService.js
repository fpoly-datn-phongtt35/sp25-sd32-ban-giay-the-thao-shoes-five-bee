import axios from "../axiosConfig";

const REST_API_BASE_URL = "/xuat-xu";

export const getXuatXu = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addXuatXu = (xuatXu) =>
  axios.post(`${REST_API_BASE_URL}/add`, xuatXu);

export const deleteXuatXu = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete/${id}`);

export const updateXuatXu = (id, xuatXu) =>
  axios.post(`${REST_API_BASE_URL}/update/${id}`, xuatXu);
