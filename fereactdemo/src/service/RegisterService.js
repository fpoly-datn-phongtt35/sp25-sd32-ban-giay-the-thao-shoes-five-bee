import axios from "../axiosConfig";

const REST_API_BASE_URL = "/api/auth";

export const signupCustomer = (signupData) =>
  axios.post(`${REST_API_BASE_URL}/signup`, signupData);

export const verifyOtp = async (email, otp) => {
  return await axios.post(`${REST_API_BASE_URL}/check-otp`, { email, otp });
};

export const resendOtp = async (email) => {
  return await axios.post(`${REST_API_BASE_URL}/reload-otp`, { email });
};