import axios from "../axiosConfig";

const REST_API_BASE_URL = "/anh-giay";

export const getAnhGiay = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addAnhGiay = (formData) => {
  return axios.post(`${REST_API_BASE_URL}/add`, formData, {
    headers: {
      "body": "multipart/form-data",
    },
  });
};

export const deleteAnhGiay = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateAnhGiay = (id, formData) =>
  axios.post(`${REST_API_BASE_URL}/update/${id}`, formData);
