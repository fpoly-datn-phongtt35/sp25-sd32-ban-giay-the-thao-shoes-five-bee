import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/user";

export const getAllNhanVien = () => axios.get(`${REST_API_BASE_URL}/getAll`);

export const addNhanVien = (userData, file) => {
  const formData = new FormData();
  formData.append('userDto', new Blob([JSON.stringify(userData)], {
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

export const deleteNhanVien = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateNhanVien = ( nhanVien, file) => {
  const formData = new FormData();
  formData.append('userDto', new Blob([JSON.stringify(nhanVien)], {
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

export const detailNhanVien = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);
