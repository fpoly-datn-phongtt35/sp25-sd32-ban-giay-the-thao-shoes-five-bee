import axios from "../axiosConfig";

const REST_API_BASE_URL = "/thuong-hieu";

export const getThuongHieu = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addThuongHieu = async (thuongHieu) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/add`, thuongHieu);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data);
    } else {
      throw new Error("Đã xảy ra lỗi khi thêm thương hiệu.");
    }
  }
};
export const deleteThuongHieu = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateThuongHieu = (thuongHieu) =>
  axios.post(`${REST_API_BASE_URL}/update`, thuongHieu, {
    headers: {
      "Content-Type": "application/json",
    },
  });

