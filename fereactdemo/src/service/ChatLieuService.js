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

export const addChatLieu = async (chatLieu) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/add`, chatLieu, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data); // Lỗi cụ thể từ backend (ví dụ: trùng tên)
    } else {
      throw new Error("Chất liệu đã tồn tại hoặc có lỗi khi thêm mới");
    }
  }
};


export const deleteChatLieu = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);

export const updateChatLieu = (chatLieu) =>
  axios.post(`${REST_API_BASE_URL}/update`, chatLieu, config, {
    headers: {
      "Content-Type": "application/json",
    },
  });

