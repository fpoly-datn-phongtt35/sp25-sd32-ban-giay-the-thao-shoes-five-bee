import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Row, Col, Button, Spin, message } from 'antd';
import { getDiaChiByKhachHangId } from '../service/DiaChiService';
import AddressModal from '../address/AddressModal';

// Thêm prop moTa để nhận dữ liệu từ component Bill
const DataCustomerInfo = ({ customerId, onDiaChiChange, moTa }) => {
  const [customerData, setCustomerData] = useState([]);
  // Thay đổi state để sử dụng giá trị từ prop
  const [ghiChu, setGhiChu] = useState(moTa || '');
  const [loading, setLoading] = useState(true);
  const [diaChiList, setDiaChiList] = useState([]);

  // Cập nhật giá trị ghiChu khi prop moTa thay đổi
  useEffect(() => {
    if (moTa !== undefined) {
      setGhiChu(moTa);
    }
  }, [moTa]);

  const handleAddAddress = (newAddress) => {
    setDiaChiList([...diaChiList, newAddress]);
    message.success('Thêm địa chỉ thành công!');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDiaChiByKhachHangId(customerId);
        const filtered = response.data.filter(item => item.trangThai === 1);
        setCustomerData(filtered);
        if (filtered.length > 0) {
          onDiaChiChange({
            diaChi: `${filtered[0].diaChiCuThe}, ${filtered[0].xa}, ${filtered[0].huyen}, ${filtered[0].thanhPho}`,
            moTa: ghiChu,
          });
        }
      } catch (err) {
        message.error('Lỗi khi lấy địa chỉ!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerId, diaChiList]);

  const handleChange = (e) => {
    setGhiChu(e.target.value);
    // Chỉ gửi moTa lên component cha, không gửi diaChi
    onDiaChiChange({ moTa: e.target.value });
  };

  if (loading) return <Spin tip="Đang tải thông tin..." />;

  return (
    <Card title="Thông Tin Địa Chỉ" bordered={false} style={{ marginBottom: 20 }}>
      {customerData.length > 0 ? (
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tỉnh / Thành phố">
                <Input value={customerData[0].thanhPho} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Huyện / Quận">
                <Input value={customerData[0].huyen} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Xã / Phường">
                <Input value={customerData[0].xa} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Địa chỉ cụ thể">
                <Input value={customerData[0].diaChiCuThe} readOnly />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ghi chú (tùy chọn)">
                <Input value={ghiChu} onChange={handleChange} placeholder="Nhập ghi chú nếu có..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        <>
          <p>Chưa có địa chỉ nào được thiết lập.</p>
          <AddressModal onAddAddress={handleAddAddress} />
        </>
      )}
    </Card>
  );
};

export default DataCustomerInfo;