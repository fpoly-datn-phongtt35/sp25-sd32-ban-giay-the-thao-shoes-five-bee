import axios from "../axiosConfig";

const REST_API_BASE_URL = "http://localhost:5000/api/auth";

export const loginCustomer = async (email, matKhau) => {
  try {
    console.log("Gửi yêu cầu đăng nhập với:", { email, matKhau });
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      matKhau,
    });
    if (response.data && response.data.jwt) {
      // Lưu thông tin vào sessionStorage
      sessionStorage.setItem("token", response.data.jwt);
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          username: response.data.username,
          email: response.data.email,
          hoTen: response.data.hoTen,
          roles: response.data.roles,
        })
      );

      localStorage.setItem("roles", JSON.stringify(response.data.roles));
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    let errorMessage = "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.";
    let status = 500;

    if (error.response) {
      status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = "Email hoặc mật khẩu không hợp lệ.";
          break;
        case 401:
          errorMessage = "Sai email hoặc mật khẩu.";
          break;
        case 404:
          errorMessage = "Tài khoản không tồn tại.";
          break;
        default:
          errorMessage = error.response.data.message || errorMessage;
      }
    }

    throw new Error(JSON.stringify({ status, message: errorMessage }));
  }
};

export const fetchCustomerId = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw { status: 401, message: "Người dùng chưa đăng nhập." };

    const response = await axios.get(`${REST_API_BASE_URL}/customer/id`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy ID khách hàng:", error);
    throw error;
  }
};
