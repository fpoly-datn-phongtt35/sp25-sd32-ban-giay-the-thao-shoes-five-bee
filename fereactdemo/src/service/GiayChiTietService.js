import axios from "../axiosConfig";


const REST_API_URL = "/giay-chi-tiet";

export const getAllGiayChiTiet = () => axios.post(`${REST_API_URL}/getAll`);;

export const addGiayChiTiet = (giayChiTiet) =>
  axios.post(`${REST_API_URL}/add`, giayChiTiet);

export const removeGiayChiTiet = (id) =>
  axios.post(`${REST_API_URL}/delete/${id}`);

export const detailGiayChiTiet = (id) =>
  axios.post(`${REST_API_URL}/detail/admin/${id}`);

export const detailGiayChiTiet1 = (id) =>
  axios.post(`${REST_API_URL}/detail/user/${id}`);

export const detailGiayChiTiet2 = (id) =>
  axios.post(`${REST_API_URL}/detail/${id}`);

export const updateGiayChiTiet = (id, giayChiTiet) =>
  axios.post(`${REST_API_URL}/update/${id}`, giayChiTiet);

export const getGiayChiTiet = (mauSacId, kichCoId) =>
  axios.post(`${REST_API_URL}/detailSP/${mauSacId}/${kichCoId}`);
