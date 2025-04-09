import axios from "../axiosConfig";

const REST_API_BASE_URL = "/giay-chi-tiet";

export const getListGoiYSanPham = (giayId) =>
  axios.get(`${REST_API_BASE_URL}/goi-y/san-pham/${giayId}`)

export const getAllGiayChiTiet = () =>
  axios.post(`${REST_API_BASE_URL}/getAll`);

export const addGiayChiTiet = (giayChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/add`, giayChiTiet);

export const removeGiayChiTiet = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const detailGiayChiTiet = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/admin/${id}`);

export const detailGiayChiTiet1 = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/user/${id}`);

export const detailGiayChiTiet2 = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);

export const updateGiayChiTiet = (giayChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/update`, giayChiTiet, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const updateBienThe = async (id, soLuong, giaBan) => {
  try {
    const response = await axios.put(`/api/giay/update-bien-the/${id}`, null, {
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
