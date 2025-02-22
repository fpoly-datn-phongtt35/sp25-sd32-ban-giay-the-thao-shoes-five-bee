import axios from "../axiosConfig";

const REST_API_BASE_URL = "/kich-co";

export const getSizes = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const createSize = (size) =>
  axios.post(`${REST_API_BASE_URL}/add`, size);

export const deleteSize = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateSize = (id, size) =>
  axios.post(`${REST_API_BASE_URL}/update/${id}`, size);
