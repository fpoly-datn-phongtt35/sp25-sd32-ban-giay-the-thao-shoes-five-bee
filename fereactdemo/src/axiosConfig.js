import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Xử lý lỗi 403 (ví dụ: đăng xuất người dùng)
      console.error(
        "Forbidden: You do not have permission to access this resource."
      );
    }
    return Promise.reject(error);
  }
);

export default instance;
