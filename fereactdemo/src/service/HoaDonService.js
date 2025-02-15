import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/hoadon";

export const getHoaDon1 = () => axios.get(REST_API_BASE_URL);

export const getHoaDonByKhachHangId1 = (khachHangId) =>
  axios.get(`${REST_API_BASE_URL}/khachHang/${khachHangId}`);

export const getHoaDonById1 = (hoaDonId) =>
  axios.get(`${REST_API_BASE_URL}/${hoaDonId}`);

export const addHoaDon1 = (khachHangId, hoaDon) =>
  axios.post(`${REST_API_BASE_URL}/add/khachhang/${khachHangId}`, hoaDon);

export const updateHoaDon1 = (id, hoaDon) =>
  axios.put(`${REST_API_BASE_URL}/update1/${id}`, hoaDon);

export const deleteHoaDon1 = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

//Truongcute
export const getHoaDon = () => axios.get(REST_API_BASE_URL);

export const addHoaDon = (hoaDon) =>
  axios.post(`${REST_API_BASE_URL}/add`, hoaDon);

export const deleteHoaDon = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateHoaDon = (id, hoaDon) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, hoaDon);

// Truong
export const detailHoaDon = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);

export const printfHoaDon = (id) =>
  axios.get(`${REST_API_BASE_URL}/download-pdf/${id}`, {
    responseType: "blob",
  });
