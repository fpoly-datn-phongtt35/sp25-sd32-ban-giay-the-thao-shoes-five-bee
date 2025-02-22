import axios from "../axiosConfig";

const REST_API_BASE_URL = "/giay";

export const getGiay = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addGiay = (giay) => axios.post(`${REST_API_BASE_URL}/add`, giay);

export const deleteGiay = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateGiay = (giaydto) =>
  axios.post(`${REST_API_BASE_URL}/update`, giaydto, {
    headers: { "Content-Type": "application/json" }, // 👈 Bắt buộc để server hiểu là JSON
  });

export const getGiayDetail = (giayDto) => {
  return axios.post(`${REST_API_BASE_URL}/detail`, giayDto, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
