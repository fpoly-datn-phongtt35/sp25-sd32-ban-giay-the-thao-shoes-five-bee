import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateDiaChi } from '../service/DiaChiService.js';
import { getProvinces, getDistrictsByProvinceId, getWardsByDistrictId } from '../service/Address.js';

function UpdateAddressModal({ addressData, onAddAddress }) {
  const [show, setShow] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [diaChi, setDiaChi] = useState({
    tenDiaChi: addressData.tenDiaChi,
    tenNguoiNhan: addressData.tenNguoiNhan,
    sdtNguoiNhan: addressData.sdtNguoiNhan,
    xa: addressData.xa,
    huyen: addressData.huyen,
    thanhPho: addressData.thanhPho,
    trangThai: 1,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvinces();
        setProvinces(response.data); // Giả sử response trả về object data
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

    setDiaChi(prevState => ({ ...prevState, thanhPho: selectedProvince_name }));

    try {
      const response = await getDistrictsByProvinceId(selectedProvince_id);
      setDistricts(response.data);
      setWards([]);  // Reset wards khi chọn tỉnh mới
    } catch (error) {
      console.error("Lỗi khi lấy quận/huyện", error);
    }
  };

  // Fetch wards based on selected district
  const handleDistrictChange = async (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedDistrict_id = selectedOption.value;
    const selectedDistrict_name = selectedOption.text;

    setDiaChi(prevState => ({ ...prevState, huyen: selectedDistrict_name }));

    try {
      const response = await getWardsByDistrictId(selectedDistrict_id);
      setWards(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy phường/xã", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiaChi(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addressData.id) {
      console.error('Khách hàng ID không khả dụng');
      return;
    }
    try {
      const response = await updateDiaChi(addressData.id, diaChi);
      console.log(response.data);
      if (response.data) {
        onAddAddress(response.data);  // Gọi hàm callback để cập nhật danh sách địa chỉ
      }
      handleClose();  // Đóng modal sau khi hoàn thành
    } catch (error) {
      console.error("Lỗi khi tạo địa chỉ", error);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        cập nhập địa chỉ
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cập Nhập Địa Chỉ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
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
              <Form.Control as="select" name="thanhPho" onChange={handleProvinceChange}>
                <option>Chọn tỉnh/thành phố</option>
                {provinces.map(province => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDistrict" className="mt-3">
              <Form.Label>Quận/Huyện</Form.Label>
              <Form.Control as="select" name="huyen" onChange={handleDistrictChange}>
                <option>Chọn quận/huyện</option>
                {districts.map(district => (
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
                {wards.map(ward => (
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
                onChange={(e) => setDiaChi(prevState => ({ ...prevState, trangThai: e.target.checked ? 1 : 0 }))}
                type="checkbox"
                label="Đặt làm địa chỉ mặc định"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Trở Lại
          </Button>
          <Button variant="danger" type="submit" onClick={handleSubmit}>
            Hoàn Thành
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateAddressModal;
