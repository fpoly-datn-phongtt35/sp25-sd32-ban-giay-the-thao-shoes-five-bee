import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/user";

const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getAllNhanVien = () =>
  axios.get(`${REST_API_BASE_URL}/getAll`, config);

export const addNhanVien = (userData, file) => {
  const formData = new FormData();
  formData.append(
    "userDto",
    new Blob([JSON.stringify(userData)], {
      type: "application/json",
    })
  );

  if (file) {
    formData.append("file", file);
  }

  return axios.post(`${REST_API_BASE_URL}/add`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteNhanVien = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`, config);

export const updateNhanVien = (nhanVien, file) => {
  const formData = new FormData();
  formData.append(
    "userDto",
    new Blob([JSON.stringify(nhanVien)], {
      type: "application/json",
    })
  );

  if (file) {
    formData.append("file", file);
  }

  return axios.put(`${REST_API_BASE_URL}/update`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const detailNhanVien = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`, config);