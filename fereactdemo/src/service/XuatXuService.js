import axios from "../axiosConfig";

const REST_API_BASE_URL = "/xuat-xu";

export const getXuatXu = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addXuatXu = async (xuatXu) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/add`, xuatXu);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data); // Lỗi do dữ liệu người dùng
    } else {
      throw new Error("Xuất xứ đã tồn tại hoặc có lỗi khi thêm mới");
    }
  }
};


export const deleteXuatXu = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateXuatXu = (xuatXu) =>
  axios.post(`${REST_API_BASE_URL}/update`, xuatXu, {
    headers: {
      "Content-Type": "application/json",
    },
  });

