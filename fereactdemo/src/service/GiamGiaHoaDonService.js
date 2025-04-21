import axios from "../axiosConfig";

const REST_API_BASE_URL = "/giam-gia-hoa-don";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getGiamGiaHoaDon = () => axios.post(`${REST_API_BASE_URL}/getAll`, config);

export const getGiamGia = async (ma = "") => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/giam-gia`, config, {
      params: { ma },
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi gọi API giảm giá:", error);
    throw error;
  }
};

export const addGiamGiaHoaDon = (GiamGiaHoaDon) =>
  axios.post(`${REST_API_BASE_URL}/add`, GiamGiaHoaDon, config);

export const deleteGiamGiaHoaDon = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);

export const updateGiamGiaHoaDon = (giamGiaHoaDon) => {
  return axios.post(`${REST_API_BASE_URL}/update`, giamGiaHoaDon, config, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const detailGiamGiaHoaDon = (id) =>
  axios.post(`${REST_API_BASE_URL}/detail`, { id }, config, {
    headers: { "Content-Type": "application/json" },
  });

