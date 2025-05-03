import axios from "../axiosConfig";

const REST_API_BASE_URL = "/danh-muc";

// Lấy token từ localStorage hoặc sessionStorage
const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

export const getDanhMuc = () => axios.post(`${REST_API_BASE_URL}/getAll`, config);

export const addDanhMuc = async (danhMuc) => {
    try {
        const response = await axios.post(`${REST_API_BASE_URL}/add`, danhMuc, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data); // Lỗi nhập liệu từ client
        } else {
            throw new Error("Danh mục đã tồn tại hoặc có lỗi khi thêm mới");
        }
    }
};


export const deleteDanhMuc = (id) =>
    axios.post(`${REST_API_BASE_URL}/delete`, { id }, config);

export const updateDanhMuc = (danhMuc) =>
    axios.post(`${REST_API_BASE_URL}/update`, danhMuc, config, {
        headers: {
            "Content-Type": "application/json",
        },
    });

