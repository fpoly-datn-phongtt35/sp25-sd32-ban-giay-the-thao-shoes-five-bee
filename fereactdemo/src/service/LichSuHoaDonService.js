import axios from "../axiosConfig";

const REST_API_BASE_URL = "/lich-su-hoa-don";

export const getLichSuHoaDon = () => axios.get(`${REST_API_BASE_URL}/getAll`);






