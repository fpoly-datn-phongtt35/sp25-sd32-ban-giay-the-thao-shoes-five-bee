import React from "react";
import "./banhangtaiquay.css";
import { getGiay } from "../service/GiayService";
import { useState, useEffect, useParams } from "react";
import { Button, Input, message, Select, Modal, Switch } from "antd";
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
  deleteSanPhamHoaDonChiTiet,
  updateSoLuongGiay,
  thanhToanTaiQuay,
} from "../service/BanHangTaiQuay";
import {
  detailGiamGiaHoaDon,
  getGiamGia,
} from "../service/GiamGiaHoaDonService";
import WebcamComponent from "./WebcamComponent";

import { createVNPayPayment } from "../service/VnpayService";

import AddressModal from "./AddressModal";

const BanHangTaiQuay = () => {
  const [suggestions, setSuggestions] = useState([]); // Danh sách gợi ý
  const [showPopupwebcam, setShowPopupwebcam] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [khachHangTimThay, setKhachHangTimThay] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [giay, setGiay] = useState([]);
  const [sdtNguoiNhan, setSdtNguoiNhan] = useState("");
  const [hoaDonChiTiet, setHoaDonChiTiet] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalHoaDon, setTotalHoaDon] = useState(0);
  const [customerMoney, setCustomerMoney] = useState(totalHoaDon);
  const [maGiamGiaList, setMaGiamGiaList] = useState([]); // Thêm state này
  const [selectedMaGiamGia, setSelectedMaGiamGia] = useState(null); // State cho mã giảm giá được chọn
  const [giaTriGiam, setGiaTriGiam] = useState(0); // Giá trị giảm
  const [loaiGiamGia, setLoaiGiamGia] = useState("VNĐ"); // Loại giảm giá (VNĐ hoặc %)
  const [totalHoaDonGoc, setTotalHoaDonGoc] = useState(totalHoaDon);
  const [tenMaGiamGia, setTenMaGiamGia] = useState("");
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
  const [showWebcam, setShowWebcam] = useState(false);
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
  const [diaChi, setDiaChi] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isGiaoHang, setIsGiaoHang] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { Option } = Select;
  const [selectedHoaDonId, setSelectedHoaDonId] = useState(null);
  const [initialTotalHoaDon, setInitialTotalHoaDon] = useState(totalHoaDon);
  const [hoaDonCho, setHoaDonCho] = useState([]);
  const [scanResult, setScanResult] = useState("");
  const [selectedSize, setSelectedSize] = useState(""); // Lọc kích cỡ
  const [selectedColor, setSelectedColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availablePageNumbers, setAvailablePageNumbers] = useState([
    1, 2, 3, 4, 5,
  ]);
  useEffect(() => {
    getAllGiay();
    getAllKhachHangData();
    getChuongTrinhGiamGia();
    fetchHoaDonCho();
    getAllMaGiamGiaData();
  }, []);

  useEffect(() => {
    setSelectedPaymentMethod(0);
  }, []);

  useEffect(() => {
    setCustomerMoney(totalHoaDon);
  }, [totalHoaDon]);
  const getAllGiay = async () => {
    try {
      const result = await getAllGiayChiTiet();
      console.log("Dữ liệu giày:", result.data);

      if (!result || !Array.isArray(result.data)) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      // Lọc giày có trạng thái Đang bán
      const dataGiay = result.data
        .filter((item) => item.trangThai === 0) // Chỉ lấy giày có trạng thái Đang bán
        .map((item) => ({
          ID: item.id,
          TEN: item.giayEntity ? item.giayEntity.ten : null,
          GIABAN: item.giaBan,
          SOLUONG: item.soLuongTon,
          KICH_CO: item.kichCoEntity ? item.kichCoEntity.ten : "N/A",
          MAU_SAC: item.mauSacEntity ? item.mauSacEntity.ten : "N/A",
          TRANG_THAI: item.trangThai === 0 ? "Hoạt động" : "Không hoạt động",
          ANH_GIAY:
            item.giayEntity?.anhGiayEntities?.length > 0
              ? item.giayEntity.anhGiayEntities[0].tenUrl
              : null,
        }));

      setGiay(dataGiay);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giày:", error);
      message.error(`Lỗi khi lấy dữ liệu: ${error.message}`);
    }
  };
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

  // Thêm state để theo dõi số lượng sản phẩm trong mỗi hóa đơn
  const [invoiceProductCounts, setInvoiceProductCounts] = useState({});

  const handleInputChange = (event) => {
    const rawValue = event.target.value.replace(/\D/g, ""); // Chỉ lấy số
    const parsedMoney = parseInt(rawValue, 10) || 0; // Chuyển thành số
    setCustomerMoney(parsedMoney.toLocaleString("vi-VN")); // Format số tiền
    setChangeAmount(parsedMoney - totalHoaDon);
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
      fetchSanPhamTrongHoaDon(idHoaDon);
      getAllGiay();
      message.success(`Thêm sản phẩm "${product.TEN}" vào hóa đơn thành công!`);
    } catch (error) {
      console.error("❌ Lỗi khi thêm sản phẩm vào hóa đơn:", error);
      message.error("Không thể thêm sản phẩm vào hóa đơn.");
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      if (!selectedHoaDonId) {
        message.error("Không tìm thấy ID hóa đơn!");
        return;
      }

      const hoaDonId = selectedHoaDonId; // Lấy ID hóa đơn hiện tại
      console.log("ID hóa đơn:", hoaDonId);

      // Xóa sản phẩm khỏi state ngay lập tức
      setSelectedProducts((prevSelectedProducts) => {
        const updatedProducts = { ...prevSelectedProducts };

        if (Array.isArray(updatedProducts[hoaDonId])) {
          updatedProducts[hoaDonId] = updatedProducts[hoaDonId].filter(
            (product) => product.ID !== productId
          );
        }

        return updatedProducts;
      });

      // Gọi API xóa sản phẩm
      await deleteSanPhamHoaDonChiTiet(productId);
      message.success("Xóa sản phẩm thành công!");
      getAllGiay();

      // Cập nhật lại số lượng sản phẩm trong hóa đơn
      fetchSanPhamTrongHoaDon(hoaDonId);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Không thể xóa sản phẩm!");
    }
  };

  const increaseQuantity = async (productId, hoaDonId) => {
    try {
      const response = await updateSoLuongGiay(productId, true);
      if (!response) {
        throw new Error("Không nhận được phản hồi từ API");
      }

      await fetchSanPhamTrongHoaDon(hoaDonId, (updatedProducts) => {
        console.log("📡 Danh sách sản phẩm sau cập nhật:", updatedProducts);

        if (!updatedProducts) {
          console.error("⚠ Không thể lấy danh sách sản phẩm sau khi cập nhật!");
          return;
        }

        setSelectedProducts((prev) => ({
          ...prev,
          [hoaDonId]: updatedProducts,
        }));

        const newTotalAmount = updatedProducts.reduce(
          (total, product) =>
            total + (product.GIABAN ?? 0) * (product.SOLUONG ?? 0),
          0
        );

        console.log("💰 Tổng tiền mới:", newTotalAmount);
        setTotalAmount(newTotalAmount);
        handleInputChange();
      });

      getAllGiay();
    } catch (error) {
      console.error("❌ Lỗi khi tăng số lượng:", error);
      message.error("Không thể tăng số lượng!");
    }
  };

  const decreaseQuantity = async (productId, hoaDonId) => {
    try {
      const response = await updateSoLuongGiay(productId, false);
      if (!response) {
        throw new Error("Không nhận được phản hồi từ API");
      }

      await fetchSanPhamTrongHoaDon(hoaDonId, (updatedProducts) => {
        console.log("📡 Danh sách sản phẩm sau cập nhật:", updatedProducts);

        if (!updatedProducts) {
          console.error("⚠ Không thể lấy danh sách sản phẩm sau khi cập nhật!");
          return;
        }

        setSelectedProducts((prev) => ({
          ...prev,
          [hoaDonId]: updatedProducts,
        }));

        const newTotalAmount = updatedProducts.reduce(
          (total, product) =>
            total + (product.GIABAN ?? 0) * (product.SOLUONG ?? 0),
          0
        );

        console.log("💰 Tổng tiền mới:", newTotalAmount);
        setTotalAmount(newTotalAmount);
        handleInputChange();
      });

      getAllGiay();
    } catch (error) {
      console.error("❌ Lỗi khi tăng số lượng:", error);
      message.error("Không thể tăng số lượng!");
    }
  };

  const calculateTotal = (product) => {
    return product.GIABAN * product.SOLUONG;
  };
  const getAllMaGiamGiaData = async () => {
    try {
      const result = await getGiamGia(); // Thay đổi từ getGiamGiaHoaDon sang getGiamGia
      console.log("API Response (Mã giảm giá):", result.data);

      if (!result || !result.data) {
        throw new Error("Dữ liệu API không hợp lệ");
      }

      // Chuyển đổi dữ liệu từ API
      const maGiamGia = result.data;
      const formattedMaGiamGia = {
        id: maGiamGia.id,
        ten: maGiamGia.ten ?? "Không có tên",
        giaTri: maGiamGia.phanTramGiam ?? 0,
        loai: maGiamGia.loai ?? "VNĐ",
        soluong: maGiamGia.soLuong,
        soTienGiamMax: maGiamGia.soTienGiamMax,
      };

      console.log("Mã giảm giá đã được format:", formattedMaGiamGia);
      setMaGiamGiaList([formattedMaGiamGia]); // Đặt trong mảng vì API trả về mã giảm giá tốt nhất
    } catch (error) {
      console.error("Lỗi khi lấy mã giảm giá:", error);
      message.error("Không thể tải mã giảm giá");
    }
  };

  const handleMaGiamGiaChange = async (value) => {
    let hoaDonGoc = totalHoaDon + giaTriGiam; // Reset tổng tiền về ban đầu trước khi áp dụng mã mới

    // Nếu đã có mã giảm giá, hủy mã cũ
    if (tenMaGiamGia) {
      message.info(`Hủy mã giảm giá cũ: ${tenMaGiamGia}`);
      setTotalHoaDon(hoaDonGoc);
      setGiaTriGiam(0);
      setTenMaGiamGia("");
    }

    setSelectedMaGiamGia(value);

    try {
      const response = await detailGiamGiaHoaDon(value);
      console.log("Chi tiết mã giảm giá:", response.data);

      const maGiamGia = response.data;

      // Bỏ qua mã giảm giá nếu không hoạt động
      // if (maGiamGia.TRANG_THAI !== 0) {
      //   message.error("Mã giảm giá này không hoạt động!");
      //   return;
      // }

      const today = new Date();
      const startDate = new Date(maGiamGia.ngayBatDau);
      const endDate = new Date(maGiamGia.ngayKetThuc);

      if (today < startDate) {
        message.error("Mã giảm giá chưa đến thời gian áp dụng!");
        return;
      }

      if (today > endDate) {
        message.error("Mã giảm giá đã hết hạn!");
        return;
      }

      if (maGiamGia.soLuong <= 0) {
        message.error("Mã giảm giá đã hết số lượng!");
        return;
      }

      if (hoaDonGoc < maGiamGia.dieuKien) {
        message.error(
          `Đơn hàng cần tối thiểu ${maGiamGia.dieuKien.toLocaleString()} VNĐ để áp dụng mã giảm giá!`
        );
        return;
      }

      // Lấy số tiền giảm tối đa từ API
      const soTienGiamMax = maGiamGia.soTienGiamMax;

      // Tính số tiền giảm theo phần trăm
      let soTienGiam = (hoaDonGoc * maGiamGia.phanTramGiam) / 100;

      // Kiểm tra nếu số tiền giảm vượt quá số tiền tối đa
      if (soTienGiam > soTienGiamMax) {
        soTienGiam = soTienGiamMax;
      }

      // Cập nhật tổng tiền sau giảm
      const sotienHoaDonSaukhigiam = hoaDonGoc - soTienGiam;

      setTotalHoaDon(sotienHoaDonSaukhigiam);
      setTenMaGiamGia(maGiamGia.ten);
      setGiaTriGiam(soTienGiam);
      setLoaiGiamGia("PERCENT");

      message.success(
        `Áp dụng mã giảm giá thành công! Giảm ${soTienGiam.toLocaleString()} VNĐ`
      );
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết mã giảm giá:", error);
      message.error("Không thể lấy thông tin mã giảm giá");
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
      console.log("khachhang", response.data);
      const khachHang = response.data;
      setHoTen(khachHang.hoTen);
      setSoDienThoai(khachHang.soDienThoai);
      setDiaChi(khachHang.diaChi);
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

      // Lọc danh sách khách hàng có roleEntity.ten === "ROLE_USER"
      const filteredUsers = result.data
        .filter(
          (user) =>
            Array.isArray(user.userRoleEntities) &&
            user.userRoleEntities.some(
              (role) => role.roleEntity?.ten === "ROLE_USER"
            )
        )
        .map((user) => ({
          id: user.id,
          hoTen: user.hoTen ?? "Không có tên",
          soDienThoai: user.soDienThoai ?? "Không có SĐT",
          diaChi:
            Array.isArray(user.diaChiEntities) && user.diaChiEntities.length > 0
              ? user.diaChiEntities.map((diaChi) => diaChi.diaChi).join(", ")
              : "Không có địa chỉ",
        }));

      console.log("Danh sách khách hàng sau khi lọc:", filteredUsers);

      setKhachHangList(filteredUsers);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      message.error("Không thể tải danh sách khách hàng");
    }
  };

  const fetchHoaDonCho = async (updatedHoaDonId = null) => {
    try {
      const response = await getListHoaDonCho();

      const hoaDonPages = response.data.map((hoaDon, index) => ({
        id: index + 1, // Số hóa đơn
        hoaDonId: hoaDon.id, // ID hóa đơn từ API
      }));

      setPages(hoaDonPages);

      // Nếu có ID hóa đơn cần cập nhật, giữ nguyên hóa đơn hiện tại
      if (updatedHoaDonId) {
        setSelectedHoaDonId(updatedHoaDonId); // Giữ nguyên hóa đơn sau khi cập nhật
        fetchSanPhamTrongHoaDon(updatedHoaDonId, setSelectedProducts);
        return;
      }

      // Nếu chưa có hóa đơn nào được chọn, chọn hóa đơn đầu tiên
      if (!selectedHoaDonId && hoaDonPages.length > 0) {
        const firstHoaDonId = hoaDonPages[0].hoaDonId;
        setSelectedHoaDonId(firstHoaDonId);
        console.log("ID hóa đơn đầu tiên:", firstHoaDonId);
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
      console.log("Dữ liệu sản phẩm trong hóa đơn:", result.data);

      const formattedData = Array.isArray(result.data)
        ? result.data.map((item) => {
          const kichCo = item.giayChiTietEntity?.kichCoEntity?.ten ?? "N/A";
          const mauSac = item.giayChiTietEntity?.mauSacEntity?.ten ?? "N/A";

          return {
            ID: item.id,
            TEN: item.giayChiTietEntity?.giayEntity?.ten || "Không xác định",
            SOLUONG: item.soLuong,
            GIABAN: item.giayChiTietEntity?.giaBan || 0,
            ANH_GIAY:
              item.giayChiTietEntity?.giayEntity?.anhGiayEntities?.[0]
                ?.tenUrl || "https://via.placeholder.com/150",
            KICH_CO: kichCo, // Lưu vào biến kích cỡ
            MAU_SAC: mauSac, // Lưu vào biến màu sắc
            TRANG_THAI: "Đang bán", // Không cần kiểm tra lại vì đã lọc trước đó
          };
        })
        : [];

      console.log("dsadasqewrq", formattedData);
      // Cập nhật số lượng sản phẩm trong hóa đơn
      setInvoiceProductCounts((prev) => ({
        ...prev,
        [idHoaDon]: formattedData.length,
      }));

      setSelectedProducts((prev) => {
        const updatedProducts = {
          ...prev,
          [idHoaDon]: formattedData,
        };

        // Tính tổng tiền ngay sau khi cập nhật sản phẩm
        const newTotalAmount = formattedData.reduce((total, product) => {
          const giaBan = product.GIABAN ?? 0;
          const soLuong = product.SOLUONG ?? 0;
          return total + giaBan * soLuong;
        }, 0);

        setTotalHoaDon(newTotalAmount);
        console.log(`💰 Tổng tiền của hóa đơn ${idHoaDon}:`, newTotalAmount);

        return updatedProducts;
      });
    } catch (error) {
      console.error("Lỗi khi fetch danh sách sản phẩm: ", error);
      message.error("Lỗi khi tải danh sách sản phẩm!");
    }
  };

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

  const getTotalAmount = (products) => {
    if (!Array.isArray(products)) return 0; // Nếu products không phải là mảng, trả về 0

    const subtotal = products.reduce((total, product) => {
      const giaBan = Number.isFinite(product.GIABAN) ? product.GIABAN : 0;
      const soLuong = Number.isFinite(product.SOLUONG) ? product.SOLUONG : 0;
      return total + giaBan * soLuong;
    }, 0);

    const totalAmount = subtotal - (soTienGiam || 0); // Trừ tiền giảm giá (nếu có)

    return Math.max(totalAmount, 0); // Không để tổng tiền âm
  };

  useEffect(() => {
    updateTotalAmount();
  }, [selectedProducts, selectedPage, soTienGiam]);

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
    if (selectedPaymentMethod === null) {
      message.error("Vui lòng chọn hình thức thanh toán!");
      return;
    }

    if (selectedPaymentMethod === 0 && changeAmount < 0) {
      message.error("Số tiền khách đưa không đủ!");
      return;
    }

    const hoaDonRequest = {
      ma: `HD${moment().format("YYYYMMDDHHmmss")}`,
      moTa: isGiaoHang ? "Giao hàng" : "Thanh toán tại quầy",
      tenNguoiNhan: hoTen || "Khách lẻ",
      sdtNguoiNhan: selectedKhachHang
        ? soDienThoai
        : sdtNguoiNhan?.trim() !== ""
          ? sdtNguoiNhan
          : null,
      tongTien: totalHoaDon,
      diaChi: isGiaoHang ? diaChi : null,
      idGiamGia: selectedMaGiamGia || null,
      hinhThucThanhToan: selectedPaymentMethod,
      isGiaoHang: isGiaoHang,
      trangThai: isGiaoHang
        ? selectedPaymentMethod === 0 || selectedPaymentMethod === 1
          ? 3
          : 0
        : 2,
    };

    try {
      if (selectedPaymentMethod === 0 || selectedPaymentMethod === 2) {
        // ✅ Tiền mặt hoặc Thanh toán khi giao hàng
        const response = await thanhToanTaiQuay(
          selectedHoaDonId,
          hoaDonRequest
        );
        if (response.status === 200) {
          message.success(
            selectedPaymentMethod === 2
              ? "Hóa đơn đã tạo, chờ thanh toán khi giao hàng!"
              : "Thanh toán thành công!"
          );
          await getAllGiay();
          resetState();
          fetchHoaDonCho();
        }
      } else if (selectedPaymentMethod === 1) {
        // ✅ VNPay
        const vnpayResponse = await createVNPayPayment(
          totalHoaDon,
          selectedHoaDonId
        );
        if (vnpayResponse.data) {
          await thanhToanTaiQuay(selectedHoaDonId, hoaDonRequest);

          // Lưu URL VNPAY trước khi reset state
          const paymentUrl = vnpayResponse.data;

          // Reset state trước khi chuyển hướng
          resetState();
          window.location.href = vnpayResponse.data;
        }
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      message.error("Có lỗi xảy ra khi thanh toán!");
    }
  };

  const resetState = () => {
    setSelectedProducts({});
    setCustomerMoney("");
    setSelectedKhachHang(null);
    setHoTen("");
    setSoDienThoai("");
    setDiaChi("");
    setSdtNguoiNhan("");
    setPages([]);
    setSelectedPage(1);
    setIsKhachLe(true);
    setPageCounter(2);
    setTotalAmount(0);
    setTotalHoaDon(0); // Reset total amount
    setChangeAmount(0);
    setSelectedOption(null);
    setSelectedGiamGia(null);
    setAppliedGiamGia(null);
    setSoTienGiam(0);
    setSelectedMaGiamGia(null);
    setGiaTriGiam(0);
    setTenMaGiamGia(""); // Reset discount code name
    setLoaiGiamGia("VNĐ"); // Reset discount type
    setIsGiaoHang(false); // Reset delivery option
    // setSelectedPaymentMethod(null); // Reset payment method
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
    if (!hoTen || !sdtNguoiNhan) {
      message.error("Vui lòng nhập đầy đủ thông tin khách hàng!");
      return;
    }

    const newData = {
      hoTen,
      sdtNguoiNhan,
    };

    try {
      await addKhachHang(newData); // Chỉ gửi tên và số điện thoại
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

      // Khởi tạo số lượng sản phẩm là 0 cho hóa đơn mới
      setInvoiceProductCounts((prev) => ({
        ...prev,
        [createdHoaDonId]: 0,
      }));

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
        resetState();
      } else {
        // Nếu trang bị xóa là trang đang được chọn, chọn trang đầu tiên còn lại
        if (selectedPage === pageId) {
          const newSelectedPage = remainingPages[0].id;
          const newSelectedHoaDonId = remainingPages[0].hoaDonId;
          setSelectedPage(newSelectedPage);
          setSelectedHoaDonId(newSelectedHoaDonId);

          // Cập nhật danh sách sản phẩm và tổng tiền cho trang mới được chọn
          fetchSanPhamTrongHoaDon(newSelectedHoaDonId);
        }
      }

      setAvailablePageNumbers((prevNumbers) => [...prevNumbers, pageId].sort());
      getAllGiay();
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
    setDiaChi("");
  };
  const danhSachKichCo = [...new Set(giay.map((item) => item.KICH_CO))];
  const danhSachMauSac = [...new Set(giay.map((item) => item.MAU_SAC))];
  const filteredGiay = giay.filter((item) => {
    const searchStr = searchTerm.toLowerCase();
    const matchSearch = ["TEN", "GIABAN", "SOLUONG", "KICH_CO", "MAU_SAC"].some(
      (key) =>
        item[key]
          ? item[key].toString().toLowerCase().includes(searchStr)
          : false
    );

    const matchSize = selectedSize ? item.KICH_CO === selectedSize : true;
    const matchColor = selectedColor ? item.MAU_SAC === selectedColor : true;

    const matchPrice =
      (!minPrice || item.GIABAN >= parseFloat(minPrice)) &&
      (!maxPrice || item.GIABAN <= parseFloat(maxPrice));

    return matchSearch && matchSize && matchColor && matchPrice;
  });

  useEffect(() => {
    if (!soDienThoai || soDienThoai.trim() === "") {
      setSuggestions([]);
      setSelectedKhachHang(null);
      setHoTen("");
      return;
    }

    const filteredKhachHang = khachHangList.filter((kh) =>
      kh.soDienThoai.startsWith(soDienThoai)
    );

    setSuggestions(filteredKhachHang);
  }, [soDienThoai, khachHangList]);

  // Khi chọn khách hàng từ danh sách gợi ý
  const handleSelectKhachHang = (value) => {
    const foundKhachHang = khachHangList.find((kh) => kh.id === value);
    if (foundKhachHang) {
      setSoDienThoai(foundKhachHang.soDienThoai);
      setHoTen(foundKhachHang.hoTen);
      setSelectedKhachHang(foundKhachHang.id);
    }
  };

  // Thêm hàm xử lý xóa hóa đơn
  const handleDeletePage = async (hoaDonId) => {
    try {
      // Hiển thị xác nhận trước khi xóa
      Modal.confirm({
        title: "Xác nhận xóa hóa đơn",
        content: "Bạn có chắc chắn muốn xóa hóa đơn này không?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          await deleteHoaDonCho(hoaDonId);
          message.success("Xóa hóa đơn thành công!");

          // Cập nhật lại danh sách hóa đơn
          const updatedPages = pages.filter(
            (page) => page.hoaDonId !== hoaDonId
          );
          setPages(updatedPages);

          // Nếu hóa đơn đang được chọn bị xóa, chọn hóa đơn khác
          if (selectedHoaDonId === hoaDonId) {
            if (updatedPages.length > 0) {
              // Chọn hóa đơn đầu tiên trong danh sách còn lại
              setSelectedHoaDonId(updatedPages[0].hoaDonId);
              setSelectedPage(updatedPages[0].id);
              // Cập nhật sản phẩm và tổng tiền cho hóa đơn mới
              fetchSanPhamTrongHoaDon(updatedPages[0].hoaDonId);
            } else {
              // Nếu không còn hóa đơn nào, reset toàn bộ state
              resetState();
            }
          }
          fetchHoaDonCho();
        },
      });
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      message.error("Không thể xóa hóa đơn!");
    }
  };

  return (
    <div className="quay_container">
      <div className="left">
        <div className="product_list_hd">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div className="page_buttons">
                {pages.map((page) => (
                  <div key={page.id} className="page_button_container">
                    <button
                      className={`page_button ${selectedPage === page.id ? "selected" : ""
                        } ${invoiceProductCounts[page.hoaDonId] > 0
                          ? "has-products"
                          : "empty-invoice"
                        }`}
                      onClick={() => handleSelectPage(page.id, page.hoaDonId)}
                    >
                      HD {page.id}
                      {invoiceProductCounts[page.hoaDonId] > 0 && (
                        <span className="product-count">
                          {" "}
                          ({invoiceProductCounts[page.hoaDonId]})
                        </span>
                      )}
                    </button>
                    <button
                      className="delete_page_button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page.hoaDonId);
                      }}
                      title="Xóa hóa đơn"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {pages.length < 5 && (
                  <button className="add_page_button" onClick={handleAddPage}>
                    +
                  </button>
                )}
              </div>
            </div>
            <div>
              <Button onClick={() => setShowPopupwebcam(true)}>
                Bật Webcam
              </Button>

              {showPopupwebcam && (
                <div className="overlay_webcam">
                  <WebcamComponent
                    onClose={() => setShowPopupwebcam(false)}
                    onScanSuccess={(result) => setScanResult(result)}
                  />
                </div>
              )}

              {scanResult && <p>Kết quả quét: {scanResult}</p>}
            </div>
          </div>
          {/* hiển thị sản phẩm */}
          <div className="selected_products">
            {selectedHoaDonId &&
              selectedProducts[selectedHoaDonId] &&
              selectedProducts[selectedHoaDonId].length > 0 ? (
              selectedProducts[selectedHoaDonId].map((product) => (
                <div key={product.ID} className="selected_product">
                  {product.ANH_GIAY && (
                    <img src={product.ANH_GIAY} alt={product.TEN} />
                  )}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>{product.TEN}</div>
                    <div style={{ marginLeft: "10px", fontSize: "0.9em" }}>
                      <span style={{ fontWeight: "bold" }}>Kích cỡ:</span> (
                      {product.KICH_CO})
                    </div>
                    <div style={{ marginLeft: "10px", fontSize: "0.9em" }}>
                      <span style={{ fontWeight: "bold" }}>Màu sắc:</span> (
                      {product.MAU_SAC})
                    </div>
                  </div>

                  <div>{product.GIABAN}</div>
                  <div className="quantity_controls">
                    <Button
                      onClick={() =>
                        decreaseQuantity(product.ID, selectedHoaDonId)
                      }
                    >
                      -
                    </Button>
                    <span>{product.SOLUONG}</span>
                    <Button
                      onClick={() =>
                        increaseQuantity(product.ID, selectedHoaDonId)
                      }
                    >
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
              <div className="empty-invoice-message">
                <div className="empty-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <p>Chưa có sản phẩm nào trong hóa đơn</p>
                <p className="empty-hint">
                  Vui lòng chọn sản phẩm từ danh sách bên dưới
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="product_list_tt">
          {/* Ô tìm kiếm */}
          <div style={{ display: "flex" }}>
            {/* Ô tìm kiếm */}
            <div
              style={{
                top: 0,
                background: "white",
                zIndex: 1000,
                padding: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px",
                  width: "100%",
                  borderRadius: "15px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* Bộ lọc kích cỡ */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={{ margin: "10px", padding: "5px", borderRadius: "15px" }}
            >
              <option value="">Tất cả kích cỡ</option>
              {danhSachKichCo.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            {/* Bộ lọc màu sắc */}
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{ margin: "10px", padding: "5px", borderRadius: "15px" }}
            >
              <option value="">Tất cả màu sắc</option>
              {danhSachMauSac.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
              {/* <p>Lọc theo khoảng giá</p> */}
              <input
                type="number"
                placeholder="Giá tối thiểu"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{
                  padding: "5px",
                  width: "120px",
                  borderRadius: "15px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="number"
                placeholder="Giá tối đa"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{
                  padding: "5px",
                  width: "120px",
                  borderRadius: "15px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          <table className="product_table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th style={{ width: "300px" }}>Tên</th>
                <th>Giá Bán</th>
                <th>Số Lượng</th>
                <th>Kích Cỡ</th>
                <th>Màu Sắc</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredGiay.map((item) => (
                <tr
                  key={item.ID}
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
                  <td>
                    {item.ANH_GIAY ? (
                      <img
                        src={item.ANH_GIAY}
                        width={100}
                        height={100}
                        alt={item.TEN}
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {item.TEN}
                  </td>
                  <td>{item.GIABAN.toLocaleString("vi-VN")} đ</td>
                  <td>{item.SOLUONG}</td>
                  <td>{item.KICH_CO}</td>
                  <td>{item.MAU_SAC}</td>
                  <td>{item.SOLUONG === 0 ? "Hết hàng" : item.TRANG_THAI}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="right">
        <div>
          <span>Tìm khách hàng theo số điện thoại:</span>
          <Select
            allowClear
            showSearch
            value={soDienThoai}
            placeholder="Nhập số điện thoại khách hàng"
            onSearch={(value) => setSoDienThoai(value)}
            onChange={(value) => {
              setSoDienThoai(value);
              setSdtNguoiNhan(value);
              const selected = khachHangList.find(
                (kh) => kh.soDienThoai === value
              );
              if (selected) {
                setHoTen(selected.hoTen);
                setSelectedKhachHang(selected.id);
                setDiaChi(selected.diaChi || "");
              }
            }}
            style={{ width: "100%", marginBottom: "10px" }}
            filterOption={false}
            onClear={handleClear}
          >
            {suggestions.map((kh) => (
              <Option key={kh.id} value={kh.soDienThoai}>
                {kh.soDienThoai} - {kh.hoTen}
              </Option>
            ))}
          </Select>

          <span>Họ tên:</span>
          <Input
            type="text"
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            placeholder="Nhập họ tên khách hàng"
            style={{ marginBottom: "10px" }}
          />
          <span>SĐT người nhận:</span>
          <Input
            type="text"
            value={sdtNguoiNhan}
            onChange={(e) => setSdtNguoiNhan(e.target.value)}
            placeholder="Nhập số điện thoại người nhận"
            style={{ marginBottom: "10px" }}
          />
        </div>
        {isGiaoHang && (
          <div>
            <label>Địa Chỉ:</label>
            <Input
              type="text"
              value={diaChi}
              onClick={() => setShowModal(true)}
              placeholder="Nhập địa chỉ khách hàng"
              readOnly
            />
            <AddressModal
              visible={showModal}
              onClose={() => setShowModal(false)}
              setDiaChi={setDiaChi}
            />
          </div>
        )}
        <Button
          type="primary"
          onClick={handleAddKhachHang}
          style={{ marginTop: "10px" }}
          disabled={!hoTen || !sdtNguoiNhan}
        >
          Thêm Khách Hàng Mới
        </Button>
        <br />

        <Select
          placeholder="Chọn Mã Giảm Giá"
          value={selectedMaGiamGia || undefined}
          onChange={handleMaGiamGiaChange}
          allowClear
          style={{ width: "100%" }}
        >
          {Array.isArray(maGiamGiaList) &&
            maGiamGiaList.map((mg) => (
              <Option key={mg.id} value={mg.id}>
                {mg.ten} - {mg.giaTri} %
              </Option>
            ))}
        </Select>
        {tenMaGiamGia && (
          <div style={{ color: "green", marginTop: "5px" }}>
            <i className="fas fa-check-circle"></i> Đã áp dụng mã giảm giá tốt
            nhất: {tenMaGiamGia} ({giaTriGiam.toLocaleString("vi-VN")} VNĐ)
          </div>
        )}
        <p>Tiền Khách Phải Trả: {formatCurrency(totalHoaDon)} VND</p>
        {selectedPaymentMethod === 0 && (
          <div>
            <label htmlFor="customerMoney">Tiền khách đưa:</label>
            <Input
              id="customerMoney"
              value={formatCurrency(customerMoney)}
              onChange={handleInputChange}
              placeholder="Nhập số tiền khách đưa"
            />
          </div>
        )}
        <hr />
        <p className={changeAmount < 0 ? "negative-change" : ""}>
          Tiền thừa: {formatCurrency(changeAmount)}
        </p>
        <hr />
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Giao hàng:</label>
          <Switch
            checked={isGiaoHang}
            onChange={() => setIsGiaoHang(!isGiaoHang)}
          />
        </div>
        <div className="payment-options">
          <label>Hình thức thanh toán:</label>
          <Select
            value={selectedPaymentMethod}
            onChange={(value) => setSelectedPaymentMethod(value)}
            style={{ width: "100%", marginTop: "5px" }}
          >
            <Option value={0}>Tiền mặt</Option>
            <Option value={1}>Chuyển khoản (VNPay)</Option>
            {isGiaoHang && <Option value={2}>Thanh toán khi giao hàng</Option>}
          </Select>
        </div>
        <p style={{ paddingTop: "10px" }}>
          Tổng Tiền: {formatCurrency(totalHoaDon)}
        </p>
        <button
          className="btn-tt"
          onClick={handlePayment}
          disabled={totalHoaDon <= 0}
        >
          Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default BanHangTaiQuay;
