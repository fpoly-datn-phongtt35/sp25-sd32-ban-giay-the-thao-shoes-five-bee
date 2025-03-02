import axios from "../axiosConfig";

const REST_API_BASE_URL = "http://localhost:5000/api/auth";

export const signupCustomer = (signupData) =>
  axios.post(`${REST_API_BASE_URL}/signup`, signupData);

export const verifyOtp = async (email, otpCode) => {
  return await axios.post(`${REST_API_BASE_URL}/check-otp`, { email, otpCode });
};

export const resendOtp = async (email) => {
  return await axios.post(`${REST_API_BASE_URL}/reload-otp`, { email });
};