import axios from "../axiosConfig";

const REST_API_BASE_URL = "/api/ban-hang-tai-quay";

export const thanhToanTaiQuay = (idHoaDon, hoaDonRequest) => {
  return axios.post(
    `${REST_API_BASE_URL}/thanh-toan/${idHoaDon}`,
    hoaDonRequest
  );
};

export const createHoaDonBanHangTaiQuay = () => {
  return axios.post(`${REST_API_BASE_URL}/create`);
};

export const themSanPhamVaoHoaDon = (idHoaDon, idSanPham) => {
  return axios.post(
    `${REST_API_BASE_URL}/add-product/${idHoaDon}`,
    null, // Không gửi body
    { params: { idSanPham } } // Gửi idSanPham trong query params
  );
};

export const updateSoLuongGiay = (idHoaDonChiTiet, isIncrease) => {
  return axios.put(
    `${REST_API_BASE_URL}/update-quantity/${idHoaDonChiTiet}`,
    null,
    {
      params: { isIncrease },
    }
  );
};

export const getListHoaDonCho = () => {
  return axios.get(`${REST_API_BASE_URL}/list`);
};
export const getSanPhamTrongHoaDon = (idHoaDon) => {
  return axios.get(
    `${REST_API_BASE_URL}/san-pham/${idHoaDon}`
  );
};
export const deleteHoaDonCho = (idHoaDon) => {
  return axios.delete(`${REST_API_BASE_URL}/delete/${idHoaDon}`);
};

export const deleteAllHoaDonCho = (idHoaDons) => {
  return axios.delete(`${REST_API_BASE_URL}/delete-all`, { data: idHoaDons });
};

export const deleteHoaDonChiTiet = (idHoaDonChiTiet) => {
  return axios.delete(`${REST_API_BASE_URL}/delete-detail/${idHoaDonChiTiet}`);
};
