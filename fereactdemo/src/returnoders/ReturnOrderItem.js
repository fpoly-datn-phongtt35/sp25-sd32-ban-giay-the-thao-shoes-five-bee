import React, { useEffect, useState } from "react";
import { message } from "antd";
import './ReturnOrderStyle.css';
import { fetchOrderDetails, updateReturnOrderStatus } from '../service/ReturnOrderService';
import { getHoaDonById1 } from '../service/HoaDonService';
import ReturnOrderDetailPopup from './ReturnOrderDetailPopup'; // Đường dẫn tới file ReturnOrderDetailPopup

const OrderItem = ({ order, onChangeData }) => {
  // const returnPolicy = "15 ngày trả hàng Trả hàng miễn phí 15 ngày";

  const [customerVisibleStatus, setCustomerVisibleStatus] = useState({ khachHang: {}, items: [], tongTien: 0 });
  const [returnOrder, setReturnOrder] = useState('');

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

  const handlePay = async () => {
    try {
      const response = await updateReturnOrderStatus(order.id, { ...order, status: parseInt("6", 10) });
      if (response.data) {
        onChangeData(response.data);
      }
      message.success("Thành công!");
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu: ", error);
      message.error("Lỗi khi tải dữ liệu!");
    }
  };

  const handleView = () => {
    console.log("Chi tiết đơn hàng");
  };

  const handleReturn = async () => {
    try {
      const response = await updateReturnOrderStatus(order.orderId, { ...order, status: parseInt("7", 10) });
      if (response.data) {
        onChangeData(response.data);
      }
      message.success("Thành công!");
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu: ", error);
      message.error("Lỗi khi tải dữ liệu!");
    }
  };

  const handleCancel = async () => {
    try {
      const response = await updateReturnOrderStatus(order.id, { ...order, status: parseInt("8", 10) });
      if (response.data) {
        onChangeData(response.data);
      }
      message.success("Hủy thành công!");
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu: ", error);
      message.error("Lỗi khi tải dữ liệu!");
    }
  };

  // const handleReCancel = async () => {
  //   try {
  //     const response = await updateReturnOrderStatus(order.id, parseInt("5", 10));
  //     if (response.data) {
  //       onChangeData(response.data);
  //     }
  //     message.success("Thành công!");
  //   } catch (error) {
  //     console.error("Lỗi khi fetch dữ liệu: ", error);
  //     message.error("Lỗi khi tải dữ liệu!");
  //   }
  // };

  // const OrderCard = ({ product }) => {
  //   return (
  //     <div className="order-body" onClick={() => handleViewOrderDetail(customerVisibleStatus)}>
  //       <div className="product-info">
  //         <p className="product-name">{product.giayChiTiet.giay.ten}</p>
  //         <p className="product-category">Phân loại hàng: {product.giayChiTiet.mauSac.ten}, {product.giayChiTiet.kichCo.ten}</p>
  //         <p className="product-quantity">Số Lượng: x{product.soLuong}</p>
  //         <p className="return-policy">{returnPolicy}</p>
  //       </div>
  //       <div className="product-price">
  //         <p className="old-price">₫{product.giaNhap}</p>
  //         <p className="new-price">₫{product.donGia}</p>
  //       </div>
  //     </div>
  //   );
  // };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getHoaDonById1(order.orderId);
        const response1 = await fetchOrderDetails(order.orderId);
        if (response.data) {
          setCustomerVisibleStatus(response.data);
        } else {
          setCustomerVisibleStatus({ items: [], tongTien: 0 });
        }
        setReturnOrder(response1.data);
      } catch (error) {
        message.error("Lỗi tải dữ liệu");
        setCustomerVisibleStatus({ items: [], tongTien: 0 });
      }
    };
    if (order.orderId) {
      fetchInvoices();
    }
  }, [order.orderId]);

  return (
    <div className="order-item">
      <div className="order-header">
        <span className="shop-name">Five Start</span>
        {/* <span className="shop-name"><h6>Mã KH: #{customerVisibleStatus.khachHang?.ma || 'N/A'}</h6></span>
        <span className="shop-name"><h4>Mã Hóa Đơn: #{customerVisibleStatus.ma || 'N/A'}</h4></span> */}
        <span className="order-status">
          {order.status.toLocaleString() === "5" && "Đang xem xét"}
          {order.status.toLocaleString() === "6" && "Đang trả hàng"}
          {order.status.toLocaleString() === "7" && "Đã hoàn tiền"}
          {order.status.toLocaleString() === "8" && "Yêu cầu THHT bị hủy/không hợp lệ"}
        </span>
      </div>

      {customerVisibleStatus.items.length > 0 ? (
        // customerVisibleStatus.items.map((product, index) => (
        //   <React.Fragment key={index}>
        //     <OrderCard product={product} />
        //     {index < customerVisibleStatus.items.length - 1 && <hr className="product-divider" />}
        //   </React.Fragment>
        // ))
        <div className="order-body" onClick={() => handleViewOrderDetail(customerVisibleStatus)}>
          <div className="product-info">
            <p className="product-name">Mã hóa đơn: {customerVisibleStatus.ma || 'N/A'}</p>
            <p className="product-name">Mã khách hàng: {customerVisibleStatus.khachHang?.ma || 'N/A'}</p>
            <p className="product-name">Lý do trả hàng: {returnOrder?.reason || 'N/A'}</p>
            <p className="product-category">Ngày mua: {customerVisibleStatus.ngayTao.split('T')[0]}</p>
            <p className="product-quantity">Hình Thức Thanh Toán: {customerVisibleStatus?.hinhThucThanhToan.toLocaleString() === "0" ? "Thu hộ" : "Chuyển khoản" || 'N/A'}</p>
            <p className="product-category">Địa chỉ nhận hàng: {customerVisibleStatus.diaChi}</p>
            {/* <p className="return-policy">{returnPolicy}</p> */}
          </div>
        </div>
      ) : (
        <div>Không có sản phẩm nào.</div>
      )}

      <div className="order-footer">
        <span className="order-total">Thành tiền: ₫{customerVisibleStatus.tongTien.toLocaleString() || "0"}</span>
        <div className="order-actions">
          {order.status === 5 && (
            <>
              <button onClick={handlePay} className="contact-seller-btn">Xác Nhận Yêu Cầu</button>
              <button onClick={handleCancel} className="cancel-order-btn">Hủy Yêu Cầu</button>
            </>
          )}
          {order.status === 6 && (
            <>
              <button onClick={handleView} className="contact-seller-btn">Xem Chi tiết Đơn Hàng</button>
              <button onClick={handleReturn} className="cancel-order-btn">Hoàn Tiền</button>
            </>
          )}
          {order.status === 7 && (
            <>
              <button onClick={handleView} className="contact-seller-btn">Xem Chi tiết Đơn Hàng</button>
            </>
          )}
          {order.status === 8 && (
            <>
              <button onClick={handleView} className="contact-seller-btn">Xem Chi tiết Đơn Hàng</button>
            </>
          )}
        </div>
      </div>
      <ReturnOrderDetailPopup
        isPopupVisible={isPopupVisible}
        togglePopup={togglePopup}
        selectedOrder={selectedOrder}
        selectedReturnOrder={returnOrder}
        handlePrint={handlePrint}
      />
    </div>
  );
};

export default OrderItem;
