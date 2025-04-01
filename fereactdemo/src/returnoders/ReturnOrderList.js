// OrderList.js
import React, { useEffect, useState } from "react";
import {
  message,
} from "antd";
import OrderItem from "./ReturnOrderItem.js";
import { getAllReturnOrder } from '../service/ReturnOrderService';
import './ReturnOrderStyle.css';

const OrderList = ({ status1 }) => {
  const [orders1, setOrders1] = useState([]);

  const [hoaDon, setHoaDon] = useState([]);

  const handleHoaDon = (newHoaDon) => {
    setHoaDon([...hoaDon, newHoaDon]);
  };

  useEffect(() => {

    const fetchInvoices = async () => {
      try {
        const response = await getAllReturnOrder();
        setOrders1(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu: ", error.response ? error.response.data : error.message);
        message.error("Lỗi khi tải dữ liệu!");
      }
    };
    fetchInvoices();
  }, [hoaDon]); // Chạy lại useEffect khi customerId thay đổi

  const filteredOrders =
    status1 === "all" ? orders1 : orders1.filter((order) => order.status.toLocaleString() === status1);

  return (
    <div className="order-list">
      {filteredOrders.length > 0 ? (
        filteredOrders.map((hoadon) => <OrderItem key={hoadon.orderId} order={hoadon} onChangeData={handleHoaDon} />)
      ) : (
        <p>Không có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default OrderList;
