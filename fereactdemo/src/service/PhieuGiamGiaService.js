import axios from "../axiosConfig";

const REST_API_BASE_URL = "/giam-gia-san-pham";

export const getPhieuGiamGia = () => axios.post(`${REST_API_BASE_URL}/getAll`);

export const addPhieuGiamGia = (phieuGiamGia) =>
  axios.post(`${REST_API_BASE_URL}/add`, phieuGiamGia);

export const deletePhieuGiamGia = (id) =>
  axios.post(`${REST_API_BASE_URL}/delete`, { id });

export const updatePhieuGiamGia = (id, phieuGiamGia) =>
  axios.post(`${REST_API_BASE_URL}/update/${id}`, phieuGiamGia);

export const detailPhieuGiamGia = (id) =>
  axios.post(`${REST_API_BASE_URL}/detail/${id}`);
export const taoGiamGia = (GiamGiaChiTietSanPhamRequest) =>
  axios.post(`${REST_API_BASE_URL}/tao-giam-gia`, GiamGiaChiTietSanPhamRequest);