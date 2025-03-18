import axios from "../axiosConfig";
const REST_API_BASE_URL = "/trang-thai-hoa-don";

const REST_API_BASE_URLS = "http://localhost:5000/api/online";

const REST_API_BASE_URLSS = "http://localhost:5000/hoa-don-chi-tiet";

export const getHoaDon1 = () => axios.get(REST_API_BASE_URL);

export const getHoaDonByKhachHangId1 = (userId) =>
  axios.get(`${REST_API_BASE_URLS}/user/${userId}`);

export const getHoaDonById1 = (hoaDonId) =>
  axios.get(`${REST_API_BASE_URL}/${hoaDonId}`);

export const updateOrderAddress = async (hoaDonId, diaChiId) => {
  try {
    const response = await axios.put(`${REST_API_BASE_URLSS}/${hoaDonId}/update-address`, null, {
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
    const response = await axios.put(`${REST_API_BASE_URLSS}/${idHoaDon}/items/${idGiayChiTiet}/quantity`, {
      soLuong: quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
    throw error;
  }
};

export const paymentOnline = (banHangOnlineRequest) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${REST_API_BASE_URLS}/thanh-toan`,
    banHangOnlineRequest,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const huyDonMuaUser = (id) =>
  axios.put(`${REST_API_BASE_URL}/${id}/huy`);

export const deleteHoaDon1 = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

//Truongcute
export const getHoaDon = () => axios.get(`${REST_API_BASE_URL}/getAll`);

export const addHoaDon = (hoaDon) =>
  axios.post(`${REST_API_BASE_URL}/add`, hoaDon);

export const addProduct = (hoaDon) =>
  axios.post(`${REST_API_BASE_URL}/add-product`, hoaDon);
export const deleteHoaDon = (id) =>
  axios.delete(`${REST_API_BASE_URL}/delete/${id}`);

export const updateHoaDon = (id, hoaDon) =>
  axios.put(`${REST_API_BASE_URL}/update/${id}`, hoaDon);

// Truong
export const detailHoaDon = async (id) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
export const xacNhanHoaDon = async (id, data) => {
  try {
    const response = await axios.put(`${REST_API_BASE_URL}/xac-nhan/${id}`, data);
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
