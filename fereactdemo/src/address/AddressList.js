import React, { useEffect, useState } from "react";
import "./AddressList.css";  // Import file CSS cho component này
import { Link } from 'react-router-dom';
import AddressModal from '../address/AddressModal.js';
import UpdateAddressModal from '../address/UpdateAddressModal.js';
import { fetchCustomerId } from '../service/LoginService.js';
import { getDiaChiByKhachHangId,updateDiaChi,deleteDiaChi } from '../service/DiaChiService.js';

export const AddressList = () => {
  const [khachHangId, setKhachHangId] = useState(null);
  const [customerData, setCustomerData] = useState([]); // Khởi tạo danh sách địa chỉ là một mảng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diaChiList, setDiaChiList] = useState([]);

  const handleAddAddress = (newAddress) => {
    setDiaChiList([...diaChiList, newAddress]);
  };

  const handleSetTrangThaiAddAddress = async (newAddress) => {
    try {
      // Gọi API để cập nhật địa chỉ đã chọn là mặc định
      const response=await updateDiaChi(newAddress.id, { ...newAddress, trangThai: 1 });
      setDiaChiList([...diaChiList, response.data]);
      console.log("Đã thiết lập địa chỉ mặc định:", newAddress.id);
    } catch (error) {
      console.error("Lỗi khi thiết lập địa chỉ mặc định:", error);
    }
  };
  

  const removeAddress = async (id) => {
    try {
      // Gọi API để xóa sản phẩm theo ID
      await deleteDiaChi(id);
      // Sau khi xóa thành công, cập nhật lại giỏ hàng
      const newData = customerData.filter((item) => item.id !== id);
      setCustomerData(newData);
    } catch (error) {
      console.error("Failed to remove address:", error);
    }
  };

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

  // Fetch customer addresses
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await getDiaChiByKhachHangId(khachHangId);
        const data = Array.isArray(response.data) ? response.data : [response.data]; // Kiểm tra nếu data không phải là mảng thì chuyển về mảng
        setCustomerData(data); // Lưu danh sách địa chỉ
        console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (khachHangId) {
      fetchCustomerData();
    }
  }, [khachHangId,diaChiList]);

  // Xử lý hiển thị khi loading hoặc có lỗi
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="address-container">
      <div className="address">
        <h2>Địa chỉ của tôi</h2>
        <div><AddressModal onAddAddress={handleAddAddress} /></div>
      </div>
      <ul className="address-list">
        {customerData.map((item, index) => (
          <li key={index} className="address-item">
            <div className="address-info">
              <strong>{item.tenNguoiNhan}</strong> 
              <span>{item.sdtNguoiNhan}</span>
              <p>{`${item.tenDiaChi}, ${item.xa}, ${item.huyen}, ${item.thanhPho}`}</p>
              {item.trangThai.toLocaleString() === "1" && <span className="default-tag">Mặc định</span>}
            </div>
            <div className="address-actions">
            <UpdateAddressModal addressData={item} onAddAddress={handleAddAddress} />
              {item.trangThai.toLocaleString() !== "1" && <Link onClick={() => removeAddress(item.id)}>Xóa</Link>}
              {item.trangThai.toLocaleString() !== "1" && (
                <button className="default-button" onClick={() => handleSetTrangThaiAddAddress(item)}>Thiết lập mặc định</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
