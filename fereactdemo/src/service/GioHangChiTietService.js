import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/gio-hang-chi-tiet";

const REST_API_BASE_URLS = "http://localhost:5000/gio-hang";


// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
export const getByKhachHangId = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${REST_API_BASE_URLS}/getAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

export const getGioHangChiTietCheckOut = async (ids) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/check-out`, ids, config, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm khi check-out:', error);
    return [];
  }
};

export const countProductsInCart = async (idGioHang) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URLS}/tong-so-luong/${idGioHang}`, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tổng số lượng sản phẩm trong giỏ:', error);
    return 0;
  }
};
export const addToCart = (idGiayChiTiet, soLuong) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${REST_API_BASE_URL}/add-to-cart`,
    null,
    {
      params: { idGiayChiTiet, soLuong },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateGioHangChiTiet = (idGioHangChiTiet, isIncrease) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${REST_API_BASE_URL}/update-so-luong`,
    null,
    {
      params: { idGioHangChiTiet, isIncrease: isIncrease > 0 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteGioHangChiTiet = (idGioHangChiTiet) => {
  const token = localStorage.getItem("token");
  return axios.delete(
    `${REST_API_BASE_URL}/delete-giay`,
    {
      params: { idGioHangChiTiet },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
