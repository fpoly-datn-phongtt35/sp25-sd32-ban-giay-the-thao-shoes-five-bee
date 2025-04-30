import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchCustomerId } from "../service/LoginService.js";
import { addDiaChi } from "../service/DiaChiService.js";
import {
  getProvinces,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
} from "../service/Address.js";

function AddressModal({ onAddAddress }) {
  const [show, setShow] = useState(false);
  const [khachHangId, setKhachHangId] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [diaChi, setDiaChi] = useState({
    tenDiaChi: "",
    tenNguoiNhan: "",
    sdtNguoiNhan: "",
    xa: "",
    huyen: "",
    thanhPho: "",
    trangThai: 1,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fetch customer ID
  useEffect(() => {
    const getCustomerId = async () => {
      const id = await fetchCustomerId();
      if (id) {
        setKhachHangId(id);
      } else {
        alert("Không thể lấy ID khách hàng. Vui lòng thử lại.");
      }
    };
    getCustomerId();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvinces();
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy tỉnh/thành phố", error);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedProvince_id = selectedOption.value;
    const selectedProvince_name = selectedOption.text;
    console.log(selectedProvince_name);

    setDiaChi((prevState) => ({
      ...prevState,
      thanhPho: selectedProvince_name,
    }));

    try {
      const response = await getDistrictsByProvinceId(selectedProvince_id);
      setDistricts(response.data);
      setWards([]); // Reset wards khi chọn tỉnh mới
    } catch (error) {
      console.error("Lỗi khi lấy quận/huyện", error);
    }
  };

  // Fetch wards based on selected district
  const handleDistrictChange = async (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedDistrict_id = selectedOption.value;
    const selectedDistrict_name = selectedOption.text;

    setDiaChi((prevState) => ({ ...prevState, huyen: selectedDistrict_name }));

    try {
      const response = await getWardsByDistrictId(selectedDistrict_id);
      setWards(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy phường/xã", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiaChi((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!khachHangId) {
      console.error("Khách hàng ID không khả dụng");
      return;
    }
    try {
      const response = await addDiaChi(khachHangId, diaChi);
      if (response.data) {
        onAddAddress(response.data);
      }
      handleClose();
    } catch (error) {
      console.error("Lỗi khi tạo địa chỉ", error);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        + Thêm địa chỉ mới
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Body>
          <Modal.Title>Địa chỉ mới</Modal.Title>

          <Form onSubmit={handleSubmit} style={{marginTop: 20}}>
            <Form.Group controlId="formFullName">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên"
                name="tenNguoiNhan"
                value={diaChi.tenNguoiNhan}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formPhoneNumber" className="mt-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                name="sdtNguoiNhan"
                value={diaChi.sdtNguoiNhan}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formProvince" className="mt-3">
              <Form.Label>Tỉnh/Thành phố</Form.Label>
              <Form.Control
                as="select"
                name="thanhPho"
                onChange={handleProvinceChange}
              >
                <option>Chọn tỉnh/thành phố</option>
                {provinces.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDistrict" className="mt-3">
              <Form.Label>Quận/Huyện</Form.Label>
              <Form.Control
                as="select"
                name="huyen"
                onChange={handleDistrictChange}
              >
                <option>Chọn quận/huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formWard" className="mt-3">
              <Form.Label>Phường/Xã</Form.Label>
              <Form.Control as="select" name="xa" onChange={handleInputChange}>
                <option>Chọn phường/xã</option>
                {wards.map((ward) => (
                  <option key={ward.WardID} value={ward.WardID}>
                    {ward.WardName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formSpecificAddress" className="mt-3">
              <Form.Label>Địa chỉ cụ thể</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa chỉ cụ thể"
                name="tenDiaChi"
                value={diaChi.tenDiaChi}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formDefaultAddress" className="mt-3">
              <Form.Check
                checked={diaChi.trangThai === 1}
                onChange={(e) =>
                  setDiaChi((prevState) => ({
                    ...prevState,
                    trangThai: e.target.checked ? 1 : 0,
                  }))
                }
                type="checkbox"
                label="Đặt làm địa chỉ mặc định"
              />
            </Form.Group>
          </Form>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Trở Lại
            </Button>
            <Button variant="danger" type="submit" onClick={handleSubmit}>
              Hoàn Thành
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddressModal;
