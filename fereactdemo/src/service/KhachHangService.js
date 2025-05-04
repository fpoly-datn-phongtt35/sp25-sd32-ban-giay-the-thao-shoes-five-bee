import axios from "../axiosConfig";

const REST_API_BASE_URL = "/user";

const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getAllKhachHang = () => axios.get(`${REST_API_BASE_URL}/getAll`,config);

export const addKhachHang = (khachHangData, file) => {
  const formData = new FormData();
  formData.append('userDto', new Blob([JSON.stringify(khachHangData)], {
    type: 'application/json'
  }));

  if (file) {
    formData.append('file', file);
  }

  return axios.post(`${REST_API_BASE_URL}/add`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const getLichSuMuaHang = (userId) =>
  axios.get(`/user/lich-su-mua-hang/${userId}`,config);


export const deleteKhachHang = (khachHang) =>
  axios.post(`${REST_API_BASE_URL}/delete`, khachHang);

export const updateKhachHang = (khachHang, file) => {
  const formData = new FormData();
  formData.append('userDto', new Blob([JSON.stringify(khachHang)], {
    type: 'application/json'
  }));

  if (file) {
    formData.append('file', file);
  }
  return axios.put(`${REST_API_BASE_URL}/update`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const detailKhachHang = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`,config);

export const importExcel = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${REST_API_BASE_URL}/import-excel`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};
