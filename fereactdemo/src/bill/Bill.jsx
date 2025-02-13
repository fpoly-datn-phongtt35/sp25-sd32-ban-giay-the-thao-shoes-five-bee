import React, { useState, useEffect } from "react";
import "./bill.css";
import { fetchCustomerId } from '../service/LoginService.js';
import { Header } from "../header/Header";
import { addHoaDon1 } from '../service/HoaDonService.js';
import LoadThongTinKhachHangHoaDon from "../components/LoadThongTinKhachHangHoaDon.js";
import LoadThongTinDiaChiHoaDon from "../components/LoadThongTinDiaChiHoaDon.js";
import HoaDonCart from "../components/HoaDonCart.js";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from "react-router-dom";

export const Bill = () => {
  const [khachHangId, setKhachHangId] = useState(null);
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    email: "",
    moTa: "",
    tenNguoiNhan: "",
    sdtNguoiNhan: "",
    diaChi: "",
    tongTien: 163500,
    hinhThucMua: 0,
    hinhThucThanhToan: 1,
    hinhThucNhanHang: 1,
    soTienGiam: 0,
    phiShip: 0,
    soDiemSuDung: 0,
    soTienQuyDoi: 0,
    trangThai: 0,
  });

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

  const handleCustomerDataChange = (data) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      email: data.email,
      tenNguoiNhan: data.hoTen,
      sdtNguoiNhan: data.soDienThoai,
    }));
  };

  const handleDiaChiChange = (data) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      diaChi: data.diaChi,
      moTa: data.moTa,
    }));
  };

  const setTongTienHang = (data) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      tongTien: data,
    }));
  };

  const handlePaymentChange = (event) => {
    const selectedMethod = event.target.id;
    setOrder((prevOrder) => ({
      ...prevOrder,
      hinhThucThanhToan: selectedMethod,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!khachHangId) {
      console.error('Khach hang ID is not available');
      return;
    }
    try {
      console.log(order+"daynày");
      const response = await addHoaDon1(khachHangId, order);
      console.log(response.data+"day");
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng", error);
    }
    // Sau khi gửi dữ liệu thành công, điều hướng đến trang OrderStatusPage
    navigate('/OrderStatusPage');
  };

  const exportToExcel = () => {
    const exportData = [{
      "Địa chỉ": order.diaChi,
      "Email": order.email,
      "Mô tả": order.moTa,
      "Tên người nhận": order.tenNguoiNhan,
      "Số điện thoại người nhận": order.sdtNguoiNhan,
      "Tổng tiền hàng": `₫${order.tongTien.toLocaleString()}`,
      "Hình thức mua": order.hinhThucMua === 1 ? "Online" : "Offline",
      "Hình thức thanh toán": order.hinhThucThanhToan === '0' ? "Chuyển khoản" : "Thu hộ (COD)",
      "Hình thức nhận hàng": order.hinhThucNhanHang === 1 ? "Giao tận nơi" : "Nhận tại cửa hàng",
      "Số tiền giảm": `₫${order.soTienGiam.toLocaleString()}`,
      "Phí ship": `₫${order.phiShip.toLocaleString()}`,
      "Số điểm sử dụng": order.soDiemSuDung,
      "Số tiền quy đổi": `₫${order.soTienQuyDoi.toLocaleString()}`,
      "Tổng thanh toán": `₫${(order.tongTien + order.phiShip - order.soTienGiam).toLocaleString()}`,
      "Trạng thái": order.trangThai === 1 ? "Đã đặt" : "Chưa đặt",
    }];

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa Đơn");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "hoa_don.xlsx");
  };

  const tongThanhToan = order.tongTien + order.phiShip - order.soTienGiam;

  return (
    <div>
      <Header />
      <div className="bill_container">
      <form onSubmit={handleSubmit} className="bill_form">
      <HoaDonCart customerId={khachHangId} onSetTongTienHang={setTongTienHang} />
        <div className="bill_left">
          <section className="customer_info">
            <h3>Thông tin nhận hàng</h3>
            <div className="section_content">
              {khachHangId ? (
                <>
                  <LoadThongTinKhachHangHoaDon customerId={khachHangId} onCustomerDataChange={handleCustomerDataChange} />
                  <LoadThongTinDiaChiHoaDon customerId={khachHangId} onDiaChiChange={handleDiaChiChange} />
                </>
              ) : (
                <p>Đang tải thông tin khách hàng...</p>
              )}
            </div>
          </section>
          <section className="payment_info">
          <div className="shipping_fee">
              <h3>Phí Vận Chuyển</h3>
              <input type="text" value={order.phiShip} readOnly />
            </div>
            
            <div className="payment_methods">
            <h3>Thanh Toán</h3>
              <div className="payment_option">
                <input
                  type="radio"
                  name="payment"
                  id="0"
                  checked={order.hinhThucThanhToan.toLocaleString() === '0'}
                  onChange={handlePaymentChange}
                />
                Chuyển khoản
              </div>
              <div className="payment_option">
                <input
                  type="radio"
                  name="payment"
                  id="1"
                  checked={order.hinhThucThanhToan.toLocaleString() === '1'}
                  onChange={handlePaymentChange}
                />
                Thu hộ (COD)
              </div>
              {/* <h3></h3> */}
            </div>
            <div className="order_summary">
              <div>Tổng tiền hàng: <span>{order.tongTien.toLocaleString()}₫</span></div>
              <div>Phí vận chuyển: <span>{order.phiShip.toLocaleString()}₫</span></div>
              <div>Tổng cộng Voucher giảm giá: <span>  - {order.soTienGiam.toLocaleString()}₫</span></div>
              <div className="order_summary_total"><strong>Tổng thanh toán: <span>{tongThanhToan.toLocaleString()}₫</span></strong></div>
            </div>
            <div className="buttons">
              <button type="submit">Đặt Hàng</button>
              <button type="button" onClick={exportToExcel}>Xuất Excel</button>
            </div>
          </section>
        </div>
        {/* <HoaDonCart customerId={khachHangId} onSetTongTienHang={setTongTienHang} /> */}
      </form>
    </div>
    </div>

  );
};
