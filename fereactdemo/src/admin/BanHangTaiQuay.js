import React from "react";
import "./banhangtaiquay.css";
import { getGiay } from "../service/GiayService";
import { useState, useEffect } from "react";
import { Button, Input, message, Select, Modal } from "antd";
import {
  addHoaDon,
  deleteHoaDon,
  getHoaDon,
  updateHoaDon,
} from "../service/HoaDonService";
import moment from "moment";
import {
  getAllGiayChiTiet,
  updateGiayChiTiet,
} from "../service/GiayChiTietService";
import {
  addKhachHang,
  detailKhachHang,
  getAllKhachHang,
} from "../service/KhachHangService";
import { addHoaDonChiTiet } from "../service/HoaDonChiTietService";
import { getPhieuGiamGia } from "../service/PhieuGiamGiaService";
import {
  addPhieuGiamGiaChiTiet,
  getPhieuGiamGiaChiTiet,
} from "../service/PhieuGiamGiaChiTietHoaDon";
const BanHangTaiQuay = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [customerMoney, setCustomerMoney] = useState("");
  const [giay, setGiay] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [pages, setPages] = useState([]);
  const [pageCounter, setPageCounter] = useState(2);
  const [selectedPage, setSelectedPage] = useState(1);
  const [data, setData] = useState([]);
  const [khachHangList, setKhachHangList] = useState([]);
  const [giamGiaList, setGiamGiaList] = useState([]);
  const [selectedKhachHang, setSelectedKhachHang] = useState(null);
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [chuongTrinhGiamGia, setChuongTrinhGiamGia] = useState([]);
  const [selectedGiamGia, setSelectedGiamGia] = useState(null);
  const [appliedGiamGia, setAppliedGiamGia] = useState(null);
  const [soTienGiam, setSoTienGiam] = useState(0);
  const [isKhachLe, setIsKhachLe] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKhachHang, setEditingKhachHang] = useState(null);
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const { Option } = Select;
  const [isOpen, setIsOpen] = useState(false);
  const mapTrangThai = (trangThai) => {
    switch (trangThai) {
      case 0:
        return "Chờ thanh toán";
      case 3:
        return "Đã thanh toán";
      default:
        return "Unknown";
    }
  };
  const [vnpayUrl, setVnpayUrl] = useState("");

  const handleInputChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");
    const formattedValue = formatCurrency(inputValue);
    setCustomerMoney(formattedValue);

    const parsedMoney = parseCurrency(formattedValue);
    console.log("Tiền khách đưa:", parsedMoney);
    setTotalAmount((prevTotal) => {
      if (parsedMoney >= prevTotal) {
        setChangeAmount(parsedMoney - prevTotal);
      } else {
        setChangeAmount(0);
      }
      return prevTotal;
    });
  };

  const handleProductClick = (product) => {
    if (pages.length === 0) {
      message.warning("Vui lòng tạo hóa đơn chờ trước khi chọn sản phẩm !");
      return;
    }
    setSelectedProducts((prevSelectedProducts) => {
      const updatedProducts = { ...prevSelectedProducts };
      const currentPageProducts = Array.isArray(updatedProducts[selectedPage])
        ? updatedProducts[selectedPage]
        : [];
      const productExists = currentPageProducts.some(
        (p) => p.ID === product.ID
      );

      updatedProducts[selectedPage] = productExists
        ? currentPageProducts.filter((p) => p.ID !== product.ID)
        : [...currentPageProducts, { ...product, SOLUONG: 1 }];

      localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prevSelectedProducts) => {
      const updatedProducts = { ...prevSelectedProducts };
      updatedProducts[selectedPage] = Array.isArray(
        updatedProducts[selectedPage]
      )
        ? updatedProducts[selectedPage].filter(
            (product) => product.ID !== productId
          )
        : [];
      localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const handleQuantityChange = async (productId, delta) => {
    const product = giay.find((p) => p.ID === productId);
    if (!product) return;

    const currentSelectedProduct = selectedProducts[selectedPage]?.find(
      (p) => p.ID === productId
    );
    const currentQuantity = currentSelectedProduct
      ? currentSelectedProduct.SOLUONG
      : 0;
    const newQuantity = currentQuantity + delta;

    if (newQuantity < 0) {
      message.warning("Số lượng không thể âm!");
      return;
    }

    if (newQuantity > product.SOLUONG) {
      message.warning("Số lượng vượt quá tồn kho!");
      return;
    }
    setSelectedProducts((prevSelectedProducts) => {
      const updatedProducts = { ...prevSelectedProducts };
      updatedProducts[selectedPage] = Array.isArray(
        updatedProducts[selectedPage]
      )
        ? updatedProducts[selectedPage].map((p) => {
            if (p.ID === productId) {
              return { ...p, SOLUONG: newQuantity };
            }
            return p;
          })
        : [];
      localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const calculateTotal = (product) => {
    return product.GIABAN * product.SOLUONG;
  };

  const handleSelectGiamGia = (giamGiaId) => {
    const selectedProgram = chuongTrinhGiamGia.find(
      (ct) => ct.id === giamGiaId
    );
    if (selectedProgram) {
      setSelectedGiamGia(selectedProgram);
      applyGiamGia(selectedProgram);
    } else {
      console.error("Không tìm thấy chương trình giảm giá với id:", giamGiaId);
      setSelectedGiamGia(null);
      setAppliedGiamGia(null);
      setSoTienGiam(0);
      updateTotalAmount();
    }
  };

  const getChuongTrinhGiamGia = async () => {
    try {
      const result = await getPhieuGiamGia();
      const activeGiay = result.data.filter((item) => item.trangThai === 0);
      setChuongTrinhGiamGia(activeGiay);
      setGiamGiaList(activeGiay);
    } catch (error) {
      console.error("Lỗi khi lấy chương trình giảm giá:", error);
      message.error("Không thể lấy danh sách chương trình giảm giá");
    }
  };
  const handleKhachHangChange = async (value) => {
    setIsKhachLe(false);
    setSelectedKhachHang(value);
    try {
      const response = await detailKhachHang(value);
      console.log(response.data);
      const khachHang = response.data;
      setHoTen(khachHang.hoTen);
      setSoDienThoai(khachHang.soDienThoai);
    } catch (error) {
      message.error("Lỗi khi lấy chi tiết khách hàng");
    }
  };
  const getAllKhachHangData = async () => {
    const result = await getAllKhachHang();
    const activeGiay = result.data.filter((item) => item.trangThai === 0);
    setKhachHangList(activeGiay);
  };

  useEffect(() => {
    getAllGiay();
    getAllKhachHangData();
    getChuongTrinhGiamGia();
    const storedSelectedProducts = JSON.parse(
      localStorage.getItem("selectedProducts")
    );
    if (storedSelectedProducts) {
      setSelectedProducts(storedSelectedProducts);
    }
  }, []);

  const applyGiamGia = (giamGia) => {
    if (!giamGia) {
      console.error("Chương trình giảm giá không hợp lệ");
      return;
    }
    const tongTien = getTotalAmount();
    if (tongTien >= giamGia.dieuKien) {
      let tienGiam = tongTien * (giamGia.phanTramGiam / 100);
      if (tienGiam > giamGia.soTienGiamMax) {
        tienGiam = giamGia.soTienGiamMax;
      }
      const tongTienSauGiam = tongTien - tienGiam;

      setAppliedGiamGia({
        id: giamGia.id,
        soTienGiam: tienGiam,
        tongTienThanhToan: tongTienSauGiam,
      });
      setSoTienGiam(tienGiam);
      setTotalAmount(tongTienSauGiam);

      console.log("Đã áp dụng chương trình giảm giá:", {
        id: giamGia.id,
        soTienGiam: tienGiam,
        tongTienThanhToan: tongTienSauGiam,
      });
    } else {
      message.warning(
        "Đơn hàng không đủ điều kiện áp dụng chương trình giảm giá"
      );
      setAppliedGiamGia(null);
      setSoTienGiam(0);
    }
  };
  const updateTotalAmount = () => {
    const currentPageProducts = selectedProducts[selectedPage] || [];
    const subtotal = currentPageProducts.reduce(
      (total, product) => total + product.GIABAN * product.SOLUONG,
      0
    );
    const newTotalAmount = subtotal - soTienGiam;
    setTotalAmount(newTotalAmount > 0 ? newTotalAmount : 0);
  };
  const getTotalAmount = () => {
    const currentPageProducts = selectedProducts[selectedPage] || [];
    const subtotal = currentPageProducts.reduce(
      (total, product) => total + product.GIABAN * product.SOLUONG,
      0
    );
    const totalAmount = subtotal - soTienGiam;
    return totalAmount > 0 ? totalAmount : 0;
  };
  useEffect(() => {
    const newTotalAmount = getTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [soTienGiam, selectedProducts, selectedPage]);

  useEffect(() => {
    updateTotalAmount();
  }, [selectedProducts, selectedPage, soTienGiam]);

  const getAllGiay = async () => {
    try {
      const result = await getGiay();
      if (!Array.isArray(result.data)) {
        throw new Error("Dữ liệu trả về không phải là mảng");
      }

      const dataGiay = result.data.map((item, index) => ({
        key: index,
        TEN: item.ten ?? "N/A",
        GIABAN: item.giaBan ?? 0,
        ANH_GIAY:
          item.anhGiayEntities?.length > 0
            ? item.anhGiayEntities[0].tenUrl
            : null,
        SOLUONG: item.soLuongTon ?? 0,
        MO_TA: item.moTa ?? "Không có mô tả",
        TRANG_THAI: item.trangThai === 1 ? "Đang bán" : "Ngừng bán",
      }));

      setGiay(dataGiay);
      console.log("Dữ liệu giày:", dataGiay);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giày:", error);
      message.error("Không thể lấy dữ liệu giày");
    }
  };

  const fetchHoaDon = async () => {
    try {
      const result = await getHoaDon();
      const formattedData = Array.isArray(result.data)
        ? result.data.map((item) => ({
            key: item.id,
            order_id: item.id,
            user: item.khachHang ? item.khachHang.hoTen : null,
            user_phone: item.khachHang ? item.khachHang.soDienThoai : null,
            order_on: item.ngayTao
              ? moment(item.ngayTao).format("DD/MM/YYYY")
              : "N/A",
            status: mapTrangThai(item.trangThai),
            trangThai: item.trangThai,
            tongTien: item.tongTien,
            hinhThucMua: item.hinhThucMua === 0 ? "Online" : "Tại quầy",
            hinhThucThanhToan:
              item.hinhThucThanhToan === 0 ? "Chuyển khoản" : "Tiền mặt",
          }))
        : [];
      setData(formattedData);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu: ", error);
      message.error("Lỗi khi tải dữ liệu!");
    }
  };

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const parseCurrency = (value) => {
    return parseInt(value.replace(/\./g, ""), 10);
  };
  const createVNPayUrl = async (amount, orderId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/pay?amount=${amount}&orderId=${orderId}`,
        {
          method: "GET",
        }
      );
      console.log("Full response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const paymentUrl = await response.text();
      console.log("Received payment URL:", paymentUrl);
      return paymentUrl.trim();
    } catch (error) {
      console.error("Error creating VNPay URL:", error);
      throw error;
    }
  };
  const handlePayment = async () => {
    const totalAmountToPay = getTotalAmount();
    const parsedMoney = parseCurrency(customerMoney);
    console.log("Tổng tiền cần thanh toán:", totalAmountToPay);
    console.log("Tiền khách đưa:", parsedMoney);
    if (parsedMoney < totalAmountToPay && selectedOption !== "option3") {
      message.error("Tiền khách đưa không đủ!");
      return;
    }

    const currentPage = pages.find((page) => page.id === selectedPage);
    if (!currentPage) {
      message.error("Không tìm thấy hóa đơn!");
      return;
    }

    try {
      let createdHoaDonId;
      const isKhachLe = !selectedKhachHang && (!hoTen || !soDienThoai);

      const newHoaDon = {
        khachHang: selectedKhachHang ? { id: selectedKhachHang } : null,
        hoTenKhachHang: selectedKhachHang ? hoTen : "Khách lẻ",
        soDienThoaiKhachHang: selectedKhachHang ? soDienThoai : null,
        trangThai: 3,
        tongTien: getTotalAmount(),
        ngayTao: new Date().toISOString(),
        hinhThucMua: 1,
        hinhThucThanhToan: selectedOption === "option3" ? 0 : 1,
      };
      console.log(totalAmountToPay);

      if (selectedOption === "option3") {
        const response = await addHoaDon(newHoaDon);
        createdHoaDonId = response.data.id;
      } else {
        createdHoaDonId = currentPage.hoaDonId;
        await updateHoaDon(createdHoaDonId, newHoaDon);
      }
      if (appliedGiamGia) {
        console.log(
          "Thông tin chương trình giảm giá trước khi thêm:",
          appliedGiamGia
        );
        console.log(
          "Tổng tiền trước khi thêm chương trình giảm giá:",
          getTotalAmount()
        );
        await addChuongTrinhGiamGiaHoaDonChiTiet(
          createdHoaDonId,
          appliedGiamGia,
          getTotalAmount()
        );
      }
      for (const product of selectedProducts[selectedPage] || []) {
        const currentProduct = giay.find((p) => p.ID === product.ID);
        if (currentProduct) {
          const updatedQuantity = Math.max(
            currentProduct.SOLUONG - product.SOLUONG,
            0
          );
          await updateGiayChiTiet(product.ID, { soLuongTon: updatedQuantity });
        }
      }

      const hoaDonChiTietSanPham = Object.values(selectedProducts).flatMap(
        (pageProducts) =>
          (Array.isArray(pageProducts) ? pageProducts : []).map((product) =>
            addHoaDonChiTiet({
              hoaDon: { id: createdHoaDonId },
              giayChiTiet: { id: product.ID },
              soLuong: product.SOLUONG,
              donGia: product.GIABAN,
              trangThai: selectedOption === "option3" ? 0 : 1,
            })
          )
      );
      await Promise.all(hoaDonChiTietSanPham);

      if (selectedOption === "option3") {
        const paymentUrl = await createVNPayUrl(
          Math.round(totalAmountToPay),
          createdHoaDonId
        );
        if (paymentUrl && paymentUrl.startsWith("http")) {
          window.open(paymentUrl, "_blank");
          message.success(
            "Đã tạo yêu cầu thanh toán qua VNPay. Vui lòng hoàn tất thanh toán."
          );

          const checkPaymentStatus = setInterval(async () => {
            const updatedHoaDonResponse = await getHoaDon(createdHoaDonId);
            const updatedHoaDon = updatedHoaDonResponse.data;

            if (updatedHoaDon.trangThai === 3) {
              clearInterval(checkPaymentStatus);
              message.success("Thanh toán VNPay thành công!");
              resetState();
            }
          }, 5000);
        } else {
          throw new Error("Invalid payment URL received");
        }
      } else {
        message.success(
          isKhachLe
            ? "Thanh toán thành công với khách lẻ!"
            : "Thanh toán thành công!"
        );
        resetState();
        fetchHoaDon();
        getAllGiay();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hóa đơn:", error);
      message.error("Thanh toán thất bại!");
    }
  };
  const resetState = () => {
    setSelectedProducts({});
    setCustomerMoney("");
    setSelectedKhachHang(null);
    setHoTen("");
    setSoDienThoai("");
    setPages([]);
    setSelectedPage(1);
    setIsKhachLe(true);
    setPageCounter(2);
    setTotalAmount(0);
    setChangeAmount(0);
    setSelectedOption(null);
    setSelectedGiamGia(null);
    setAppliedGiamGia(null);
    setSoTienGiam(0);
    localStorage.removeItem("selectedProducts");
  };
  const addChuongTrinhGiamGiaHoaDonChiTiet = async (
    hoaDonId,
    giamGiaInfo,
    totalAmount
  ) => {
    try {
      if (
        !hoaDonId ||
        !giamGiaInfo ||
        !giamGiaInfo.id ||
        totalAmount === undefined
      ) {
        throw new Error(
          "Thiếu thông tin cần thiết để thêm chương trình giảm giá vào hóa đơn chi tiết"
        );
      }

      const chuongTrinhGiamGiaChiTiet = {
        hoaDon: { id: hoaDonId },
        ctgghd: { id: giamGiaInfo.id },
        tongTien: parseFloat((totalAmount + giamGiaInfo.soTienGiam).toFixed(2)),
        soTienDaGiam: parseFloat(giamGiaInfo.soTienGiam.toFixed(2)),
        tongTienThanhToan: parseFloat(totalAmount.toFixed(2)),
        trangThai: 1,
      };

      console.log(
        "Thông tin chương trình giảm giá chi tiết trước khi gửi:",
        chuongTrinhGiamGiaChiTiet
      );

      const response = await addPhieuGiamGiaChiTiet(chuongTrinhGiamGiaChiTiet);
      console.log(
        "Phản hồi từ server sau khi thêm chương trình giảm giá:",
        response
      );

      if (!response || !response.data) {
        throw new Error("Không nhận được phản hồi hợp lệ từ server");
      }

      message.success(
        "Đã lưu thông tin chương trình giảm giá vào hóa đơn chi tiết!"
      );
    } catch (error) {
      console.error(
        "Lỗi khi thêm thông tin chương trình giảm giá vào hóa đơn chi tiết:",
        error
      );
      message.error(
        "Không thể lưu thông tin chương trình giảm giá: " + error.message
      );
    }
  };
  const handleAddKhachHang = async () => {
    if (!hoTen || !soDienThoai) {
      message.error("Vui lòng nhập đầy đủ thông tin khách hàng!");
      return;
    }
    const newData = {
      hoTen,
      soDienThoai,
    };
    try {
      await addKhachHang(newData);
      message.success("Thêm khách hàng thành công!");
      getAllKhachHangData();
      handleClear("");
    } catch (error) {
      message.error("Lỗi khi thêm khách hàng");
    }
  };
  const handleAddPage = async () => {
    if (pages.length >= 5) {
      message.warning("Tối đa tạo hóa đơn chờ là 5");
      return;
    }
    try {
      const newHoaDon = {
        khachHang: selectedKhachHang,
        hoTenKhachHang: hoTen,
        soDienThoaiKhachHang: soDienThoai,
        trangThai: 0,
        tongTien: getTotalAmount().toFixed(2),
        ngayTao: new Date().toISOString(),
      };
      const response = await addHoaDon(newHoaDon);
      const createdHoaDonId = response.data.id;

      const nextPageId = pages.length === 0 ? 1 : pageCounter;
      setPages((prevPages) => [
        ...prevPages,
        { id: nextPageId, hoaDonId: createdHoaDonId },
      ]);
      setPageCounter(nextPageId + 1);
      setSelectedPage(nextPageId);
      message.success("Đã tạo hóa đơn chờ mới");
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      message.error("Không thể tạo hóa đơn mới");
    }
  };

  const handleRemovePage = async (pageId) => {
    try {
      const pageToRemove = pages.find((page) => page.id === pageId);
      if (pageToRemove && pageToRemove.hoaDonId) {
        await deleteHoaDon(pageToRemove.hoaDonId);
        message.success("Đã xóa hóa đơn");
      }

      const remainingPages = pages.filter((page) => page.id !== pageId);
      setPages(remainingPages);

      if (remainingPages.length === 0) {
        setPageCounter(2);
        setSelectedPage(1);
        setSelectedProducts({});
        setSelectedKhachHang(null);
        setHoTen("");
        setSoDienThoai("");
        setSelectedGiamGia(null);
        setCustomerMoney("");
        setChangeAmount(0);
        setTotalAmount(0);
        setSoTienGiam(0);
        setAppliedGiamGia(null);
        setSelectedOption(null);
      } else if (selectedPage === pageId) {
        setSelectedPage(remainingPages[0].id);
      }

      setSelectedProducts((prevSelectedProducts) => {
        const updatedProducts = { ...prevSelectedProducts };
        delete updatedProducts[pageId];
        localStorage.setItem(
          "selectedProducts",
          JSON.stringify(updatedProducts)
        ); // Lưu lại thay đổi vào localStorage
        return updatedProducts;
      });
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      message.error("Không thể xóa hóa đơn");
    }
  };
  const handleSelectPage = (pageId) => {
    setSelectedPage(pageId);
  };
  const handleClear = () => {
    setSelectedKhachHang(null);
    setHoTen("");
    setSoDienThoai("");
  };

  return (
    <div className="quay_container">
      <div className="left">
        <div className="product_list_hd">
          <div>
            {pages.map((page) => (
              <div
                key={page.id}
                style={{ display: "inline-block", marginRight: "10px" }}
              >
                <Button
                  className={
                    page.id === selectedPage
                      ? "page_button selected"
                      : "page_button"
                  }
                  onClick={() => handleSelectPage(page.id)}
                >
                  Hóa Đơn {page.id}
                </Button>
                <Button
                  onClick={() => handleRemovePage(page.id)}
                  style={{ marginLeft: "5px", color: "red" }}
                >
                  x
                </Button>
              </div>
            ))}
            <Button onClick={handleAddPage}>+</Button>
          </div>

          {/* hiển thị sản phẩm */}
          <div className="selected_products">
            {(Array.isArray(selectedProducts[selectedPage])
              ? selectedProducts[selectedPage]
              : []
            ).map((product) => (
              <div key={product.ID} className="selected_product">
                <div>{product.tenUrl}</div>
                {product.ANH_GIAY && (
                  <img
                    src={`http://localhost:5000/upload/${product.ANH_GIAY}`}
                    alt={product.TEN}
                  />
                )}
                <div>{product.GIABAN}</div>
                <div className="quantity_controls">
                  <Button
                    onClick={() => handleQuantityChange(product.ID, -1)}
                    disabled={product.SOLUONG <= 0}
                  >
                    -
                  </Button>
                  <span>{product.SOLUONG}</span>
                  <Button onClick={() => handleQuantityChange(product.ID, 1)}>
                    +
                  </Button>
                </div>
                <div className="total_price">
                  {formatCurrency(calculateTotal(product))}
                </div>
                <Button
                  className="remove_button"
                  onClick={() => handleRemoveProduct(product.ID)}
                >
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="product_list_tt">
          <table className="product_table">
            <thead>
              <tr>
                <th>Ảnh</th>

                <th>Tên</th>
                <th>Giá Bán</th>
                <th>Số Lượng</th>
                <th>Mô Tả</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {giay.map((item) => (
                <tr
                  key={item.key}
                  onClick={() => item.SOLUONG > 0 && handleProductClick(item)}
                  style={{
                    backgroundColor:
                      Array.isArray(selectedProducts[selectedPage]) &&
                      selectedProducts[selectedPage].some(
                        (product) => product.ID === item.ID
                      )
                        ? "#e0f7fa"
                        : "transparent",
                    opacity: item.SOLUONG === 0 ? 0.5 : 1,
                    cursor: item.SOLUONG === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {/* Cột ảnh giày */}
                  <td>
                    {item.ANH_GIAY ? (
                      <img
                        src={item.ANH_GIAY}
                        width={50}
                        height={50}
                        alt={item.TEN}
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  {/* Các cột dữ liệu khác */}

                  <td>{item.TEN}</td>
                  <td>{item.GIABAN.toLocaleString("vi-VN")} đ</td>
                  <td>{item.SOLUONG}</td>
                  <td>{item.MO_TA}</td>
                  <td>{item.TRANG_THAI}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="right">
        {/* Nút mở popup */}
        <Button type="primary" onClick={() => setIsOpen(true)}>
          Thanh Toán
        </Button>
        {/* Popup Thanh Toán */}
        <Modal
  className="fullscreen-modal"
  open={isOpen}
  onCancel={() => setIsOpen(false)}
  footer={null} // Ẩn footer mặc định
  closable={false} // Ẩn nút đóng mặc định
>
  {/* <div className="modal-header">
    <h2>Đơn Hàng</h2>
    <Button type="primary" icon="plus" onClick={handleNewOrder}>
      +
    </Button>
  </div> */}

  <div className="modal-content">
    <div className="customer-section">
      <Select
        className="customer-select"
        placeholder="Chọn Khách Hàng"
        value={selectedKhachHang}
        onChange={handleKhachHangChange}
      >
        {Array.isArray(khachHangList) &&
          khachHangList.map((hkh) => (
            <Option key={hkh.id} value={hkh.id}>
              {hkh.hoTen}
            </Option>
          ))}
      </Select>
      <Button type="primary" danger onClick={handleClear}>
        Clear
      </Button>
    </div>

    <div className="input-group">
      <label>Họ Tên Khách Hàng:</label>
      <Input
        value={hoTen}
        onChange={(e) => setHoTen(e.target.value)}
        placeholder="Nhập họ tên khách hàng"
      />
    </div>

    <div className="input-group">
      <label>Số Điện Thoại:</label>
      <Input
        value={soDienThoai}
        onChange={(e) => setSoDienThoai(e.target.value)}
        placeholder="Nhập số điện thoại khách hàng"
      />
    </div>

    <Button
      type="primary"
      onClick={handleAddKhachHang}
      disabled={!hoTen || !soDienThoai}
    >
      Thêm Khách Hàng Mới
    </Button>

    <Select
      className="discount-select"
      placeholder="Chọn Chương Trình Giảm Giá"
      value={selectedGiamGia?.id}
      onChange={handleSelectGiamGia}
    >
      {giamGiaList
        .filter((gg) => getTotalAmount() >= gg.dieuKien)
        .map((gg) => (
          <Option key={gg.id} value={gg.id}>
            {gg.ten} (Giảm {gg.phanTramGiam}%, tối đa {gg.soTienGiamMax})
          </Option>
        ))}
    </Select>

    <p className="amount">
      <strong>Tiền Khách Phải Trả:</strong> {formatCurrency(totalAmount)} VND
    </p>

    <div className="input-group">
      <label>Tiền khách đưa:</label>
      <Input
        value={customerMoney}
        onChange={handleInputChange}
        placeholder="Nhập số tiền khách đưa"
      />
    </div>

    <hr />

    <p className="change-amount">
      <strong>Tiền thừa:</strong> {formatCurrency(changeAmount)}
    </p>

    <hr />

    <div className="payment-options">
      <label>
        <input
          type="checkbox"
          value="option1"
          checked={selectedOption === "option1"}
          onChange={handleChange}
        />
        Tiền mặt
      </label>
      <label>
        <input
          type="checkbox"
          value="option3"
          checked={selectedOption === "option3"}
          onChange={handleChange}
        />
        Chuyển Khoản (VNPay)
      </label>
    </div>

    <p className="total-amount">
      <strong>Tổng Tiền: {formatCurrency(getTotalAmount())}</strong>
    </p>

    <div className="button-group">
      <Button
        className="cancel-button"
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </Button>
      <Button
        className="pay-button"
        type="primary"
        onClick={handlePayment}
        disabled={getTotalAmount() <= 0}
      >
        Thanh Toán (F1)
      </Button>
    </div>
  </div>
</Modal>

      </div>
    </div>
  );
};

export default BanHangTaiQuay;
