import React, { useState, useEffect } from "react";
import "./bill.css";
import { fetchCustomerId } from '../service/LoginService.js';
import { paymentOnline } from '../service/HoaDonService.js';
import LoadThongTinKhachHangHoaDon from "../components/LoadThongTinKhachHangHoaDon.js";
import LoadThongTinDiaChiHoaDon from "../components/LoadThongTinDiaChiHoaDon.js";
import HoaDonCart from "../components/HoaDonCart.js";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { createVNPayPayment } from "../service/VnpayService.js";

export const Bill = () => {
  const [khachHangId, setKhachHangId] = useState(null);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [order, setOrder] = useState({
    email: "",
    moTa: "",
    tenNguoiNhan: "",
    sdtNguoiNhan: "",
    diaChi: "",
    xa:"",
    huyen:"",
    tỉnh:"",
    tongTien: 0,
    hinhThucMua: 1,
    hinhThucThanhToan: selectedOption === "option1" ? 2 : selectedOption === "option3" ? 1 : 0,
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
    const { diaChi } = data;

    const parts = diaChi.split(",");
    const diaChiCuThe = parts[0] || "";        
    const xa = parts[1] ? parts[1].trim() : ""; 
    const huyen = parts[2] ? parts[2].trim() : ""; 
    const tinh = parts[3] ? parts[3].trim() : ""; 
  
    setOrder((prevOrder) => ({
      ...prevOrder,
      xa,
      huyen,
      tinh,
      diaChi: diaChiCuThe,
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
    const selectedMethod = event.target.value;
    setSelectedOption(selectedMethod);
    setOrder((prevOrder) => ({
      ...prevOrder,
      hinhThucThanhToan: selectedMethod === "option2" ? 2 : selectedMethod === "option1" ? 1 : 0,
    }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!khachHangId) {
    console.error('Khach hang ID is not available');
    return;
  }
  try {
    console.log({ 
      ...order, 
      khachHangId,
      idGiamGia: order.idGiamGia || null,
      idsGioHangChiTiet: localStorage.getItem("idGioHangChiTiet") 
    })
    if (selectedOption === "option2"){
    const response = await paymentOnline({ 
      ...order, 
      khachHangId,
      idGiamGia: order.idGiamGia || null,
      idsGioHangChiTiet: localStorage.getItem("idGioHangChiTiet") 
    });
  }else if(selectedOption === "option1"){
    const response = await paymentOnline({
      ...order,
      khachHangId,
      idGiamGia: order.idGiamGia || null,
      idsGioHangChiTiet: localStorage.getItem("idGioHangChiTiet")
    });
    const { idHoaDon, tongTien } = response.data;
    console.log("ID Hóa đơn:", idHoaDon, "Tổng tiền:", tongTien);
    try {
      const vnpayResponse = await createVNPayPayment(tongTien,idHoaDon);
      if (vnpayResponse.data) {
        window.location.href = vnpayResponse.data;
        console.log("URL thanh toán VNPay:", vnpayResponse.data);
      }
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán VNPay:", error);
      message.error("Không thể tạo liên kết thanh toán VNPay!");
    }
  }
    navigate('/orderStatusPage');
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng", error);
  }
};

  const exportToExcel = () => {
    const exportData = [{
      "Địa chỉ": order.diaChi,
      "Email": order.email,
      "Mô tả": order.moTa,
      "Tên người nhận": order.tenNguoiNhan,
      "Số điện thoại người nhận": order.sdtNguoiNhan,
      "Tổng tiền hàng": `₫${order.tongTien.toLocaleString()}`,
      "Hình thức mua": order.hinhThucMua === 2 ? "Online" : "Online",
      "Hình thức thanh toán": order.hinhThucThanhToan === '1' ? "VnPay" : order.hinhThucThanhToan === '2' ? "Thu hộ (COD)" : "Không xác định",
      "Hình thức nhận hàng": order.hinhThucNhanHang === 1 ? "Giao tận nơi" : "Nhận tại cửa hàng",
      "Số tiền giảm": `₫${order.soTienGiam.toLocaleString()}`,
      "Phí ship": `${order.phiShip.toLocaleString()}`,
      "Số điểm sử dụng": order.soDiemSuDung,
      "Số tiền quy đổi": `₫${order.soTienQuyDoi.toLocaleString()}`,
      "Tổng thanh toán": `₫${(order.tongTien - order.soTienGiam).toLocaleString()}`,
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
      <div className="bill_container">
      <form onSubmit={handleSubmit} className="bill_form">
      <HoaDonCart customerId={khachHangId} onSetTongTienHang={setTongTienHang} />
        <div className="bill_left">
          <section className="customer_info">
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
          <div className={`shipping_badge ${order.phiShip === 0 ? 'freeship' : ''}`}>
          {order.phiShip === 0 ? "Freeship" : `${order.phiShip.toLocaleString()}₫`}
          </div>
          </div>
            
            <div className="payment_methods">
            <h3>Thanh Toán</h3>
              <div className="payment_option">
              <input
              type="radio"
              name="payment"
              id="1"
              value="option1"
              checked={selectedOption === "option1"}
              onChange={handlePaymentChange}
              />
                VnPay
              </div>
              <div className="payment_option">
              <input
              type="radio"
              name="payment"
              id="2"
              value="option2"
              checked={selectedOption === "option2"}
              onChange={handlePaymentChange}
/>
                Thu hộ (COD)
              </div>
              {/* <h3></h3> */}
            </div>
            <div className="order_summary">
              <div>Tổng tiền hàng: <span>{order.tongTien.toLocaleString()}₫</span></div>
              <div>Phí vận chuyển: <span>{order.phiShip.toLocaleString()}</span></div>
              <div>Tổng cộng Voucher giảm giá: <span>  - {order.soTienGiam.toLocaleString()}₫</span></div>
              <div className="order_summary_total"><strong>Tổng thanh toán: <span>{tongThanhToan.toLocaleString()}₫</span></strong></div>
            </div>
            <div className="buttons">
              <button type="submit">Đặt Hàng</button>
              <button type="button" onClick={exportToExcel}>Xuất Excel</button>
            </div>
          </section>
        </div>
      </form>
    </div>
    </div>

  );
};
