import axios from "../axiosConfig";

const REST_API_BASE_URL = "/giay";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getGiay = () => axios.post(`${REST_API_BASE_URL}/getAll`, config);

export const addGiay = (giay) => axios.post(`${REST_API_BASE_URL}/add`, giay, config);
export const addBienThe = (giay) => axios.post(
  `${REST_API_BASE_URL}/add-bien-the`,
  giay, config,
  {
    headers: { "Content-Type": "application/json" } // Đảm bảo gửi đúng kiểu JSON
  }
);



export const deleteGiay = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);

export const updateGiay = (giaydto) =>
  axios.post(`${REST_API_BASE_URL}/update`, giaydto, config, {
    headers: { "Content-Type": "application/json" }, // 👈 Bắt buộc để server hiểu là JSON
  });

export const getGiayDetail = (giayDto) => {
  return axios.post(`${REST_API_BASE_URL}/detail`, giayDto, config, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export const assignAnhGiay = (giayId, anhGiayIds) => {
  return axios.post(`/giay/${giayId}/anhGiay`, anhGiayIds, config);
};


