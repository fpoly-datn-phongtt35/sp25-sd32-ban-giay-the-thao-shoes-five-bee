// import React, { useState } from 'react';
import { Button } from 'antd'; // Antd cho nút Print
import './ReturnOrderDetailPopup.css'; // Import CSS nếu cần

const OrderDetailPopup = ({ selectedOrder,selectedReturnOrder, isPopupVisible, togglePopup, handlePrint }) => {

  if (!selectedOrder) {
    return null; // Nếu không có hóa đơn nào được chọn, không hiển thị popup
  }

  return (
    isPopupVisible && (
      <div className="popup-overlay" onClick={togglePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="HoaDonChiTiet">
            <h1>Chi tiết hóa đơn hoàn hàng</h1>
          </div>
          <Button style={{ float: 'right' }} onClick={togglePopup}>Back</Button>
          <Button style={{ float: 'right', marginRight: '10px' }} type="primary" onClick={handlePrint}>
            Print
          </Button>

          {/* Thông tin chi tiết đơn hàng */}
          <div className="thongtinhoadon">
            <div className="trai">
              <h4>Chi Tiết Đơn Hàng </h4>
              <h6>Mã Hóa Đơn: {selectedOrder?.ma || 'N/A'}</h6>
              <h6>Lý Do Trả Hàng: {selectedReturnOrder?.reason || 'N/A'}</h6>
              <h6>Ngày Mua: {selectedOrder?.ngayTao.split('T')[0] || 'N/A'}</h6>
              <h6>Hình Thức Mua: {selectedOrder?.hinhThucMua.toLocaleString()==="0"?"Online":"Offline" || 'N/A'}</h6>
              <h6>Hình Thức Thanh Toán: {selectedOrder?.hinhThucThanhToan.toLocaleString()==="0"?"Thu hộ":"Chuyển khoản" || 'N/A'}</h6>
              <h6>Tổng Tiền: {selectedOrder?.tongTien?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}</h6>
            </div>
            <div className="phai">
              <h4>Thông tin khách hàng</h4>
              <h6>Mã Khách Hàng: {selectedOrder.khachHang?.ma || 'N/A'}</h6>
              <h6>Tên Khách Hàng: {selectedOrder?.tenNguoiNhan || 'N/A'}</h6>
              <h6>Số Điện Thoại: {selectedOrder?.sdtNguoiNhan || 'N/A'}</h6>
              <h6>Địa Chỉ: {selectedOrder?.diaChi || 'N/A'}</h6>
            </div>
          </div>

          {/* Thông tin các sản phẩm trong đơn hàng */}
          <div>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Màu sắc</th>
                  <th>Kích cỡ</th>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder?.items.map((product, index) => (
                  <tr key={index}>
                    <td>{product.giayChiTiet.giay.ten}</td>
                    <td>{product.giayChiTiet.mauSac.ten}</td>
                    <td>{product.giayChiTiet.kichCo.ten}</td>
                    <td>{product.giayChiTiet.giaBan?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}</td>
                    <td>{product.soLuong}</td>
                    <td>
                      {(product.soLuong * product.giayChiTiet.giaBan)?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" style={{ textAlign: 'right' }}><strong>Tổng cộng:</strong></td>
                  <td>
                    <strong>
                      {selectedOrder?.items.reduce((total, product) => total + (product.soLuong * product.giayChiTiet.giaBan), 0)
                        .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderDetailPopup;
