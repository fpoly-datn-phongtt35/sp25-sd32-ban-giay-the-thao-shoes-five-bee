import axios from "../axiosConfig";

const REST_API_BASE_URL = "/de-giay";


// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getDeGiay = () => axios.post(`${REST_API_BASE_URL}/getAll`, config);

export const addDeGiay = async (deGiay) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/add`, deGiay, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data); // Trả về lỗi cụ thể từ backend
    } else {
      throw new Error("Đế giày đã tồn tại hoặc có lỗi khi thêm mới");
    }
  }
};


export const deleteDeGiay = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);

export const updateDeGiay = (deGiay) =>
  axios.post(`${REST_API_BASE_URL}/update`, deGiay, config, {
    headers: {
      "Content-Type": "application/json",
    },
  });
