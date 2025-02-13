import React, { useState, useEffect } from 'react';
import { detailKhachHang } from '../service/KhachHangService.js';

const CustomerInfo = ({ customerId, onCustomerDataChange }) => {
  const [customerData, setCustomerData] = useState({
    email: '',
    hoTen: '',
    soDienThoai: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await detailKhachHang(customerId);
        setCustomerData(response.data);
        onCustomerDataChange(response.data); // Gọi hàm callback khi dữ liệu được tải về
        // console.log(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prevData => {
      const updatedData = { ...prevData, [name]: value };
      onCustomerDataChange(updatedData); // Gọi hàm callback khi có thay đổi
      return updatedData;
    });
    console.log(customerData);
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="section">
      <div className="section_item">
        <div><label htmlFor="email">Email:</label></div>     
      <div><input
          name="email"
          id="email"
          type="email"
          placeholder="Email"
          value={customerData.email}
          onChange={handleChange}
          readOnly
        /></div>       
      </div>

      <div className="section_item">
        <div><label htmlFor="hoTen">Họ Tên:</label></div>      
      <div><input
          name="hoTen"
          id="fullName"
          type="text"
          placeholder="Họ và tên"
          value={customerData.hoTen}
          onChange={handleChange}
          readOnly
        /></div>       
      </div>

      <div className="section_item">
        <div><label htmlFor="soDienThoai">SĐT:</label></div>
      <div><input
          name="soDienThoai"
          id="phoneNumber"
          type="text"
          placeholder="Số điện thoại (tùy chọn)"
          value={customerData.soDienThoai}
          onChange={handleChange}
          readOnly
        /></div>
      </div> 
    </div>
  );
};

export default CustomerInfo;
