import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/giohangchitiet";

export const getByKhachHangId = (khachHangId) =>
  axios.get(`${REST_API_BASE_URL}/khachhang/${khachHangId}`);

export const addByKhachHangId = (khachHangId, gioHangChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/${khachHangId}`, gioHangChiTiet);

export const updateGioHangChiTiet = (gioHangChiTietId, soLuong) => {
  const requestBody = { newQuantity: soLuong };
  return axios.put(
    `${REST_API_BASE_URL}/update/${gioHangChiTietId}`,
    requestBody
  );
};

export const deleteGioHangChiTiet = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);
