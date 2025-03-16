import axios from "../axiosConfig";

const REST_API_BASE_URL = "http://localhost:5000/api/hoadonchitiet";

export const getHoaDonChiTiet1 = () =>
  axios.get(`${REST_API_BASE_URL}/hien-thi`);

export const addHoaDonChiTiet1 = (hoaDonChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/add`, hoaDonChiTiet);

export const deleteHoaDonChiTiet1 = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateHoaDonChiTiet1 = (id, hoaDonChiTiet) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, hoaDonChiTiet);


//truongcute
export const getHoaDonChiTiet = () => axios.get(REST_API_BASE_URL);

export const addHoaDonChiTiet = (hoaDonChiTiet) =>
  axios.post(`${REST_API_BASE_URL}/add`, hoaDonChiTiet);

export const deleteHoaDonChiTiet = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateHoaDonChiTiet = (id, hoaDonChiTiet) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, hoaDonChiTiet);
//Truong

export const detailHoaDonChiTiet = (id) =>
  axios.get(`${REST_API_BASE_URL}/detail/${id}`);

export const printfHoaDonChiTiet = (id) =>
  axios.get(`${REST_API_BASE_URL}/download-pdf-hdct/${id}`, {
    responseType: "blob",
  });
