import axios from "../axiosConfig";

const REST_API_BASE_URL = "http://localhost:5000/hoa-don-chi-tiet";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
export const getHoaDonChiTiet1 = () =>
  axios.get(`${REST_API_BASE_URL}/hien-thi`, config);

export const addHoaDonChiTiet1 = (hoaDonChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/add`, hoaDonChiTiet, config);

export const deleteHoaDonChiTiet1 = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`, config);

export const updateHoaDonChiTiet1 = (id, hoaDonChiTiet) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, hoaDonChiTiet, config);


//truongcute
export const getHoaDonChiTiet = () => axios.get(REST_API_BASE_URL, config);

export const addHoaDonChiTiet = (hoaDonChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/add`, hoaDonChiTiet, config);

export const deleteHoaDonChiTiet = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`, config);

export const updateHoaDonChiTiet = (id, hoaDonChiTiet) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, hoaDonChiTiet, config);
//Truong

export const detailHoaDonChiTiet = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`, config);

export const printfHoaDonChiTiet = (id) =>
  axios.get(`${REST_API_BASE_URL}/download-pdf-hdct/${id}`, {
    ...config,
    responseType: "arraybuffer",
  });
