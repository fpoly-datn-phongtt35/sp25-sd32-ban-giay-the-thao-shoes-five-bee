import axios from "../axiosConfig";

const REST_API_BASE_URL = "/kieu-dang";

export const getKieuDang = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addKieuDang = async (kieuDang) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/add`, kieuDang);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data); // Lỗi từ backend (ví dụ: tên đã tồn tại)
    } else {
      throw new Error("Kiểu dáng đã tồn tại hoặc có lỗi khi thêm mới");
    }
  }
};


export const deleteKieuDang = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateKieuDang = (kieuDang) =>
  axios.post(`${REST_API_BASE_URL}/update`, kieuDang, {
    headers: {
      "Content-Type": "application/json",
    },
  });
