import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/returns";

export const getAllReturnOrder = () => axios.get(REST_API_BASE_URL);

export const fetchOrderDetails = (orderId) =>
  axios.get(`${REST_API_BASE_URL}/status/${orderId}`);

export const createReturnRequest = (returnRequest) =>
  axios.post(`${REST_API_BASE_URL}/add/status`, returnRequest);

export const updateReturnOrderStatus = (orderId, returnOrder) =>
  axios.put(`${REST_API_BASE_URL}/update/${orderId}`, returnOrder);

// export const deleteDiaChi = (id) => axios.delete(`${REST_API_BASE_URL}/delete/${id}`);
