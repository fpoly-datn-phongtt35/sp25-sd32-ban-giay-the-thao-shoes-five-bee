import axios from "../axiosConfig";

const REST_API_BASE_URL = "/api/ban-hang-tai-quay";

export const createHoaDonBanHangTaiQuay = () => 
  axios.post(`${REST_API_BASE_URL}/create`);

export const themSanPhamVaoHoaDon = (idHoaDon, idSanPham) =>
  axios.post(`${REST_API_BASE_URL}/add-product/${idHoaDon}?idSanPham=${idSanPham}`);

export const updateSoLuongGiay = (idHoaDonChiTiet, isIncrease) =>
  axios.put(`${REST_API_BASE_URL}/update-quantity/${idHoaDonChiTiet}?isIncrease=${isIncrease}`);

export const getListHoaDonCho = () =>
  axios.get(`${REST_API_BASE_URL}/list`);

export const deleteHoaDonCho = (idHoaDon) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${idHoaDon}`);

export const deleteAllHoaDonCho = (idHoaDons) =>
  axios.delete(`${REST_API_BASE_URL}/delete-all`, { data: idHoaDons });

export const deleteHoaDonChiTiet = (idHoaDonChiTiet) =>
  axios.delete(`${REST_API_BASE_URL}/delete-detail/${idHoaDonChiTiet}`);

export const thanhToanTaiQuay = (idHoaDon, hoaDonRequest) =>
  axios.post(`${REST_API_BASE_URL}/thanh-toan/${idHoaDon}`, hoaDonRequest); 