import axios from "../axiosConfig";

const REST_API_BASE_URL = "/giay-chi-tiet";

export const getAllGiayChiTiet = () =>
  axios.post(`${REST_API_BASE_URL}/getAll`);

export const addGiayChiTiet = (giayChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/add`, giayChiTiet);

export const removeGiayChiTiet = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const detailGiayChiTiet = (giayChiTietDto) =>
  axios.post(`${REST_API_BASE_URL}/detail`, giayChiTietDto);


export const detailGiayChiTiet1 = (id) =>
  axios.post(`${REST_API_BASE_URL}/detail/user/${id}`);

export const detailGiayChiTiet2 = (id) =>
  axios.post(`${REST_API_BASE_URL}/detail/${id}`);

export const updateGiayChiTiet = (giayChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/update`, giayChiTiet, {
    headers: {
      "Content-Type": "application/json",
    },
  });



export const getGiayChiTiet = (mauSacId, kichCoId) =>
  axios.post(`${REST_API_BASE_URL}/detailSP/${mauSacId}/${kichCoId}`);
export const getGiayChitietDetail = (giayChiTietDto) => {
  return axios.post(`${REST_API_BASE_URL}/detail`, giayChiTietDto, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const getGiayChitietDetail1 = (id) => {
  return axios.get(`${REST_API_BASE_URL}/getAll/${id}`);
};
