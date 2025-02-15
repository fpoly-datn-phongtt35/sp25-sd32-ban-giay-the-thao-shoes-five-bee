import axios from "../axiosConfig";

const REST_API_BASE_URL = "/chat-lieu";

export const getChatLieu = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addChatLieu = (chatLieu) =>
  axios.post(`${REST_API_BASE_URL}/add`, chatLieu);

export const deleteChatLieu = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete/${id}`);

export const updateChatLieu = (id, chatLieu) =>
  axios.post(`${REST_API_BASE_URL}/update/${id}`, chatLieu);
