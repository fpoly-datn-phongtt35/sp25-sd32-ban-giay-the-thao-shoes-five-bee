import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Select, Input, Spin } from "antd";
import axios from "axios";

const AddressModal = ({ visible, onClose, setDiaChi }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [houseNumber, setHouseNumber] = useState(""); // 🏠 Số nhà
  const [note, setNote] = useState(""); // 📝 Ghi chú

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://provinces.open-api.vn/api/?depth=1");
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (provinceCode) => {
    setSelectedProvince(provinceCode);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setWards([]);
    try {
      setLoading(true);
      const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      setDistricts(response.data.districts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận/huyện:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = async (districtCode) => {
    setSelectedDistrict(districtCode);
    setSelectedWard(null);
    try {
      setLoading(true);
      const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      setWards(response.data.wards);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường/xã:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    const provinceName = provinces.find(p => p.code === selectedProvince)?.name || "";
    const districtName = districts.find(d => d.code === selectedDistrict)?.name || "";
    const wardName = wards.find(w => w.code === selectedWard)?.name || "";

    const fullAddress = `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}${note ? ` (${note})` : ""}`;
    setDiaChi(fullAddress);
    onClose();
  };

  return (
    <Modal title="Chọn địa chỉ" open={visible} onCancel={onClose} footer={null}>
      <Spin spinning={loading}>
        <Form layout="vertical">
          {/* Số nhà */}
          <Form.Item label="Số nhà">
            <Input
              placeholder="Nhập số nhà, tên đường, tên ngõ (nếu có)"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
          </Form.Item>

          {/* Tỉnh/Thành phố */}
          <Form.Item label="Tỉnh/Thành phố">
            <Select onChange={handleProvinceChange} placeholder="Chọn tỉnh/thành phố">
              {provinces.map((p) => (
                <Select.Option key={p.code} value={p.code}>{p.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Quận/Huyện */}
          <Form.Item label="Quận/Huyện">
            <Select onChange={handleDistrictChange} placeholder="Chọn quận/huyện" disabled={!selectedProvince}>
              {districts.map((d) => (
                <Select.Option key={d.code} value={d.code}>{d.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Phường/Xã */}
          <Form.Item label="Phường/Xã">
            <Select onChange={(value) => setSelectedWard(value)} placeholder="Chọn phường/xã" disabled={!selectedDistrict}>
              {wards.map((w) => (
                <Select.Option key={w.code} value={w.code}>{w.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Ghi chú */}
          <Form.Item label="Ghi chú">
            <Input.TextArea
              placeholder="Nhập ghi chú (nếu có)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </Form.Item>

          <Button type="primary" onClick={handleConfirm} disabled={!selectedWard}>
            Xác nhận
          </Button>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddressModal;
