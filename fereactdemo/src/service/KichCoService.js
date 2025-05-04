import axios from "../axiosConfig";

const REST_API_BASE_URL = "/kich-co";

export const getSizes = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const createSize = async (size) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/add`, size);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errMsg = typeof error.response.data === "string"
        ? error.response.data
        : error.response.data.message || JSON.stringify(error.response.data);
      throw new Error(errMsg);
    } else {
      throw new Error("Có lỗi xảy ra khi thêm kích cỡ");
    }
  }
};



export const deleteSize = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updateSize = (size) =>
  axios.post(`${REST_API_BASE_URL}/update`, size, {
    headers: {
      "Content-Type": "application/json",
    },
  });

