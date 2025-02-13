import axios from "axios";

const REST_API_URL = "http://localhost:5000/api/GiayChiTiet";

export const getAllGiayChiTiet = () => axios.get(REST_API_URL);

export const addGiayChiTiet = (giayChiTiet) =>
  axios.post(`${REST_API_URL}/add`, giayChiTiet);

export const removeGiayChiTiet = (id) =>
  axios.delete(`${REST_API_URL}/delete/${id}`);

export const detailGiayChiTiet = (id) =>
  axios.get(`${REST_API_URL}/detail/admin/${id}`);

export const detailGiayChiTiet1 = (id) =>
  axios.get(`${REST_API_URL}/detail/user/${id}`);

export const detailGiayChiTiet2 = (id) =>
  axios.get(`${REST_API_URL}/detail/${id}`);

export const updateGiayChiTiet = (id, giayChiTiet) =>
  axios.put(`${REST_API_URL}/update/${id}`, giayChiTiet);

export const getGiayChiTiet = (mauSacId, kichCoId) =>
  axios.get(`${REST_API_URL}/detailSP/${mauSacId}/${kichCoId}`);
