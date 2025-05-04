import axios from "../axiosConfig";
const REST_API_BASE_URL = "/trang-thai-hoa-don";

const REST_API_BASE_URLS = "http://localhost:5000/api/online";

const REST_API_BASE_URLSS = "http://localhost:5000/hoa-don-chi-tiet";

const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getHoaDon1 = () => axios.get(REST_API_BASE_URL, config);

export const getHoaDonByKhachHangId1 = (userId) =>
  axios.get(`${REST_API_BASE_URLS}/user/${userId}`, config);

export const getHoaDonById1 = (hoaDonId) =>
  axios.get(`${REST_API_BASE_URL}/${hoaDonId}`, config);

export const tachNguoiNhanMoiInHoaDon = (hoaDonId, thongTin) => {
  axios.put(`${REST_API_BASE_URL}/hoa-don/${hoaDonId}/cap-nhat-thong-tin-nguoi-nhan`, thongTin, config);
}

export const topSelling = () =>
  axios.get(`http://localhost:5000/hoa-don-chi-tiet/top-selling`, config);

export const updateOrderAddress = async (hoaDonId, diaChiId) => {
  try {
    const response = await axios.put(`${REST_API_BASE_URLSS}/${hoaDonId}/update-address`, null, {
      ...config,
      params: { diaChiId },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ:", error.response?.data || error.message);
    throw error;
  }
};

export const updateOrderItemQuantity = async (idHoaDon, idGiayChiTiet, quantity) => {
  try {
    const response = await axios.put(
      `${REST_API_BASE_URLSS}/${idHoaDon}/items/${idGiayChiTiet}/quantity`,
      { soLuong: quantity },
      config
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
    throw error;
  }
};

export const paymentOnline = async (banHangOnlineRequest) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${REST_API_BASE_URLS}/thanh-toan`,
      banHangOnlineRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data);
    } else {
      throw new Error("Đã xảy ra lỗi khi thanh toán.");
    }
  }
};

export const huyDonMuaUser = (id) =>
  axios.put(`${REST_API_BASE_URL}/${id}/huy`, config);

export const deleteHoaDon1 = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`, config);

//Truongcute
export const getHoaDon = () => axios.get(`${REST_API_BASE_URL}/getAll`, config);

export const addHoaDon = (hoaDon) =>
  axios.post(`${REST_API_BASE_URL}/add`, hoaDon, config);

export const addProduct = (hoaDon) =>
  axios.post(`${REST_API_BASE_URL}/add-product`, hoaDon, config);
export const deleteHoaDon = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`, config);

export const updateHoaDon = (id, hoaDon) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, hoaDon, config);

// Truong
export const detailHoaDon = async (id) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
export const xacNhanHoaDon = async (id, data) => {
  try {
    const response = await axios.put(`${REST_API_BASE_URL}/xac-nhan/${id}`, data, config);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi xác nhận hóa đơn:", error);
    throw error;
  }
};


export const printfHoaDon = (id) =>
  axios.get(`${REST_API_BASE_URL}/download-pdf/${id}`, {
    responseType: "blob",
  });
