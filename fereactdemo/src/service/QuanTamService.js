import axios from "../axiosConfig";

const REST_API_BASE_URL = "/subscribe";

export const subscribeToProduct = (giayChiTietId) => {
    return axios.post(`${REST_API_BASE_URL}?id=${giayChiTietId}`);
};