import axios from "../axiosConfig";

const REST_API_BASE_URL = "http://localhost:5000/chat-lieu";


export const getChatLieu = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addChatLieu = (chatLieu) =>
  axios.post(`${REST_API_BASE_URL}/add`, chatLieu);

export const deleteChatLieu = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateChatLieu = (chatLieu) =>
  axios.post(`${REST_API_BASE_URL}/update`, chatLieu, {
    headers: {
      "Content-Type": "application/json",
    },
  });

