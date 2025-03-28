import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Row, Col, Spin, message } from 'antd';
import { detailKhachHang } from '../service/KhachHangService';

const CustomerInfo = ({ customerId, onCustomerDataChange }) => {
  const [customerData, setCustomerData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await detailKhachHang(customerId);
        setCustomerData(response.data);
        onCustomerDataChange(response.data);
      } catch (err) {
        message.error('Lỗi khi lấy thông tin khách hàng!');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId]);

  if (loading) return <Spin tip="Đang tải thông tin khách hàng..." />;

  return (
    <Card title="Thông Tin Khách Hàng" bordered={false} style={{ marginBottom: 20 }}>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Email">
              <Input value={customerData.email} readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Họ và tên">
              <Input value={customerData.hoTen} readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số điện thoại">
              <Input value={customerData.soDienThoai} readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CustomerInfo;