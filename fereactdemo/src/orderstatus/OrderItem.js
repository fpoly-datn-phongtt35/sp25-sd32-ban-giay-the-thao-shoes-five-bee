// OrderItem.js
import React, { useEffect, useState } from "react";
import {
  message,
} from "antd";
import './OrderStyle.css';
import { Link } from "react-router-dom";
import { updateHoaDon1 } from "../service/HoaDonService.js"
import ReturnRequestModal from '../orderstatus/ReturnRequestForm.js';
import { fetchOrderDetails } from '../service/ReturnOrderService';  // API tạo yêu cầu trả hàng
import OrderDetailPopup from './OrderDetailPopup'; // Đường dẫn tới file OrderDetailPopup

const OrderItem = ({ order, onChangeData }) => {

  const [returnOrder, setReturnOrder] = useState("")
  const returnPolicy = useState("15 ngày trả hàng Trả hàng miễn phí 15 ngày")

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
    togglePopup(); // Hiển thị popup
  };

  const handleChangeReturnStatus = async (newStatus) => {

    try {
      const response = await updateHoaDon1(order.id, {
        trangThai: parseInt(newStatus.status, 10),
      });
      if (response.data) {
        onChangeData(response.data);
      }
      message.success("Thành công!");
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu: ", error);
      message.error("Lỗi khi tải dữ liệu!");
    }
  };

  const handleChangeStatus = async (newStatus) => {

    try {
      const response = await updateHoaDon1(order.id, {
        trangThai: parseInt(newStatus, 10),
      });
      if (response.data) {
        onChangeData(response.data);
      }
      message.success("Thành công!");
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu: ", error);
      message.error("Lỗi khi tải dữ liệu!");
    }
  };

  const getOrderStatus = (order, returnOrder) => {
    if (returnOrder && returnOrder.status) {
      switch (returnOrder.status.toLocaleString()) {
        case "6":
          return "Đang trả hàng";
        case "7":
          return "Đã hoàn tiền";
        case "8":
          return "Yêu cầu THHT bị hủy/không hợp lệ";
        default:
          return "Đang xem xét";
      }
    }
  };

  // const OrderCard = ({ product }) => {
  //   return (
  //     <div className="order-body" onClick={() => handleViewOrderDetail(order)}>
  //   <img className="product-image" src={product.giayChiTiet.giay.anhGiay.tenUrl} alt={product.name} />
  //   <div className="product-info">
  //     <p className="product-name">{product.giayChiTiet.giay.ten}</p>
  //     <p className="product-category">Phân loại hàng: {product.giayChiTiet.mauSac.ten}, {product.giayChiTiet.kichCo.ten}</p>
  //     <p className="product-quantity">Số Lượng: x{product.soLuong}</p>
  //     <p className="return-policy">{returnPolicy}</p>
  //   </div>
  //   <div className="product-price">
  //     <p className="old-price">₫{product.giaNhap}</p>
  //     <p className="new-price">₫{product.donGia}</p>
  //   </div>
  // </div>
  //   );
  // };


  useEffect(() => {
    if (order && order.trangThai && order.trangThai.toLocaleString() === "5") {
      const fetchHoaDon = async () => {
        try {
          const response = await fetchOrderDetails(order.id);
          setReturnOrder(response.data); // Giả sử API trả về dữ liệu hóa đơn
        } catch (error) {
          console.error("Lỗi khi fetch dữ liệu: ", error);
          message.error("Lỗi khi tải dữ liệu!");
        }
      };

      fetchHoaDon();
    }
  }, [order]); // Chạy lại useEffect khi order thay đổi

  return (
    <div className="order-item" >
      <div className="order-header">
        <button className="favorite-btn"><Link to={"/productAll"}>Xem Shop</Link></button>
        <span className="shop-name">Five Start</span>
        {/* <span className="shop-name"><h4>Mã Hóa Đơn: #{order.ma}</h4></span>
    <button className="chat-btn">Chat</button>
    <button className="view-shop-btn"><Link to={"/home"}>Xem Shop</Link></button> */}
        <span className="order-status">
          {order.trangThai.toLocaleString() === "0" && "Chờ Xác Nhận"}
          {order.trangThai.toLocaleString() === "1" && "Vận Chuyển"}
          {order.trangThai.toLocaleString() === "2" && "Chờ Giao Hàng"}
          {order.trangThai.toLocaleString() === "3" && "Hoàn Thành"}
          {order.trangThai.toLocaleString() === "4" && "Đã Hủy"}
          {order.trangThai.toLocaleString() === "5" && getOrderStatus(order, returnOrder)}
          {order.trangThai.toLocaleString() === "6" && "Hoàn Tiền"}

        </span>
      </div>

      {/* {order.items.map((product, index) => (
  <React.Fragment key={index}>
    <OrderCard product={product} />
    {index < order.items.length - 1 && <hr className="product-divider" />}
  </React.Fragment>
))} */}

      <div className="order-body" onClick={() => handleViewOrderDetail(order)}>
        <div className="product-info">
          <p className="product-name">Mã hóa đơn: {order.ma}</p>
          <p className="product-category">Ngày mua: {order.ngayTao.split('T')[0]}</p>
          <p className="product-quantity">Hình Thức Thanh Toán: {order?.hinhThucThanhToan.toLocaleString() === "0" ? "Thu hộ" : "Chuyển khoản" || 'N/A'}</p>
          <p className="product-category">Địa chỉ nhận hàng: {order.diaChi}</p>
          <p className="return-policy">{returnPolicy}</p>
        </div>
        {/* <div className="product-price">
      <p className="old-price">₫{product.giaNhap}</p>
      <p className="new-price">₫{product.donGia}</p>
    </div> */}
      </div>


      <div className="order-footer">
        <span className="order-total">Thành tiền: ₫{order.tongTien.toLocaleString()}</span>
        <div className="order-actions">
          {order.trangThai.toLocaleString() === "0" && <button className="contact-seller-btn" onClick={() => handleViewOrderDetail(order)} >Xem Chi Tiết</button>}
          {order.trangThai.toLocaleString() === "0" && <button className="cancel-order-btn" onClick={() => handleChangeStatus("4")}>Hủy Đơn Hàng</button>}
          {order.trangThai.toLocaleString() === "1" && <button className="contact-seller-btn" onClick={() => handleViewOrderDetail(order)} >Xem Chi Tiết</button>}
          {order.trangThai.toLocaleString() === "1" && <ReturnRequestModal orderDetails={order} onAddReturnRequest={handleChangeReturnStatus}>Yêu Cầu Trả Hàng/Hoàn Tiền</ReturnRequestModal>}
          {order.trangThai.toLocaleString() === "2" && <button onClick={() => handleChangeStatus("3")} className="contact-seller-btn">Đã Nhận Hàng</button>}
          {order.trangThai.toLocaleString() === "2" && <ReturnRequestModal orderDetails={order} onAddReturnRequest={handleChangeReturnStatus}>Yêu Cầu Trả Hàng/Hoàn Tiền</ReturnRequestModal>}
          {order.trangThai.toLocaleString() === "3" && <button className="contact-seller-btn">Đánh Giá</button>}
          {order.trangThai.toLocaleString() === "3" && <ReturnRequestModal orderDetails={order} onAddReturnRequest={handleChangeReturnStatus}>Yêu Cầu Trả Hàng/Hoàn Tiền</ReturnRequestModal>}
          {order.trangThai.toLocaleString() === "4" && <button className="contact-seller-btn" onClick={() => handleViewOrderDetail(order)} >Xem Chi Tiết</button>}
          {order.trangThai.toLocaleString() === "4" && <button onClick={() => handleChangeStatus("0")} className="contact-seller-btn">Mua Lại</button>}
          {order.trangThai.toLocaleString() === "5" && <button className="contact-seller-btn" onClick={() => handleViewOrderDetail(order)} >Xem Chi Tiết</button>}
          <OrderDetailPopup
            isPopupVisible={isPopupVisible}
            togglePopup={togglePopup}
            selectedOrder={selectedOrder}
            handlePrint={handlePrint}
          />

        </div>
      </div>
    </div>
  );
};

export default OrderItem;
