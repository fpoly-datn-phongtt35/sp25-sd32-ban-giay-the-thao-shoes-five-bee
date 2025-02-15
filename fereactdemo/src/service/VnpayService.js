import axios from "axios";

const REST_API_URL = "http://localhost:5000/api/vnpay";

export const createVNPayPayment = (paymentData) => {
  return axios.post(`${REST_API_URL}/create-payment`, paymentData);
};

export const vnpayReturn = (queryParams) => {
  return axios.get(`${REST_API_URL}/return`, { params: queryParams });
};
