import axios from "../axiosConfig";

const REST_API_BASE_URL = "http://localhost:5000/chat-lieu";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getChatLieu = () => axios.post(`${REST_API_BASE_URL}/getAll`, config);

export const addChatLieu = (chatLieu) =>
  axios.post(`${REST_API_BASE_URL}/add`, chatLieu, config);

export const deleteChatLieu = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);

export const updateChatLieu = (chatLieu) =>
  axios.post(`${REST_API_BASE_URL}/update`, chatLieu, config, {
    headers: {
      "Content-Type": "application/json",
    },
  });

