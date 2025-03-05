import axios from "../axiosConfig";
import { jwtDecode } from "jwt-decode";

const REST_API_BASE_URL = "http://localhost:5000/api/auth";

export const loginCustomer = async (email, matKhau) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/login`, { email: email || "", matKhau: matKhau || "" });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(JSON.stringify(error.response.data));
    } else if (error.request) {
      throw new Error("Không thể kết nối đến máy chủ.");
    } else {
      throw new Error("Đã xảy ra lỗi trong quá trình xử lý.");
    }
  }
};
const handleError = (error) => {
  let errorMessage = "Đã xảy ra lỗi!";

  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        errorMessage = data.message || "Yêu cầu không hợp lệ.";
        break;
      case 403:
        errorMessage = "Bạn không có quyền truy cập.";
        break;
      case 404:
        errorMessage = "Email không tồn tại.";
        break;
      default:
        errorMessage = `Lỗi: ${status}. Chi tiết: ${data}`;
        break;
    }
  }
  throw new Error(errorMessage);
};

export const decodeToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return [];
  try {
    const decoded = jwtDecode(token);
    return decoded.roles || [];
  } catch (error) {
    console.error("Lỗi khi giải mã token:", error);
    return [];
  }
};

const getToken = () => {
  return localStorage.getItem('token');
}

const getRole = () => {
  const decodeToken = this.decodeToken();
  return decodeToken ? decodeToken.role : null;
}

const isLoggedIn = () => {
  return !!getToken();
}

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('cart');
  localStorage.removeItem('idGioHang');
}

const isAdmin = () => getRole() === "ROLE_ADMIN";

const isUser = () => getRole() === "ROLE_USER";

const isStaff = () => getRole() === "ROLE_STAFF";

const checkEmail = async (email) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/check-email`, { email });
    return response.data.exits;
  } catch (error) {
    return handleError(error);
  }
};

const checkOtp = async (userOtpDto) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/check-otp`, userOtpDto);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const sendBackOtp = async (userOtpDto) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/sendBack-otp`, userOtpDto);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchCustomerId = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw { status: 401, message: "Người dùng chưa đăng nhập." };

    const response = await axios.get(`${REST_API_BASE_URL}/user/id`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy ID khách hàng:", error);
    throw error;
  }
};
