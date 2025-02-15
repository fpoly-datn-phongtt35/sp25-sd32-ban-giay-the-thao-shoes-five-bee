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
    // Hàm gọi API để lấy hóa đơn

    const fetchInvoices = async () => {
      try {
        const response = await getAllReturnOrder();
        // const filteredOrders = response.data.filter(order => order.trangThai.toLocaleString() === "5"); // Lọc hóa đơn có trạng thái bằng 5
        setOrders1(response.data); // Cập nhật danh sách hóa đơn đã lọc
        if(response.data.length>0){
          // message.success("Thành công")
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu: ", error);
        message.error("Lỗi khi tải dữ liệu!");
      }
    };
      fetchInvoices();   
  }, [hoaDon]); // Chạy lại useEffect khi customerId thay đổi

  // Lọc các đơn hàng theo trạng thái
  const filteredOrders =
    status1 === "all" ? orders1 : orders1.filter((order) => order.status.toLocaleString() === status1);

  return (
    <div className="order-list">
      {filteredOrders.length > 0 ? (
        filteredOrders.map((hoadon) => <OrderItem key={hoadon.orderId} order={hoadon} onChangeData={handleHoaDon}/>)
      ) : (
        <p>Không có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default OrderList;
