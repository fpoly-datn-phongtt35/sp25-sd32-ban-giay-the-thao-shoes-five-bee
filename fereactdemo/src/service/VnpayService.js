import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000";

export const createVNPayPayment = (amount, orderId) => {
  return axios.get(`${REST_API_BASE_URL}/pay`, {
    params: {
      amount: amount,
      orderId: orderId
    }
  });
};

export const vnpayReturn = (queryParams) => {
  return axios.get(`${REST_API_BASE_URL}/return`, { params: queryParams });
};
