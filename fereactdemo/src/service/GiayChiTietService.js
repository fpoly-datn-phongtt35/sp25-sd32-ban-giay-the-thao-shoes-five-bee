import axios from "../axiosConfig";

const REST_API_BASE_URL = "/giay-chi-tiet";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
export const getListGoiYSanPham = (giayId) =>
  axios.get(`${REST_API_BASE_URL}/goi-y/${giayId}`, config)

export const getAllGiayChiTiet = () =>
  axios.post(`${REST_API_BASE_URL}/getAll`, config);

export const addGiayChiTiet = (giayChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/add`, giayChiTiet, config);

export const removeGiayChiTiet = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);

export const detailGiayChiTiet = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/admin/${id}`, config);

export const detailGiayChiTiet1 = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/user/${id}`, config);

export const detailGiayChiTiet2 = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`, config);

export const updateGiayChiTiet = (giayChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/update`, giayChiTiet, config, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const updateBienThe = async (id, soLuong, giaBan) => {
  try {
    const response = await axios.put(`/api/giay/update-bien-the/${id}`, config, null, {
      params: {
        soLuong: soLuong,
        giaBan: giaBan
      }
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật biến thể:', error);
    throw error;
  }
};


export const getGiayChiTiet = (mauSacId, kichCoId) =>
  axios.post(`${REST_API_BASE_URL}/detailSP/${mauSacId}/${kichCoId}`, config);

export const getGiayChitietDetail = (giayChiTietDto) => {
  return axios.post(`${REST_API_BASE_URL}/detail`, giayChiTietDto, config, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const getGiayChitietDetail1 = (id) => {
  return axios.get(`${REST_API_BASE_URL}/getAll/${id}`, config);
};
