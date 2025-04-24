import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000";

export const createVNPayPayment = (amount, orderId) => {
  const token = localStorage.getItem("token"); // hoặc sessionStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      amount: amount,
      orderId: orderId
    }
  };

  return axios.get(`${REST_API_BASE_URL}/pay`, config);
};

export const vnpayReturn = (queryParams) => {
  return axios.get(`${REST_API_BASE_URL}/return`, { params: queryParams });
};
