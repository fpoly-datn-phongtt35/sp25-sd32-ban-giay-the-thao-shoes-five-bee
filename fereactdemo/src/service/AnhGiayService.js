import axios from "../axiosConfig";

const REST_API_BASE_URL = "/anh-giay";

export const getAnhGiay = () => axios.get(`${REST_API_BASE_URL}/getAll`);

export const addAnhGiay = (formData) => {
  return axios.post(`${REST_API_BASE_URL}/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAnhGiay = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateAnhGiay = (id, formData) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, formData);
