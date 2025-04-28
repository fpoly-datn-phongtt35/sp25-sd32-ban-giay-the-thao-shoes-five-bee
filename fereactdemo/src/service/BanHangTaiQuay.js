import axios from "../axiosConfig";

const REST_API_BASE_URL = "/api/ban-hang-tai-quay";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

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
    { params }, config
  );
};

export const createHoaDonBanHangTaiQuay = () => {
  return axios.post(`${REST_API_BASE_URL}/create`, config);
};

export const themSanPhamVaoHoaDon = async (idHoaDon, idSanPham) => {
  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/add-product/${idHoaDon}`,
      null,
      { params: { idSanPham } }, config
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
      null, // Không cần body
      { params: { isIncrease } } // Query params truyền đúng như backend yêu cầu
    );
    console.log("✅ API JSON Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi API updateSoLuongGiay:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw new Error("Lỗi khi cập nhật số lượng giày");
  }
};

export const getListHoaDonCho = () => {
  return axios.get(`${REST_API_BASE_URL}/list`, config);
};
export const getSanPhamTrongHoaDon = (idHoaDon) => {
  return axios.get(
    `${REST_API_BASE_URL}/san-pham/${idHoaDon}`, config
  );
};
export const deleteHoaDonCho = (idHoaDon) => {
  return axios.delete(`${REST_API_BASE_URL}/delete/${idHoaDon}`, config);
};

export const deleteAllHoaDonCho = (idHoaDons) => {
  return axios.delete(`${REST_API_BASE_URL}/delete-all`, config, { data: idHoaDons });
};

export const deleteSanPhamHoaDonChiTiet = (idHoaDonChiTiet) => {
  return axios.delete(`${REST_API_BASE_URL}/delete-detail/${idHoaDonChiTiet}`, config);
};
export const scanQRCodeFromWebcam = () => {
  return axios.get(`${REST_API_BASE_URL}/scan-webcam`, config);
};
