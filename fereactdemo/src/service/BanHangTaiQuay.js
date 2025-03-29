import axios from "../axiosConfig";

const REST_API_BASE_URL = "/api/ban-hang-tai-quay";

export const thanhToanTaiQuay = (idHoaDon, hoaDonRequest) => {
  // Chỉ thêm idGiamGia vào params nếu nó tồn tại
  const params = {
    hinhThucThanhToan: hoaDonRequest.hinhThucThanhToan,
    isGiaoHang: hoaDonRequest.isGiaoHang || false,
    idGiamGia: hoaDonRequest.idGiamGia || null // Thêm giá trị mặc định là null
  };

  console.log("Request params:", params); // Debug log

  return axios.post(
    `${REST_API_BASE_URL}/thanh-toan/${idHoaDon}`,
    hoaDonRequest,
    { params }
  );
};

export const createHoaDonBanHangTaiQuay = () => {
  return axios.post(`${REST_API_BASE_URL}/create`);
};

export const themSanPhamVaoHoaDon = async (idHoaDon, idSanPham) => {
  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/add-product/${idHoaDon}`,
      null,
      { params: { idSanPham } }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw new Error("Lỗi khi thêm sản phẩm vào hóa đơn");
  }
};

export const updateSoLuongGiay = async (idHoaDonChiTiet, isIncrease) => {
  try {
    const response = await axios.put(
      `${REST_API_BASE_URL}/update-quantity/${idHoaDonChiTiet}`,
      null,
      {
        params: { isIncrease },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng giày:", error);
    throw error;
  }
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

export const deleteSanPhamHoaDonChiTiet = (idHoaDonChiTiet) => {
  return axios.delete(`${REST_API_BASE_URL}/delete-detail/${idHoaDonChiTiet}`);
};
export const scanQRCodeFromWebcam = () => {
  return axios.get(`${REST_API_BASE_URL}/scan-webcam`);
};
