import axios from 'axios';

const API_URL_DISTRICT = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district';
const API_URL_PROVINCE = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province';
const API_URL_WARD = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';
const TOKEN = '03192cdb-9b27-11ee-96dc-de6f804954c9';  // Thay thế bằng token thực tế của bạn

// Lấy danh sách quận/huyện dựa trên province_id
export const getDistrictsByProvinceId = async (provinceId) => {
  try {
    const response = await axios.post(
      API_URL_DISTRICT,
      { province_id: parseInt(provinceId, 10) }, // Dữ liệu body
      {
        headers: {
          Token: TOKEN,  // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Lỗi khi lấy danh sách quận/huyện:', error);
    throw error;
  }
};

// Lấy danh sách tỉnh/thành phố
export const getProvinces = async () => {
  try {
    const response = await axios.get(API_URL_PROVINCE, {
      headers: {
        Token: TOKEN,  // Thêm token vào header
      },
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
    throw error;
  }
};

// Lấy danh sách phường/xã dựa trên district_id
export const getWardsByDistrictId = async (districtId) => {
  try {
    const response = await axios.post(
      API_URL_WARD,
      { district_id: parseInt(districtId, 10) }, // Dữ liệu body
      {
        headers: {
          Token: TOKEN,  // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phường/xã:', error);
    throw error;
  }
};
