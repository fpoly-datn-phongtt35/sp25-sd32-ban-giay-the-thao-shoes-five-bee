import React from "react";
import "./banhangtaiquay.css";
import { getGiay } from "../service/GiayService";
import { useState, useEffect, useParams } from "react";
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
import {
  createHoaDonBanHangTaiQuay,
  getListHoaDonCho,
  deleteHoaDonCho,
  themSanPhamVaoHoaDon,
  getSanPhamTrongHoaDon,
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
  const [selectedHoaDonId, setSelectedHoaDonId] = useState(null);

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
  
    const selectedPageData = pages.find((page) => page.id === selectedPage);
    if (!selectedPageData || !selectedPageData.hoaDonId) {
      message.warning("Không tìm thấy hóa đơn hợp lệ.");
      return;
    }
  
    const idHoaDon = selectedPageData.hoaDonId;
    const idSanPham = product.ID;
  
    if (!idHoaDon || !idSanPham) {
      message.error("ID hóa đơn hoặc ID sản phẩm không hợp lệ!");
      return;
    }
  
    try {
      await themSanPhamVaoHoaDon(idHoaDon, idSanPham);
  
      // ✅ Gọi API ngay lập tức để cập nhật danh sách sản phẩm
      fetchSanPhamTrongHoaDon(idHoaDon, setSelectedProducts);
  
      message.success(`Thêm sản phẩm "${product.TEN}" vào hóa đơn thành công!`);
    } catch (error) {
      console.error("❌ Lỗi khi thêm sản phẩm vào hóa đơn:", error);
      message.error("Không thể thêm sản phẩm vào hóa đơn.");
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
    try {
      const result = await getAllKhachHang();

      if (!result || !Array.isArray(result.data)) {
        throw new Error("Dữ liệu API không hợp lệ hoặc không phải mảng");
      }

      // Lọc người dùng có "ROLE_USER"
      const filteredUsers = result.data
        .filter((user) => user.roleNames.includes("ROLE_USER"))
        .map((user) => ({
          id: user.id,
          hoTen: user.hoTen ?? "Không có tên",
          soDienThoai: user.soDienThoai ?? "Không có SĐT",
          diaChi: user.diaChi.length > 0 ? user.diaChi : ["Không có địa chỉ"],
        }));

      setKhachHangList(filteredUsers);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      message.error("Không thể tải danh sách khách hàng");
    }
  };
  const fetchHoaDonCho = async () => {
    try {
      const response = await getListHoaDonCho();
  
      const hoaDonPages = response.data.map((hoaDon, index) => ({
        id: index + 1, // Số hóa đơn
        hoaDonId: hoaDon.id, // ID hóa đơn từ API
      }));
  
      setPages(hoaDonPages);
  
      if (hoaDonPages.length > 0) {
        const firstHoaDonId = hoaDonPages[0].hoaDonId;
        setSelectedHoaDonId(firstHoaDonId);
  
        console.log("ID hóa đơn đầu tiên:", firstHoaDonId);
  
        // ✅ Gọi API lấy sản phẩm ngay lập tức
        fetchSanPhamTrongHoaDon(firstHoaDonId, setSelectedProducts);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn chờ:", error);
      message.error("Không thể lấy danh sách hóa đơn chờ");
    }
  };
  

  const fetchSanPhamTrongHoaDon = async (idHoaDon) => {
    if (!idHoaDon) {
      message.error("ID hóa đơn không hợp lệ!");
      return;
    }

    try {
      const result = await getSanPhamTrongHoaDon(idHoaDon);
      console.log("Dữ liệu API trả về:", result.data);

      const formattedData = Array.isArray(result.data)
        ? result.data.map((item) => ({
            ID: item.id,
            TEN: item.giayChiTietEntity?.giayEntity?.ten || "Không xác định",
            SOLUONG: item.soLuong,
            GIABAN: item.giaBan,
            ANH_GIAY:
              item.giayChiTietEntity?.giayEntity?.anhGiayEntities?.[0]
                ?.tenUrl || "https://via.placeholder.com/150",
          }))
        : [];

      setSelectedProducts((prev) => {
        const updatedProducts = {
          ...prev,
          [idHoaDon]: formattedData,
        };
        console.log("State sau khi cập nhật:", updatedProducts);
        return updatedProducts;
      });
    } catch (error) {
      console.error("Lỗi khi fetch danh sách sản phẩm: ", error);
      message.error("Lỗi khi tải danh sách sản phẩm!");
    }
  };

  useEffect(() => {
    getAllGiay();
    getAllKhachHangData();
    getChuongTrinhGiamGia();
    fetchHoaDonCho();
  }, []);

  useEffect(() => {
    if (selectedHoaDonId) {
      fetchSanPhamTrongHoaDon(selectedHoaDonId, setSelectedProducts);
    }
  }, [selectedHoaDonId]);

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

      if (!result || !Array.isArray(result.data)) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      const dataGiay = result.data.map((item, index) => ({
        ID: item.id ?? index,
        TEN: item.giayEntity?.ten ?? "N/A", // Lấy tên giày từ giayEntity
        ANH_GIAY:
          item.giayEntity?.anhGiayEntities?.length > 0
            ? item.giayEntity.anhGiayEntities[0].tenUrl // Lấy ảnh đầu tiên từ giayEntity
            : null,
        GIABAN: item.giaBan ?? 0,
        SOLUONG: item.soLuongTon ?? 0,
        MO_TA: item.giayEntity?.moTa ?? "Không có mô tả",
        KiCH_CO: item.kichCoEntity?.ten ?? "N/A",
        MAU_SAC: item.mauSacEntity?.ten ?? "N/A",
        TRANG_THAI: item.trangThai === 0 ? "Đang bán" : "Ngừng bán",
      }));

      setGiay(dataGiay);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giày:", error);
      message.error(`Lỗi khi lấy dữ liệu: ${error.message}`);
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
      // Gọi API để tạo hóa đơn bán hàng tại quầy
      const response = await createHoaDonBanHangTaiQuay();

      if (!response || !response.data || !response.data.id) {
        throw new Error("Dữ liệu hóa đơn trả về không hợp lệ");
      }

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

  const handleSelectPage = (pageId, hoaDonId) => {
    setSelectedPage(pageId);
    setSelectedHoaDonId(hoaDonId);
  };

  const handleClear = () => {
    setSelectedKhachHang(null);
    setHoTen("");
    setSoDienThoai("");
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
                  onClick={() => handleSelectPage(page.id, page.hoaDonId)}
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
            {selectedProducts[selectedHoaDonId] &&
            selectedProducts[selectedHoaDonId].length > 0 ? (
              selectedProducts[selectedHoaDonId].map((product) => (
                <div key={product.ID} className="selected_product">
                  {product.ANH_GIAY && (
                    <img src={product.ANH_GIAY} alt={product.TEN} />
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
              ))
            ) : (
              <div></div>
            )}
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
