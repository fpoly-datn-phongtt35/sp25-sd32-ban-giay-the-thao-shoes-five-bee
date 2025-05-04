import React, { useState, useEffect } from "react";
import "./GiamGiaSanPham.css";
import {
  Space,
  Table,
  Button,
  Input,
  message,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  addPhieuGiamGia,
  deletePhieuGiamGia,
  getPhieuGiamGia,
  updatePhieuGiamGia,
  taoGiamGia,
  detailPhieuGiamGia,
} from "../service/PhieuGiamGiaService";
import { getGiay, getGiayDetail } from "../service/GiayService";
import { FilterOutlined } from "@ant-design/icons";
import {
  getAllGiayChiTiet,
  getGiayChitietDetail1,
} from "../service/GiayChiTietService";
const DotGiamGia = () => {
  const [ma, setMa] = useState("");
  const [ten, setTen] = useState("");
  const [phanTramGiam, setPhamTramGiam] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState("");
  const [ngayKetThuc, setNgayKetThuc] = useState("");
  const [dotGiamGia, setDotGiamGia] = useState([]);
  const [dieuKien, setDieuKien] = useState("");
  const [soTienGiamMax, setSoTienGiamMax] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [editingDotGiamGia, setEditingDotGiamGia] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { RangePicker } = DatePicker;
  const [giay, setGiay] = useState([]);
  const [giayChiTiet, setGiayChiTiet] = useState([]);
  const [giayChiTietAll, setGiayChiTietAll] = useState([]);
  const [filteredByColor, setFilteredByColor] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState(""); // Lọc kích cỡ
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSl, setSelectedSL] = useState(""); // Lưu thương hiệu đã chọn
  // Lưu thương hiệu đã chọn
  const [stockMin, setStockMin] = useState();
  const [stockMax, setStockMax] = useState();

  
  const [filteredByBrand, setFilteredByBrand] = useState([]);
  const [filters, setFilters] = useState({
    ten: "",
    phanTramGiam: "",
    tuNgay: null,
    denNgay: null,
    trangThai: "all",
  });
  const handleRowClick = (record) => {
    setSelectedRowKey(record.id); // Cập nhật ID dòng được chọn
    fetchSanPhamChiTiet(record); // Gọi hàm để lấy chi tiết sản phẩm
  };
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      ten: "",
      phanTramGiam: "",
      tuNgay: null,
      denNgay: null,
      trangThai: "all",
    });
    loadDotGiamGia();
  };

  const handleApply = () => {
    let newData = dotGiamGia.filter((item) => {
      return (
        (filters.ten === "" || item.TEN.includes(filters.ten)) &&
        (filters.phanTramGiam === "" ||
          item.PHAN_TRAM_GIAM.toString() === filters.phanTramGiam) &&
        (filters.tuNgay === null ||
          new Date(item.NGAY_BAT_DAU) >= filters.tuNgay) &&
        (filters.denNgay === null ||
          new Date(item.NGAY_KET_THUC) <= filters.denNgay) &&
        (filters.trangThai === "all" || item.TRANG_THAI === filters.trangThai)
      );
    });
    setDotGiamGia(newData);
  };

  const loadDotGiamGia = async () => {
    try {
      const result = await getPhieuGiamGia();

      const dotGiamGiaData = result.data.map((item, index) => ({
        key: index,
        ID: item.id,
        MA: item.ma,
        TEN: item.ten,
        PHAN_TRAM_GIAM: item.phanTramGiam,
        NGAY_BAT_DAU: item.ngayBatDau,
        NGAY_KET_THUC: item.ngayKetThuc,
        TRANG_THAI: item.trangThai,
      }));

      // ✅ Sắp xếp từ cao đến thấp theo phần trăm giảm
      dotGiamGiaData.sort((a, b) => b.PHAN_TRAM_GIAM - a.PHAN_TRAM_GIAM);

      setDotGiamGia(dotGiamGiaData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đợt giảm giá:", error);
    }
  };

  const getAllGiay = async () => {
    try {
      const result = await getGiay();

      if (!result || !result.data) {
        console.error("Error: result.data is undefined or null");
        return;
      }

      if (!Array.isArray(result.data)) {
        console.error("Error: result.data is not an array", result.data);
        return;
      }

      const dataGiay = result.data.map((item) => ({
        ID: item.id,
        MA: item.ma,
        TEN: item.ten,
        MOTA: item.moTa,
        GIABAN: item.giaBan,
        SOLUONGTON: item.soLuongTon,
        TRANG_THAI: item.trangThai,
        THUONG_HIEU: item.thuongHieu ? item.thuongHieu.ten : null,
        DANH_MUC: item.danhMuc ? item.danhMuc.ten : null,
        CHAT_LIEU: item.chatLieu ? item.chatLieu.ten : null,
        DE_GIAY: item.deGiay ? item.deGiay.ten : null,
        XUAT_XU: item.xuatXu ? item.xuatXu.ten : null,
        KIEU_DANG: item.kieuDang ? item.kieuDang.ten : null,
        MAU_SAC: item.mauSac ? item.mauSac.ten : null,
        ANH_GIAY:
          item.anhGiayEntities && item.anhGiayEntities.length > 0
            ? item.anhGiayEntities[0].tenUrl
            : null, // Lấy ảnh đầu tiên
        // Nếu muốn lấy toàn bộ ảnh: item.anhGiayEntities ? item.anhGiayEntities.map(img => img.tenUrl) : [],
        KICH_CO: item.kichCo ? item.kichCo.ten : null,
      }));

      setGiay(dataGiay);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getGiayChiTietAll = async () => {
    try {
      const result = await getAllGiayChiTiet();

      if (!result || !result.data) {
        console.error("Error: result.data is undefined or null");
        return;
      }

      if (!Array.isArray(result.data)) {
        console.error("Error: result.data is not an array", result.data);
        return;
      }

      const dataGiayChitiet = result.data.map((item) => ({
        ID: item.id,
        MA: item.maVach, // Mã vạch của sản phẩm
        TEN: item.giayEntity?.ten || null,
        MOTA: item.giayEntity?.moTa || null,
        GIABAN: item.giayEntity?.giaBan || null,
        SOLUONGTON: item.soLuongTon || 0,
        TRANG_THAI: item.trangThai || 0,

        // Lấy thông tin từ giayEntity
        THUONG_HIEU: item.giayEntity?.thuongHieu?.ten || null,
        DANH_MUC: item.giayEntity?.danhMuc?.ten || null,
        CHAT_LIEU: item.giayEntity?.chatLieu?.ten || null,
        DE_GIAY: item.giayEntity?.deGiay?.ten || null,
        XUAT_XU: item.giayEntity?.xuatXu?.ten || null,
        KIEU_DANG: item.giayEntity?.kieuDang?.ten || null,

        // Màu sắc & kích cỡ lấy từ entity của chính sản phẩm
        MAU_SAC: item.mauSacEntity?.ten || null,
        KICH_CO: item.kichCoEntity?.ten || null,
        ANH_GIAY:
          item.danhSachAnh && item.danhSachAnh.length > 0
            ? item.danhSachAnh[0].tenUrl
            : null,
      }));

      setGiayChiTietAll(dataGiayChitiet);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchSanPhamChiTiet = async (data) => {
    try {
      // Hỗ trợ cả số và UUID (chuỗi)
      const id = typeof data === "object" ? data.ID || data.id : data;

      if (!id || (typeof id !== "number" && typeof id !== "string")) {
        console.error("Lỗi: ID không hợp lệ!", id);
        return [];
      }

      // Gọi API với ID hợp lệ
      const response = await getGiayChitietDetail1(id);
      console.log(response);

      if (!Array.isArray(response.data)) {
        console.error("Dữ liệu trả về không phải mảng!", response.data);
        return [];
      }

      const danhSachChiTiet = response.data.map((item) => ({
        id: item.id,
        ten: item.giayEntity?.ten || "N/A",
        anh: item.danhSachAnh.length > 0 ? item.danhSachAnh[0] : null,
        giaBan: item.giaBan || 0,
        thuongHieu: item.giayEntity?.thuongHieu?.ten || null,
        mauSac: item.mauSacEntity?.ten || "Không có",
        kichCo: item.kichCoEntity?.ten || "Không có",
        soLuongTon: item.soLuongTon || 0,
        anh:
          item.danhSachAnh && item.danhSachAnh.length > 0
            ? item.danhSachAnh[0].tenUrl
            : null,
      }));
      // console.log(danhSachChiTiet);

      // Cập nhật state
      setGiayChiTiet(danhSachChiTiet);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm chi tiết:", error);
      return [];
    }
  };

  useEffect(() => {
    loadDotGiamGia();
    getAllGiay();
    getGiayChiTietAll();
  }, []);

  const handleAddSubmit = async () => {
    const parsedPhanTramGiam = parseFloat(phanTramGiam);

    if (isNaN(parsedPhanTramGiam)) {
      message.error("Phần trăm giảm phải là một số!");
      return;
    }
    if (parsedPhanTramGiam <= 0) {
      message.error("Phần trăm giảm phải lớn hơn 0!");
      return;
    }
    if (parsedPhanTramGiam >= 100) {
      message.error("Phần trăm giảm không được vượt quá 100%!");
      return;
    }

    const newTrangThai = getTrangThaiFromDates(
      new Date(ngayBatDau),
      new Date(ngayKetThuc)
    );

    const newDotGiamGia = {
      ma: ma,
      ten: ten,
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      phanTramGiam: parsedPhanTramGiam,
      trangThai: newTrangThai,
      idGiayChiTiet: selectedProducts.map((product) => product.ID),
    };

    console.log("Đợt giảm giá mới:", newDotGiamGia);

    try {
      await taoGiamGia(newDotGiamGia);
      message.success("Thêm thành công!");
      loadDotGiamGia();
      setMa("");
      setTen("");
      setPhamTramGiam("");
      setNgayBatDau("");
      setNgayKetThuc("");
      setSelectedProducts(null);
    } catch (error) {
      message.error(
        "Lỗi khi thêm!" + (error.response?.data?.message || error.message)
      );
      console.error("Lỗi khi thêm:", error);
    }
    setGiayChiTiet("");
    setStockMin("");
    setStockMax("");
    setFilteredByBrand("");
    setFilteredByColor("");
    setSelectedColor("");
    setSelectedBrand("");
    setIsAddModalVisible(false);
  };

  const handleUpdateSubmit = async () => {
    // if (!ma || !ten || !dieuKien) {
    //   message.error("Mã, Tên và Điều kiện không được để trống");
    //   return;
    // }

    const updatedTrangThai = getTrangThaiFromDates(
      new Date(ngayBatDau),
      new Date(ngayKetThuc)
    );

    const updatedDotGiamGia = {
      ma: ma,
      ten: ten,

      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      phanTramGiam: parseFloat(phanTramGiam),

      trangThai: updatedTrangThai,
    };

    try {
      await updatePhieuGiamGia(editingDotGiamGia.ID, updatedDotGiamGia);
      message.success("Cập nhật thành công");
      loadDotGiamGia();
      setIsModalVisible(false);
      setEditingDotGiamGia(null);
      setMa("");
      setTen("");
      setPhamTramGiam("");
      setNgayBatDau("");
      setNgayKetThuc("");
    } catch (error) {
      message.error("Lỗi khi cập nhật đợt giảm giá");
      console.error("Lỗi khi cập nhật đợt giảm giá", error);
    }
  };

  const handleDelete = async (record) => {
    try {
      await deletePhieuGiamGia(record.ID);
      message.success("Xóa đợt giảm giá thành công ");
      loadDotGiamGia();
    } catch (error) {
      message.error("Lỗi khi xóa đợt giảm giá");
    }
  };

  const getTrangThaiFromDates = (ngayBatDau, ngayKetThuc) => {
    const today = new Date();
    if (today >= ngayBatDau && today <= ngayKetThuc) {
      return 0; // Hoạt động
    } else if (today < ngayBatDau) {
      return 2; // Đang chờ
    } else {
      return 1; // Hết
    }
  };
  const handleDetail = async (record) => {
    try {
      const response = await detailPhieuGiamGia(record.id); // 👈 Chỉ truyền UUID
      const data = response.data;
      console.log("✅ Chi tiết phiếu giảm giá:", data);
  
      // set lại state nếu bạn cần
      // setPhieuGiamGiaDetail(data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết phiếu giảm giá:", error.response?.data || error.message);
    }
  };
  
  const columns = [
    { title: "Tên", dataIndex: "TEN", key: "TEN" },
    { title: "Mã", dataIndex: "MA", key: "MA" },
    { title: "Ngày Bắt Đầu", dataIndex: "NGAY_BAT_DAU", key: "NGAY_BAT_DAU" },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "NGAY_KET_THUC",
      key: "NGAY_KET_THUC",
    },
    {
      title: "Phần Trăm Giảm",
      dataIndex: "PHAN_TRAM_GIAM",
      key: "PHAN_TRAM_GIAM",
    },

    {
      title: "Trạng Thái",
      dataIndex: "TRANG_THAI",
      key: "TRANG_THAI",
      render: (text) => {
        if (text === 0) {
          return "Hoạt động";
        } else if (text === 1) {
          return "Không hoạt động";
        } else {
          return "Đang chờ"; // Có thể bạn muốn thêm trường hợp khác cho các giá trị không phải 0 hoặc 1
        }
      },
    },

    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleDetail(record)}>Chi tiết</Button>

          <Button onClick={() => handleUpdate(record)}>Cập nhật</Button>
          <Button onClick={() => handleDelete(record)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  const handleUpdate = (record) => {
    setEditingDotGiamGia(record);
    setMa(record.MA);
    setTen(record.TEN);
    setPhamTramGiam(record.PHAN_TRAM_GIAM);
    setNgayBatDau(record.NGAY_BAT_DAU);
    setNgayKetThuc(record.NGAY_KET_THUC);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setMa("");
    setTen("");
    setDieuKien("");
    setSoTienGiamMax("");
    setSoLuong("");
    setPhamTramGiam("");
    setNgayBatDau("");
    setNgayKetThuc("");
    setIsAddModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingDotGiamGia(null);
  };

  const handleAddModalCancel = () => {
    setGiayChiTiet("");
    setStockMin("");
    setStockMax("");
    setFilteredByBrand("");
    setFilteredByColor("");
    setSelectedColor("");
    setSelectedBrand("");
    setIsAddModalVisible(false);
  };

  const danhSachMauSac = [
    ...new Set(giayChiTietAll.map((item) => item.MAU_SAC)),
  ];
  const danhSachThuongHieu = [
    ...new Set(giayChiTietAll.map((item) => item.THUONG_HIEU)), // Lấy các thương hiệu không trùng lặp
  ];
  const danhSachKichCo = [
    ...new Set(giayChiTietAll.map((item) => item.KICH_CO)),
  ];
  const soLuongTon = [
    ...new Set(giayChiTietAll.map((item) => item.SOLUONGTON)), // Lấy các thương hiệu không trùng lặp
  ];

  // const filteredGiay = giay.filter((item) => {
  //   const searchStr = searchTerm.toLowerCase();
  //   const matchSearch = ["TEN", "GIABAN", "SOLUONG", "KICH_CO", "MAU_SAC"].some(
  //     (key) =>
  //       item[key]
  //         ? item[key].toString().toLowerCase().includes(searchStr)
  //         : false
  //   );

  //   const matchSize = selectedSize ? item.KICH_CO === selectedSize : true;
  //   const matchColor = selectedColor ? item.MAU_SAC === selectedColor : true;

  //   return matchSearch && matchSize && matchColor;
  // });
  // const handleStockRangeFilter = () => {
  //   const filtered = giayChiTietAll.filter(
  //     (item) => item.SOLUONGTON >= stockMin && item.SOLUONGTON <= stockMax
  //   );

  //   const giayChiTiet = filtered.map((item) => ({
  //     ID: item.ID,
  //     ten: item.TEN,
  //     mauSac: item.MAU_SAC,
  //     kichCo: item.KICH_CO,
  //     thuongHieu: item.THUONG_HIEU,
  //     soLuongTon: item.SOLUONGTON,
  //     giaBan: item.GIABAN,
  //     anh: item.ANH_GIAY,
  //   }));

  //   console.log("Giày lọc theo khoảng số lượng: ", giayChiTiet);

  //   setGiayChiTiet(giayChiTiet);
  //   setFilteredByBrand(filtered);
  // };

  const handleBrandChange = (e) => {
    const brand = e.target.value; // Lấy thương hiệu đã chọn
    setSelectedBrand(brand); // Lưu thương hiệu đã chọn vào state

    // Lọc giày theo thương hiệu đã chọn
    const filtered = giayChiTietAll.filter(
      (item) => (brand ? item.THUONG_HIEU === brand : true) // Nếu có thương hiệu chọn, lọc theo thương hiệu, nếu không thì hiển thị tất cả
    );

    // Sau khi lọc, bạn có thể lấy các thông tin chi tiết từ giày lọc được
    const giayChiTiet = filtered.map((item) => ({
      ID: item.ID,
      ten: item.TEN,
      mauSac: item.MAU_SAC,
      kichCo: item.KICH_CO,
      thuongHieu: item.THUONG_HIEU,
      soLuongTon: item.SOLUONGTON,
      giaBan: item.GIABAN,
      anh: item.ANH_GIAY,
      // Thêm các trường thông tin khác nếu cần
    }));

    // console.log("Giày theo thương hiệu lọc được: ", giayChiTiet);

    // Lưu vào state để hiển thị
    setGiayChiTiet(giayChiTiet); // Cập nhật giày chi tiết đã lọc vào state
    setFilteredByBrand(filtered); // Lưu vào state các giày lọc theo thương hiệu
    setSelectedRowKey(null);
    setSelectedProducts([]);
  };
  const handleColorChange = (e) => {
    const color = e.target.value; // Lấy màu sắc đã chọn
    setSelectedColor(color); // Lưu màu sắc đã chọn vào state

    // Lọc giày theo màu sắc đã chọn
    const filtered = giayChiTietAll.filter(
      (item) => (color ? item.MAU_SAC === color : true) // Nếu có màu sắc chọn, lọc theo màu sắc, nếu không thì hiển thị tất cả
    );

    // console.log(filtered);

    const giayChiTiet = filtered.map((item) => ({
      ID: item.ID,
      ten: item.TEN,
      mauSac: item.MAU_SAC,
      kichCo: item.KICH_CO,
      thuongHieu: item.THUONG_HIEU,
      soLuongTon: item.SOLUONGTON,
      giaBan: item.GIABAN,
      anh: item.ANH_GIAY,

      // Thêm các trường thông tin khác nếu cần
    }));

    // console.log("Giày theo màu sắc lọc được: ", giayChiTiet);

    // Lưu vào state để hiển thị
    setGiayChiTiet(giayChiTiet); // Cập nhật giày chi tiết đã lọc vào state
    setFilteredByColor(filtered);
    setSelectedRowKey(null);
    setSelectedProducts([]);
  };
  useEffect(() => {
    // Lọc giày theo khoảng số lượng tồn
    const filtered = giayChiTietAll.filter(
      (item) => item.SOLUONGTON >= stockMin && item.SOLUONGTON <= stockMax
    );

    const giayChiTiet = filtered.map((item) => ({
      ID: item.ID,
      ten: item.TEN,
      mauSac: item.MAU_SAC,
      kichCo: item.KICH_CO,
      thuongHieu: item.THUONG_HIEU,
      soLuongTon: item.SOLUONGTON,
      giaBan: item.GIABAN,
      anh: item.ANH_GIAY,
    }));

    // console.log("Giày lọc theo khoảng số lượng: ", giayChiTiet);

    setGiayChiTiet(giayChiTiet);
    setFilteredByBrand(filtered);
  }, [stockMin, stockMax, giayChiTietAll]); // Lọc lại khi stockMin, stockMax thay đổi
  const rowSelection = {
    type: "radio",
    selectedRowKeys: selectedRowKey !== null ? [selectedRowKey] : [],
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKey(selectedRowKeys[0]);
      setSelectedProducts(selectedRows);
    },
  };
  return (
    <div className="dot-giam-gia">
      <h1>Quản lý giảm giá sản phẩm</h1>
      <Button onClick={handleAdd}>Thêm Phiếu Giảm Giá</Button>

      {/* bộ lọc */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 5,
          marginLeft: 200,
        }}
      >
        <h3>
          <FilterOutlined /> Bộ lọc
        </h3>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <label>Tên:</label>
            <Input
              placeholder="Tìm kiếm"
              value={filters.ten}
              onChange={(e) => handleChange("ten", e.target.value)}
            />
          </Col>
          <Col span={8}>
            <label>Phần trăm giảm:</label>
            <Input
              placeholder="Nhập phần trăm giảm"
              value={filters.phanTramGiam}
              onChange={(e) => handleChange("phanTramGiam", e.target.value)}
            />
          </Col>
          <Col span={8}>
            <label>Từ ngày:</label>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Tìm kiếm"
              value={filters.tuNgay}
              onChange={(date) => handleChange("tuNgay", date)}
            />
          </Col>
          <Col span={8}>
            <label>Đến ngày:</label>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Tìm kiếm"
              value={filters.denNgay}
              onChange={(date) => handleChange("denNgay", date)}
            />
          </Col>
          <Col span={8}>
            <label>Trạng thái:</label>
            <Select
              style={{ width: "100%" }}
              value={filters.trangThai}
              onChange={(value) => handleChange("trangThai", value)}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value={0}>Hoạt động</Select.Option>
              <Select.Option value={1}>Không hoạt động</Select.Option>
              <Select.Option value={2}>Đang chờ</Select.Option>
            </Select>
          </Col>
        </Row>
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Button onClick={handleReset} style={{ marginRight: 10 }}>
            Làm mới
          </Button>
          <Button type="primary" onClick={handleApply}>
            Áp dụng
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dotGiamGia}
        pagination={{ pageSize: 5 }}
        style={{ marginLeft: "200px" }}
      />

      {/* Modal Thêm Phiếu Giảm Giá  */}

      <Modal
        className="custom-modal"
        visible={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={handleAddModalCancel}
        footer={null}
        width={1000}
        style={{
          left: "-400px",
          height: "90vh",
          maxHeight: "90vh",
        }}
        modalRender={(modal) => (
          <div
            style={{
              width: "1220px",
              maxWidth: "2000px",
              backgroundColor: "black",
            }}
          >
            {modal}
          </div>
        )}
      >
        <div className="modal-content">
          {/* Form Thêm */}
          <div className="addPhieu">
            <h3>Thêm đợt giảm giá</h3>
            <Form layout="vertical">
              <Form.Item label="Mã Giảm Giá">
                <Input value={ma} onChange={(e) => setMa(e.target.value)} />
              </Form.Item>
              <Form.Item label="Tên khuyến mại">
                <Input value={ten} onChange={(e) => setTen(e.target.value)} />
              </Form.Item>
              <Form.Item label="Phần trăm giảm">
                <Input
                  value={phanTramGiam}
                  onChange={(e) => setPhamTramGiam(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Ngày bắt đầu">
                <Input
                  type="datetime-local"
                  value={ngayBatDau}
                  onChange={(e) => setNgayBatDau(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Ngày kết thúc">
                <Input
                  type="datetime-local"
                  value={ngayKetThuc}
                  onChange={(e) => setNgayKetThuc(e.target.value)}
                />
              </Form.Item>
              <Button type="primary" onClick={handleAddSubmit}>
                Thêm
              </Button>
            </Form>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="table-container">
            <div className="tableDanhsach">
              <h3>Sản phẩm</h3>
              <Table
                pagination={{ pageSize: 5 }}
                bordered={false}
                columns={[
                  {
                    title: "#",
                    dataIndex: "stt",
                    width: 30,
                    render: (text, record, index) => <span>{index + 1}</span>,
                  },
                  {
                    title: "Ảnh",
                    dataIndex: "ANH_GIAY",
                    width: 150,
                    render: (tenUrl) =>
                      tenUrl ? (
                        <img
                          src={tenUrl} // ✅ Dùng trực tiếp tenUrl
                          alt="Ảnh giày"
                          style={{
                            maxWidth: "100px",
                            height: "auto",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        "Không có ảnh"
                      ),
                  },
                  {
                    title: "Tên",
                    dataIndex: "TEN",
                    width: 150,
                    render: (text, record) => (
                      <span
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => fetchSanPhamChiTiet(record)}
                      >
                        {text}
                      </span>
                    ),
                  },

                  {
                    title: "Trạng thái",
                    dataIndex: "TRANG_THAI",
                    width: 150,
                    render: (value) =>
                      value === 0 ? "Hoạt động" : "Không hoạt động",
                  },
                ]}
                dataSource={giay} // Cập nhật bảng với danh sách lọc
              />
            </div>

            <div className="tableDanhsachchitiet">
              <h3>Danh sách sản phẩm chi tiết</h3>
              <div style={{ display: "flex" }}>
                {/* Ô tìm kiếm */}
                {/* <div
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
                </div> */}

                {/* Bộ lọc thương hiệu*/}
                <select
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  style={{
                    margin: "10px",
                    padding: "5px",
                    borderRadius: "15px",
                  }}
                >
                  <option value="">Tất cả thương hiệu</option>
                  {danhSachThuongHieu.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>

                {/* Bộ lọc màu sắc */}
                <select
                  value={selectedColor}
                  onChange={handleColorChange}
                  style={{
                    margin: "10px",
                    padding: "5px",
                    borderRadius: "15px",
                  }}
                >
                  <option value="">Tất cả màu sắc</option>
                  {danhSachMauSac.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                {/* Bộ lọc số lượng */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label>Từ:</label>
                  <input
                    type="number"
                    style={{
                      margin: "10px",
                      padding: "5px",
                      borderRadius: "15px",
                    }}
                    value={stockMin}
                    onChange={(e) => setStockMin(Number(e.target.value))}
                  />
                  <label>Đến:</label>
                  <input
                    type="number"
                    value={stockMax}
                    style={{
                      margin: "10px",
                      padding: "5px",
                      borderRadius: "15px",
                    }}
                    onChange={(e) => setStockMax(Number(e.target.value))}
                  />
                </div>
              </div>

              <Table
                rowSelection={{
                  type: "checkbox",
                  selectedRowKey: selectedRowKey, // bạn cần khai báo state cho nó
                  onChange: (selectedRowKey, selectedRows) => {
                    setSelectedRowKey(selectedRowKey);
                    setSelectedProducts(selectedRows);
                  },
                }}
                pagination={{ pageSize: 5 }}
                bordered={false}
                columns={[
                  {
                    title: "#",
                    dataIndex: "stt",
                    width: 30,
                    render: (text, record, index) => <span>{index + 1}</span>,
                  },
                  {
                    title: "Ảnh",
                    dataIndex: "anh",
                    width: 150,
                    render: (url) =>
                      url ? (
                        <img
                          src={url}
                          alt="Ảnh giày"
                          style={{
                            maxWidth: "100px",
                            height: "auto",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        "Không có ảnh"
                      ),
                  },
                  { title: "Tên", dataIndex: "ten", width: 150 },
                  {
                    title: "Giá bán",
                    dataIndex: "giaBan",
                    width: 120,
                    render: (gia) => gia?.toLocaleString() + " VNĐ",
                  },
                  {
                    title: "Thương Hiệu",
                    dataIndex: "thuongHieu",
                    width: 120,
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "soLuongTon",
                    width: 120,
                  },
                  { title: "Màu sắc", dataIndex: "mauSac", width: 120 },
                  { title: "Kích cỡ", dataIndex: "kichCo", width: 100 },
                ]}
                dataSource={giayChiTiet}
                rowKey={(record) => `${record.id}-${record.kichCo}-${record.mauSac}-${record.ten}`}

              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Cập Nhật Phiếu Giảm Giá */}
      <Modal
        title="Cập nhật phiếu giảm giá"
        visible={isModalVisible}
        onOk={handleUpdateSubmit}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical">
          {/* <Form.Item label="Mã">
            <Input value={ma} onChange={(e) => setMa(e.target.value)} />
          </Form.Item> */}
          <Form.Item label="Tên">
            <Input value={ten} onChange={(e) => setTen(e.target.value)} />
          </Form.Item>
          <Form.Item label="Ngày Bắt Đầu">
            <Input
              type="date"
              value={ngayBatDau}
              onChange={(e) => setNgayBatDau(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Ngày Kết Thúc">
            <Input
              type="date"
              value={ngayKetThuc}
              onChange={(e) => setNgayKetThuc(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Phần Trăm Giảm">
            <Input
              value={phanTramGiam}
              onChange={(e) => setPhamTramGiam(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DotGiamGia;
