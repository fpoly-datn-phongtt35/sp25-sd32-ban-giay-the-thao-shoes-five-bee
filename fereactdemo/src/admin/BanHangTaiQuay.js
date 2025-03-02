import React from "react";
import "./banhangtaiquay.css";
import { getGiay } from "../service/GiayService";
import { useState, useEffect } from "react";
import { Button, Input, message, Select, Modal } from "antd";
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
import {
  createHoaDonBanHangTaiQuay,
  themSanPhamVaoHoaDon,
  updateSoLuongGiay,
  getListHoaDonCho,
  deleteHoaDonCho,
  deleteHoaDonChiTiet,
  thanhToanTaiQuay
} from "../service/BanHangTaiQuayService";

import WebcamComponent from "./WebcamComponent";
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
  const [hoaDonCho, setHoaDonCho] = useState([]);
  const [availablePageNumbers, setAvailablePageNumbers] = useState([
    1, 2, 3, 4, 5,
  ]);

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

  const handleProductClick = async (product) => {
    if (pages.length === 0) {
      message.warning("Vui lòng tạo hóa đơn chờ trước khi chọn sản phẩm!");
      return;
    }


    const currentPage = pages.find(page => page.id === selectedPage);
    if (!currentPage) return;

    try {
      await themSanPhamVaoHoaDon(currentPage.hoaDonId, product.ID);
      // Cập nhật UI sau khi thêm sản phẩm thành công
      setSelectedProducts((prevSelectedProducts) => {
        const updatedProducts = { ...prevSelectedProducts };
        const currentPageProducts = Array.isArray(updatedProducts[selectedPage])
          ? updatedProducts[selectedPage]
          : [];
        
        updatedProducts[selectedPage] = [...currentPageProducts, { ...product, SOLUONG: 1 }];
        return updatedProducts;
      });
    } catch (error) {
      message.error("Không thể thêm sản phẩm vào hóa đơn");

    }
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
      // localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const handleQuantityChange = async (productId, delta) => {
    const currentPage = pages.find(page => page.id === selectedPage);
    if (!currentPage) return;

    try {
      const currentProduct = selectedProducts[selectedPage]?.find(p => p.ID === productId);
      if (!currentProduct) return;

      const response = await updateSoLuongGiay(currentProduct.hoaDonChiTietId, delta > 0);
      
      if (response.data) {
        setSelectedProducts((prevSelectedProducts) => {
          const updatedProducts = { ...prevSelectedProducts };
          updatedProducts[selectedPage] = updatedProducts[selectedPage].map(p => {
            if (p.ID === productId) {
              return { ...p, SOLUONG: p.SOLUONG + delta };
            }
            return p;
          });
          return updatedProducts;
        });
      }
    } catch (error) {
      message.error("Không thể cập nhật số lượng sản phẩm");
    }

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
    const activeGiay = result.data.filter(item => item.roleNames.includes('ROLE_USER'))
    setKhachHangList(activeGiay);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load danh sách sản phẩm
        await getAllGiay();
        // Load danh sách khách hàng
        await getAllKhachHangData();
        // Load chương trình giảm giá
        await getChuongTrinhGiamGia();
        // Load danh sách hóa đơn chờ
        await loadHoaDonCho();
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", error);
        message.error("Không thể tải dữ liệu ban đầu");
      }
    };

    loadInitialData();

  }, []);

  const loadHoaDonCho = async () => {
    try {
      const response = await getListHoaDonCho();
      
      // Parse the JSON string if needed
      let hoaDonData;
      if (typeof response.data === 'string') {
        try {
          hoaDonData = JSON.parse(response.data);
        } catch (parseError) {
          console.error("Lỗi khi parse JSON:", parseError);
          setPages([]);
          setSelectedProducts({});
          return;
        }
      } else {
        hoaDonData = response.data;
      }

      // Ensure hoaDonData is an array
      const hoaDonArray = Array.isArray(hoaDonData) ? hoaDonData : [];
      
      // Lọc các hóa đơn có trạng thái hợp lệ (chờ thanh toán)
      const validHoaDons = hoaDonArray.filter(hoaDon => hoaDon && hoaDon.trangThai === 1);

      // Tạo pages từ hóa đơn hợp lệ
      const loadedPages = validHoaDons.map((hoaDon, index) => ({
        id: index + 1,
        hoaDonId: hoaDon.id
      }));
      setPages(loadedPages);

      // Nếu có pages, set selected page và map products
      if (loadedPages.length > 0) {
        setSelectedPage(loadedPages[0].id);

        // Map products cho mỗi hóa đơn
        const productsMap = {};
        validHoaDons.forEach((hoaDon, index) => {
          if (hoaDon.items && Array.isArray(hoaDon.items)) {
            productsMap[index + 1] = hoaDon.items.map(item => ({
              ID: item.id,
              TEN: `Giày ${item.giayChiTiet?.ten || 'N/A'}`,
              GIABAN: item.giaBan || 0,
              SOLUONG: item.soLuong || 0,
              hoaDonChiTietId: item.id
            }));
          }
        });
        setSelectedProducts(productsMap);
      }

    } catch (error) {
      console.error("Lỗi khi tải danh sách hóa đơn chờ:", error);
      message.error("Không thể tải danh sách hóa đơn chờ");
      setPages([]);
      setSelectedProducts({});
    }
  };

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
      const result = await getAllGiayChiTiet();

      console.log("Raw API response:", result.data);
      
      const dataGiay = result.data
        .filter(item => item && item.trangThai === 0) // Chỉ lấy các sản phẩm có trạng thái = 0
        .map((item, index) => ({
          key: index,
          ID: item.id,
          MA: item.maVach || "N/A",
          TEN: `Giày size ${item.kichCoEntity?.ten || 'N/A'} - ${item.mauSacEntity?.ten || 'N/A'}`,
          GIABAN: item.giaBan || 0,
          SOLUONG: item.soLuongTon || 0,
          KICH_CO: item.kichCoEntity?.ten || "N/A",
          MAU_SAC: item.mauSacEntity?.ten || "N/A",
        }));

      console.log("Transformed data:", dataGiay);

      setGiay(dataGiay);
      console.log("Dữ liệu giày:", dataGiay);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giày:", error);
      message.error(`Lỗi khi lấy dữ liệu: ${error.message}`);
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
      const hoaDonRequest = {
        khachHang: selectedKhachHang ? { id: selectedKhachHang } : null,
        hoTenKhachHang: selectedKhachHang ? hoTen : "Khách lẻ",
        soDienThoaiKhachHang: selectedKhachHang ? soDienThoai : null,
        tongTien: getTotalAmount(),
        hinhThucThanhToan: selectedOption === "option3" ? 0 : 1, // 0: Chuyển khoản, 1: Tiền mặt
        tienKhachDua: parsedMoney,
        tienThua: changeAmount
      };

      if (selectedOption === "option3") {
        // Xử lý thanh toán VNPay
        const paymentUrl = await createVNPayUrl(Math.round(totalAmountToPay), currentPage.hoaDonId);
        if (paymentUrl && paymentUrl.startsWith("http")) {
          window.open(paymentUrl, "_blank");
          message.success("Đã tạo yêu cầu thanh toán qua VNPay. Vui lòng hoàn tất thanh toán.");
        }
      } else {
        // Thanh toán tiền mặt
        await thanhToanTaiQuay(currentPage.hoaDonId, hoaDonRequest);
        message.success("Thanh toán thành công!");
        resetState();
        getAllGiay(); // Cập nhật lại số lượng sản phẩm
      }

    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
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
    // localStorage.removeItem("selectedProducts");
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

      const response = await createHoaDonBanHangTaiQuay();

      const createdHoaDonId = response.data.id;
      console.log("Hóa đơn mới tạo:", createdHoaDonId);

      // Tìm số thứ tự nhỏ nhất có thể dùng (1 - 5)
      const usedIds = pages.map((page) => page.id);
      let nextPageId = 1;
      for (let i = 1; i <= 5; i++) {
        if (!usedIds.includes(i)) {
          nextPageId = i;
          break;
        }
      }

      setPages((prevPages) => [
        ...prevPages,
        { id: nextPageId, hoaDonId: createdHoaDonId },
      ]);
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
        await deleteHoaDonCho(pageToRemove.hoaDonId);
        message.success("Đã xóa hóa đơn");
      }

      // Cập nhật danh sách trang sau khi xóa
      const remainingPages = pages.filter((page) => page.id !== pageId);
      setPages(remainingPages);

      if (remainingPages.length === 0) {
        // Nếu không còn trang nào, reset counter về 1
        setPageCounter(1);
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
      } else {
        // Nếu trang bị xóa là trang đang được chọn, chọn trang đầu tiên còn lại
        if (selectedPage === pageId) {
          setSelectedPage(remainingPages[0].id);
        }
      }

      // Cập nhật danh sách số thứ tự có thể sử dụng
      setAvailablePageNumbers((prevNumbers) => [...prevNumbers, pageId].sort());
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
  const fetchHoaDonCho = async () => {
    try {
      const response = await getListHoaDonCho();
    console.log("Danh sách hóa đơn chờ:", response.data);
    
      // if (!Array.isArray(response.data)) {
      //   throw new Error("Dữ liệu trả về không phải là mảng");
      // }

      // Chuyển đổi dữ liệu API thành format của pages
      const hoaDonPages = response.data.map((hoaDon, index) => ({
        id: index + 1, // Số hóa đơn
        hoaDonId: hoaDon.id, // ID hóa đơn từ API
      }));

      setPages(hoaDonPages); // Cập nhật danh sách pages
      console.log("Danh sách hóa đơn chờ:", hoaDonPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn chờ:", error);
      message.error("Không thể lấy danh sách hóa đơn chờ");
    }
  };
  const handleAddProductToInvoice = async (idHoaDon, idSanPham) => {
    try {
      if (!idHoaDon) {
        message.warning("Vui lòng chọn hóa đơn trước khi thêm sản phẩm.");
        return;
      }

      const response = await themSanPhamVaoHoaDon(idHoaDon, idSanPham);

      if (response && response.data) {
        message.success("Thêm sản phẩm vào hóa đơn thành công!");
        // Gọi lại API để cập nhật danh sách sản phẩm trên giao diện nếu cần
      } else {
        throw new Error("Dữ liệu trả về không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào hóa đơn:", error);
      message.error("Không thể thêm sản phẩm vào hóa đơn.");
    }
  };

  // Helper function để làm phẳng dữ liệu
  const flattenHoaDonData = (hoaDon) => {
    if (!hoaDon) return null;
    
    return {
      id: hoaDon.id,
      ma: hoaDon.ma,
      ngayTao: hoaDon.ngayTao,
      trangThai: hoaDon.trangThai,
      items: (hoaDon.items || []).map(item => ({
        id: item.id,
        soLuong: item.soLuong,
        giaBan: item.giaBan,
        donGia: item.donGia,
        trangThai: item.trangThai
      }))
    };
  };

  return (
    <div className="quay_container">
         {/* <div>
      <h1>React Webcam</h1>
      <WebcamComponent />
    </div> */}
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
                {product.ANH_GIAY && (
                  <img src={`${product.ANH_GIAY}`} alt={product.TEN} />
                )}
                <div>{product.TEN}</div>
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
                <th>Mã</th>

                <th>Tên</th>
                <th>Giá Bán</th>
                <th>Số Lượng</th>
                <th>Kích Cỡ</th>
                <th>Màu Săc</th>
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

                  <td>{item.MA}</td>
                  <td>{item.TEN}</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.GIABAN)}</td>

                  <td>{item.SOLUONG}</td>
                  <td>{item.KiCH_CO}</td>
                  <td>{item.MAU_SAC}</td>
                  <td>{item.TRANG_THAI}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="right">
        <Select
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
        <br />
        Họ Tên Khách Hàng :
        <Input
          type="input"
          value={hoTen}
          onChange={(e) => setHoTen(e.target.value)}
          placeholder="Nhập họ tên khách hàng"
        />
        Số Điện Thoại :
        <Input
          type="input"
          value={soDienThoai}
          onChange={(e) => setSoDienThoai(e.target.value)}
          placeholder="Nhập số điện thoại khách hàng"
        />
        <Button
          type="primary"
          onClick={handleAddKhachHang}
          style={{ marginTop: "10px" }}
          disabled={!hoTen || !soDienThoai}
        >
          Thêm Khách Hàng Mới
        </Button>
        <br />
        <br />
        <Select
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
        <p>Tiền Khách Phải Trả: {formatCurrency(totalAmount)} VND</p>
        Tiền khách đưa
        <Input
          value={customerMoney}
          onChange={handleInputChange}
          placeholder="Nhập số tiền khách đưa"
        />
        <hr />
        <p>Tiền thừa: {formatCurrency(changeAmount)}</p>
        <hr />
        <div className="check_tt">
          <label>
            <input
              type="checkbox"
              value="option1"
              checked={selectedOption === "option1"}
              onChange={handleChange}
            />
            Tiền mặt
          </label>
          <br />
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
        <p style={{ paddingTop: "10px" }}>
          Tổng Tiền: {formatCurrency(getTotalAmount())}
        </p>
        <button
          className="btn-tt"
          onClick={handlePayment}
          disabled={getTotalAmount() <= 0}
        >
          Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default BanHangTaiQuay;
