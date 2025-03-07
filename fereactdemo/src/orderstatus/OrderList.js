// OrderList.js
import React, { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import {getHoaDonByKhachHangId1 } from "../service/HoaDonService.js"
import { fetchCustomerId } from '../service/LoginService.js';
import './OrderStyle.css';

const OrderList = ({ status }) => {
  const [khachHangId, setKhachHangId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hoaDon, setHoaDon] = useState([]);

  const handleHoaDon = (newHoaDon) => {
    setHoaDon([...hoaDon, newHoaDon]);
  };

  useEffect(() => {
    const getCustomerId = async () => {   
      const id = await fetchCustomerId();
      console.log("customerId:", id);
      if (id) {
        setKhachHangId(id);
      } else {
        alert("Không thể lấy ID khách hàng. Vui lòng thử lại.");
      }
    };
    getCustomerId();
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getHoaDonByKhachHangId1(khachHangId);
        setOrders(response.data); // Giả sử API trả về danh sách hóa đơn
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    if (khachHangId) {
      fetchInvoices();
    }
  }, [khachHangId,hoaDon]); // Chạy lại useEffect khi customerId thay đổi


  // Lọc các đơn hàng theo trạng thái
  const filteredOrders =
    status === "all" ? orders : orders.filter((order) => order.trangThai.toLocaleString() === status);

  return (
    <div className="order-list">
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => <OrderItem key={order.id} order={order} onChangeData={handleHoaDon}/>)
      ) : (
        <p>Không có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default OrderList;
