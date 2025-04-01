import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/tra-hang";

export const getAllReturnOrder = () => axios.get(`${REST_API_BASE_URL}/getAll`);

export const fetchOrderDetails = (orderId) =>
  axios.get(`${REST_API_BASE_URL}/status/${orderId}`);

export const createReturnOrder = async (orderId, returnItems) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${REST_API_BASE_URL}/${orderId}`,
      returnItems,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo đơn trả hàng:", error);
    throw error;
  }
}
export const updateReturnOrderStatus = (orderId, returnOrder) =>
  axios.put(`${REST_API_BASE_URL}/update/${orderId}`, returnOrder);

