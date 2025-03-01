import axios from "../axiosConfig";

const REST_API_BASE_URL = "/api/ban-hang-tai-quay";

const banHangTaiQuayService = {
  

  thanhToanTaiQuay: (idHoaDon, hoaDonRequest) => {
    return axios.post(`${REST_API_BASE_URL}/thanh-toan/${idHoaDon}`, hoaDonRequest);
  },


  createHoaDonBanHangTaiQuay: () => {
    return axios.post(`${REST_API_BASE_URL}/create`);
  },


  themSanPhamVaoHoaDon: (idHoaDon, idSanPham) => {
    return axios.post(`${REST_API_BASE_URL}/add-product/${idHoaDon}`, null, {
      params: { idSanPham }
    });
  },


  updateSoLuongGiay: (idHoaDonChiTiet, isIncrease) => {
    return axios.put(`${REST_API_BASE_URL}/update-quantity/${idHoaDonChiTiet}`, null, {
      params: { isIncrease }
    });
  },


  getListHoaDonCho: () => {
    return axios.get(`${REST_API_BASE_URL}/list`);
  },


  deleteHoaDonCho: (idHoaDon) => {
    return axios.delete(`${REST_API_BASE_URL}/delete/${idHoaDon}`);
  },


  deleteAllHoaDonCho: (idHoaDons) => {
    return axios.delete(`${REST_API_BASE_URL}/delete-all`, { data: idHoaDons });
  },

  deleteHoaDonChiTiet: (idHoaDonChiTiet) => {
    return axios.delete(`${REST_API_BASE_URL}/delete-detail/${idHoaDonChiTiet}`);
  }
};

export default banHangTaiQuayService;
