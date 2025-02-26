import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/user";

export const getAllKhachHang = () => axios.get(`${REST_API_BASE_URL}/getAll`);

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
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteKhachHang = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

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
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const detailKhachHang = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);

export const importExcel = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axios.post(`${REST_API_BASE_URL}/import-excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
