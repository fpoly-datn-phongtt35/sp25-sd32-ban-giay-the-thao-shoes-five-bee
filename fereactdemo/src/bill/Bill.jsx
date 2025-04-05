import React, { useState, useEffect } from "react";
import "./bill.css";
import { fetchCustomerId } from "../service/LoginService.js";
import { paymentOnline } from "../service/HoaDonService.js";
import { getGiamGia } from "../service/GiamGiaHoaDonService.js";
import LoadThongTinKhachHangHoaDon from "../components/LoadThongTinKhachHangHoaDon.js";
import LoadThongTinDiaChiHoaDon from "../components/LoadThongTinDiaChiHoaDon.js";
import HoaDonCart from "../components/HoaDonCart.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { createVNPayPayment } from "../service/VnpayService.js";

export const Bill = () => {
  const [khachHangId, setKhachHangId] = useState(null);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [giamGia, setGiamGia] = useState(null);
  const [maGiamGia, setMaGiamGia] = useState("");
  const [thongBaoGiamGia, setThongBaoGiamGia] = useState("");
  const [order, setOrder] = useState({
    email: "",
    moTa: "",
    tenNguoiNhan: "",
    sdtNguoiNhan: "",
    diaChi: "",
    xa: "",
    huyen: "",
    tỉnh: "",
    tongTien: 0,
    hinhThucMua: 1,
    hinhThucThanhToan:
      selectedOption === "option1" ? 2 : selectedOption === "option3" ? 1 : 0,
    hinhThucNhanHang: 1,
    soTienGiam: 0,
    idGiamGia: null,
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
    // Kiểm tra xem có thuộc tính diaChi hay không
    if (data.diaChi) {
      const parts = data.diaChi.split(",");
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
        moTa: data.moTa || prevOrder.moTa,
      }));
    } else {
      // Nếu chỉ có moTa được cập nhật (khi thay đổi ghi chú)
      setOrder((prevOrder) => ({
        ...prevOrder,
        moTa: data.moTa || prevOrder.moTa,
      }));
    }
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
      hinhThucThanhToan:
        selectedMethod === "option2" ? 2 : selectedMethod === "option1" ? 1 : 0,
    }));
  };

  const timMaGiamGia = async () => {
    try {
      const response = await getGiamGia();
      if (response.status === 200 && response.data) {
        const giamGiaData = response.data;
        if (order.tongTien >= giamGiaData.dieuKien) {
          setGiamGia(giamGiaData);

          // Tính số tiền giảm dựa trên phần trăm
          let soTienGiam = (order.tongTien * giamGiaData.phanTramGiam) / 100;

          // Kiểm tra nếu giảm vượt quá giới hạn tối đa
          if (
            giamGiaData.soTienGiamMax &&
            soTienGiam > giamGiaData.soTienGiamMax
          ) {
            soTienGiam = giamGiaData.soTienGiamMax;
          }

          setOrder((prevOrder) => ({
            ...prevOrder,
            soTienGiam: soTienGiam,
            idGiamGia: giamGiaData.id,
          }));

          setThongBaoGiamGia(
            `Đã áp dụng mã giảm giá: ${giamGiaData.ten} - Giảm ${
              giamGiaData.phanTramGiam
            }% (tối đa ${giamGiaData.soTienGiamMax.toLocaleString()}₫)`
          );
        } else {
          setThongBaoGiamGia(
            `Mã giảm giá yêu cầu đơn hàng tối thiểu ${giamGiaData.dieuKien.toLocaleString()}₫`
          );
        }
      } else {
        setThongBaoGiamGia("Không tìm thấy mã giảm giá phù hợp");
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng mã giảm giá:", error);
      setThongBaoGiamGia("Đã xảy ra lỗi khi áp dụng mã giảm giá");
    }
  };

  const xoaMaGiamGia = () => {
    setGiamGia(null);
    setMaGiamGia("");
    setThongBaoGiamGia("");
    setOrder((prevOrder) => ({
      ...prevOrder,
      soTienGiam: 0,
      idGiamGia: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!khachHangId) {
      console.error("Khách hàng ID is not available");
      return;
    }

    try {
      const idsGioHangChiTiet = localStorage.getItem("idGioHangChiTiet");
      const idsArray = idsGioHangChiTiet.split(",").map((id) => id.trim());

      const orderData = {
        ...order,
        khachHangId,
        idGiamGia: order.idGiamGia || null,
        idsGioHangChiTiet: idsArray, // Sử dụng mảng UUID
      };

      console.log({ ...orderData });

      if (selectedOption === "option2") {
        // Xử lý thanh toán trực tuyến
        const response = await paymentOnline(orderData);
      } else if (selectedOption === "option1") {
        // Xử lý thanh toán VNPay
        const response = await paymentOnline(orderData);
        const { idHoaDon, tongTien } = response.data;
        console.log("ID Hóa đơn:", idHoaDon, "Tổng tiền:", tongTien);

        try {
          const vnpayResponse = await createVNPayPayment(tongTien, idHoaDon);
          if (vnpayResponse.data) {
            window.location.href = vnpayResponse.data;
            console.log("URL thanh toán VNPay:", vnpayResponse.data);
          }
        } catch (error) {
          console.error("Lỗi khi tạo URL thanh toán VNPay:", error);
          message.error("Không thể tạo liên kết thanh toán VNPay!");
        }
      }

      navigate("/orderStatusPage");
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng", error);
      message.error("Đã có lỗi xảy ra khi tạo đơn hàng.");
    }
  };

  const exportToExcel = () => {
    const exportData = [
      {
        "Địa chỉ": order.diaChi,
        Email: order.email,
        "Mô tả": order.moTa,
        "Tên người nhận": order.tenNguoiNhan,
        "Số điện thoại người nhận": order.sdtNguoiNhan,
        "Tổng tiền hàng": `₫${order.tongTien.toLocaleString()}`,
        "Hình thức mua": order.hinhThucMua === 2 ? "Online" : "Tại quầy",
        "Hình thức thanh toán":
          order.hinhThucThanhToan === "0"
            ? "Tiền mặt"
            : order.hinhThucThanhToan === "1"
            ? "VnPay"
            : order.hinhThucThanhToan === "2"
            ? "Thu hộ (COD)"
            : "Không xác định",
        "Hình thức nhận hàng":
          order.hinhThucNhanHang === 1 ? "Giao tận nơi" : "Nhận tại cửa hàng",
        "Số tiền giảm": `₫${order.soTienGiam.toLocaleString()}`,
        "Phí ship": `${order.phiShip.toLocaleString()}`,
        "Số điểm sử dụng": order.soDiemSuDung,
        "Số tiền quy đổi": `₫${order.soTienQuyDoi.toLocaleString()}`,
        "Tổng thanh toán": `₫${(
          order.tongTien - order.soTienGiam
        ).toLocaleString()}`,
        "Trạng thái": order.trangThai === 1 ? "Đã đặt" : "Chưa đặt",
      },
    ];

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
          <HoaDonCart
            customerId={khachHangId}
            onSetTongTienHang={setTongTienHang}
          />
          <div className="bill_left">
            <section className="customer_info">
              <div className="section_content">
                {khachHangId ? (
                  <>
                    <LoadThongTinKhachHangHoaDon
                      customerId={khachHangId}
                      onCustomerDataChange={handleCustomerDataChange}
                    />
                    <LoadThongTinDiaChiHoaDon
                      customerId={khachHangId}
                      onDiaChiChange={handleDiaChiChange}
                    />
                  </>
                ) : (
                  <p>Đang tải thông tin khách hàng...</p>
                )}
              </div>
            </section>
            <section className="payment_info">
              <div className="shipping_fee">
                <h3>Phí Vận Chuyển</h3>
                <div
                  className={`shipping_badge ${
                    order.phiShip === 0 ? "freeship" : ""
                  }`}
                >
                  {order.phiShip === 0
                    ? "Freeship"
                    : `${order.phiShip.toLocaleString()}₫`}
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
              <div className="voucher_section">
                <h3>Mã Giảm Giá</h3>
                <button
                  type="button"
                  className="apply_best_voucher"
                  onClick={timMaGiamGia}
                >
                  Áp dụng mã giảm giá
                </button>
                {thongBaoGiamGia && (
                  <div
                    className={`applied_discount ${
                      giamGia ? "success" : "error"
                    }`}
                  >
                    {thongBaoGiamGia}
                    {giamGia && (
                      <button
                        type="button"
                        className="remove_voucher"
                        onClick={xoaMaGiamGia}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="order_summary">
                <div>
                  Tổng tiền hàng:{" "}
                  <span>{order.tongTien.toLocaleString()}₫</span>
                </div>
                <div>
                  Phí vận chuyển: <span>{order.phiShip.toLocaleString()}</span>
                </div>
                <div>
                  Tổng cộng Voucher giảm giá:{" "}
                  <span> - {order.soTienGiam.toLocaleString()}₫</span>
                </div>
                <div className="order_summary_total">
                  <strong>
                    Tổng thanh toán:{" "}
                    <span>{tongThanhToan.toLocaleString()}₫</span>
                  </strong>
                </div>
              </div>
              <div className="buttons">
                <button type="submit">Đặt Hàng</button>
                <button type="button" onClick={exportToExcel}>
                  Xuất Excel
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
};
