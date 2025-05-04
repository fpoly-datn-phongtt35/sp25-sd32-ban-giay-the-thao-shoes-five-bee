import React, { useEffect, useState, useRef } from "react";
import {
  addGiay,
  deleteGiay,
  getGiay,
  getGiayDetail,
  updateGiay,
  assignAnhGiay,
  addBienThe,
} from "../service/GiayService";
import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  message,
  Switch,
  Row,
  Col,
  Checkbox,
  InputNumber,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  AddOutlined,
} from "@ant-design/icons";
import "./Sanpham.css";
import { validate as isUuid } from "uuid";
import { getThuongHieu } from "../service/ThuongHieuService";
import { getChatLieu } from "../service/ChatLieuService";
import { getDeGiay } from "../service/DeGiayService";
import { getKieuDang } from "../service/KieuDangService";
import { getDanhMuc } from "../service/DanhMucService";
import ConfirmModal from "../popupThemNhanhThuocTInh/ConfirmModal";
import { getXuatXu } from "../service/XuatXuService";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { getSizes } from "../service/KichCoService";
import { getAnhGiay } from "../service/AnhGiayService";
import {
  getGiayChitietDetail1,
  addGiayChiTiet,
  getDataGiayChiTiet,
  removeGiayChiTiet,
  detailGiayChiTiet2,
  updateGiayChiTiet,
} from "../service/GiayChiTietService";
import { getMauSac } from "../service/MauSacService";
import PopupThemNhanhMauSac from "../popupThemNhanhThuocTInh/PopupThemNhanhMauSac";
import PopupThemNhanhKichCo from "../popupThemNhanhThuocTInh/PopupThemNhanhKichCo";
import PopupThemaAnh from "../popupThemNhanhThuocTInh/PopupThemaAnh";

const SanPham = () => {
  const [giay, setGiay] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [value, setValue] = useState(2);
  const [ten, setTen] = useState("");
  const [moTa, setMoTa] = useState("");
  const [giaNhap, setGiaNhap] = useState("");
  const [giaBan, setGiaBan] = useState("");
  const [soLuongTon, setSoLuongTon] = useState("");
  const [giaSauKhuyenMai, setGiaSauKhuyenMai] = useState("");
  const [doHot, setDoHot] = useState("");
  const [thuongHieuList, setThuongHieuList] = useState([]);
  const [chatLieuList, setChatLieuList] = useState([]);
  const [deGiayList, setDeGiayList] = useState([]);
  const [xuatXuList, setXuatXuList] = useState([]);
  const [kieuDangList, setKieuDangList] = useState([]);
  const [danhMucList, setDanhMucList] = useState([]);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]); // Mảng chứa màu sắc được chọn
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [anhGiayList, setAnhGiayList] = useState([]);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState();
  const [selectedChatLieu, setSelectedChatLieu] = useState();
  const [selectedDanhMuc, setSelectedDanhMuc] = useState();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedDeGiay, setSelectedDeGiay] = useState();
  const [selectedXuatXu, setSelectedXuatXu] = useState();
  const [selectedKieuDang, setSelectedKieuDang] = useState();
  const [selectedMauSac, setSelectedMauSac] = useState();
  const [selectdKichCo, setSelectedKichCo] = useState();
  const [selectedAnhGiay, setSelectedAnhGiay] = useState();
  const [editingGiay, setEditingGiay] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mauSacList, setMauSacList] = useState([]);
  const [kichCoList, setKichCoList] = useState([]);
  const [anhGiay, setAnhGiay] = useState([]);
  const [isChiTietModalVisible, setIsChiTietModalVisible] = useState(false);
  const [editingGiayChiTiet, setEditingGiayChiTiet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedKichCo1, setSelectedKichCo1] = useState([]);
  const [selectedMauSac1, setSelectedMauSac1] = useState([]);
  const [selectedAnhGiay1, setSelectedAnhGiay1] = useState(null);
  const [updatedDataChiTiet, setUpdatedDataChỉTiet] = useState({});
  const [danhSachChiTiet, setDanhSachChiTiet] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCapNhatAnhBienThe, setSelectedCapNhatAnhBienThe] =
    useState("");
  const [selectedGiayIds, setSelectedGiayIds] = useState([]);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [soLuongTon1, setSoLuongTon1] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [giaBan1, setGiaBan1] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGiay1, setSelectedGiay1] = useState(null);
  const [tempSelectedKichCo, setTempSelectedKichCo] = useState([]);
  const [tempSelectedMauSac, setTempSelectedMauSac] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [IsModalVisibleUpdateGiayChiTiet, setIsModalVisibleUpdateGiayChiTiet] =
    useState(null);

  useEffect(() => {
    getMauSacList();
    getKichCoList();
    getAnhList();
  }, []);
  const handleOpenPopup = () => {
    setTempSelectedKichCo([...selectedKichCo1]);
    setTempSelectedMauSac([...selectedMauSac1]);
    setIsPopupOpen(true);
  };

  // Chọn / bỏ chọn kích cỡ trong popup
  const handleSelectKichCo = (kcId) => {
    setTempSelectedKichCo((prev) =>
      prev.includes(kcId) ? prev.filter((id) => id !== kcId) : [...prev, kcId]
    );
  };

  // Chọn / bỏ chọn màu sắc trong popup
  const handleSelectMauSac = (msId) => {
    setTempSelectedMauSac((prev) =>
      prev.includes(msId) ? prev.filter((id) => id !== msId) : [...prev, msId]
    );
  };

  // Xác nhận lựa chọn
  const handleConfirmSelection = () => {
    setSelectedKichCo1(tempSelectedKichCo);
    setSelectedMauSac1(tempSelectedMauSac);
    setIsPopupOpen(false);
  };
  const CapNhatAnhBienThe = () => {
    console.log("Danh sách ID giày đã chọn:", selectedGiayIds);

    // Reset modal và danh sách đã chọn
    setIsThemNhanhAnh(false);
    // setSelectedGiayIds(null);
  };
  const huyCapNhatAnhBienThe = () => {
    setIsThemNhanhAnh(false);
    setSelectedGiayIds([]);
  };

  const getMauSacList = async () => {
    const result = await getMauSac();
    const activeMauSac =
      result.data.filter((item) => item.trangThai === 0) || [];
    setMauSacList(activeMauSac);
  };

  const getKichCoList = async () => {
    const result = await getSizes();
    const activeKichCo = result.data.filter((item) => item.trangThai === 0);
    setKichCoList(activeKichCo);
  };
  const getAnhList = async () => {
    const result = await getAnhGiay();
    const activeanhGiay = result.data.filter((item) => item.trangThai === 1);
    console.log("anh giay", activeanhGiay);

    setAnhGiay(activeanhGiay);
  };
  // logic cho bien the san pham
  const fetchSanPhamChiTiet = async (data, showPopup = true) => {
    try {
      const id = typeof data === "object" ? data.ID || data.id : data; // Xử lý ID từ object hoặc số
      if (!id) {
        console.error("Lỗi: ID không hợp lệ!", data);
        return null;
      }
      setSelectedGiay1(id);

      const response = await getGiayChitietDetail1(id);

      if (!Array.isArray(response.data)) {
        console.error("Dữ liệu trả về không phải mảng!", response.data);
        return [];
      }

      const danhSachChiTiet = response.data.map((item) => ({
        id: item.id,
        ten: item.giayEntity?.ten || "N/A",
        danhSachAnh:
          item.danhSachAnh.length > 0 ? item.danhSachAnh[0].tenUrl : null,
        giaBan: item.giaBan || 0,
        mauSac: item.mauSacEntity?.ten || "Không có",
        kichCo: item.kichCoEntity?.ten || "Không có",
        soLuongTon: item.soLuongTon || 0,
      }));
      console.log("Danh sách chi tiết:", danhSachChiTiet);

      setDanhSachChiTiet(danhSachChiTiet);

      // Chỉ mở popup nếu showPopup = true
      if (showPopup) {
        setIsChiTietModalVisible(true);
      }

      return danhSachChiTiet;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm chi tiết:", error);
      return [];
    }
  };

  // const handleEditGiayChiTiet = async (record) => {
  //   try {
  //     const response = await detailGiayChiTiet2(record.id);

  //     const giayChiTiet = response.data;
  //     console.log("🔍 Chi tiết giày:", giayChiTiet);

  //     setEditingGiayChiTiet(giayChiTiet);
  //     setGiaBan1(giayChiTiet.giaBan);
  //     setSoLuongTon1(giayChiTiet.soLuongTon); // Cập nhật số lượng tồn cho sản phẩm 1
  //     setValue(giayChiTiet.trangThai === 0 ? 1 : 2);
  //     setSelectedMauSac1(
  //       giayChiTiet.mauSacEntity ? giayChiTiet.mauSacEntity.id : null
  //     );
  //     setSelectedKichCo1(
  //       giayChiTiet.kichCoEntity ? giayChiTiet.kichCoEntity.id : null
  //     );
  //     setSelectedGiay1(
  //       giayChiTiet.giayEntity ? giayChiTiet.giayEntity.id : null,
  //       giayChiTiet.giayEntity ? giayChiTiet.giayEntity.ten : null
  //     );
  //     setIsModalVisibleUpdateGiayChiTiet(true);
  //   } catch (error) {
  //     message.error("Lỗi khi detail giày chi tiết");
  //   }
  // };

  const handleDelete = async (record) => {
    try {
      await removeGiayChiTiet(record.id);
      message.success("Xóa sản phẩm chi tiết thành công!");

      setDanhSachChiTiet((prevList) =>
        prevList.filter((item) => item.id !== record.id)
      );
    } catch (error) {
      console.error("❌ Lỗi khi xóa giày chi tiết:", error);
      message.error("Xóa sản phẩm chi tiết thất bại!");
    }
  };

  const handleAdd = async () => {
    const newTrangThai1 = value === 1 ? 0 : 1;

    try {
      // 🏀 Kiểm tra dữ liệu đầu vào trước khi gửi
      // if (
      //   !soLuongTon1 ||
      //   !giaBan1 ||
      //   !selectedGiay1 ||
      //   selectedMauSac1.length === 0 ||
      //   selectedKichCo1.length === 0
      // ) {
      //   message.error("Vui lòng nhập đầy đủ thông tin trước khi thêm!");
      //   return;
      // }

      const newProduct = {
        soLuongTon: parseInt(soLuongTon1), // Ép kiểu số nguyên
        giaBan: parseFloat(giaBan1), // Ép kiểu số
        giayId: selectedGiay1, // Chuyển thành ID trực tiếp
        mauSacIds: selectedMauSac1, // Danh sách UUID
        kichCoIds: selectedKichCo1, // Danh sách UUID
        danhSachAnh: selectedAnhGiay1
          ? selectedAnhGiay1.map((id) => ({ id }))
          : [],
        trangThai: newTrangThai1,
      };

      // console.log(
      //   "📤 Dữ liệu gửi lên BE:",
      //   JSON.stringify(newProduct, null, 2)
      // );

      // 🏀 Gửi request thêm mới sản phẩm chi tiết
      const response = await addBienThe(newProduct);

      console.log("📥 Phản hồi từ BE:", response);
      fetchSanPhamChiTiet({ ID: selectedGiay1 });

      message.success("Thêm sản phẩm chi tiết mới thành công!");

      // Reset form
      setTen("");
      setSoLuongTon1("");
      setGiaBan1("");
      setSelectedMauSac1([]);
      setSelectedKichCo1([]);
      setSelectedGiay1(null);
      setValue(2);
    } catch (error) {
      console.error("❌ Lỗi khi thêm giày chi tiết:", error);
      message.error(
        "Lỗi khi thực hiện thao tác: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUpdateGiayChiTiet = async (record) => {
    const updatedRecord = {
      ...record,
      ...editedData[record.id],
    };

    console.log("updatedRecord:", updatedRecord);

    const anhGiayDtos = Array.isArray(selectedGiayIds)
      ? selectedGiayIds.map((item) => ({
          id: item.id,
          tenUrl: item.tenUrl,
        }))
      : [];
    console.log("anhGiayDtos", anhGiayDtos);

    const updatedGiayChiTiet = {
      id: updatedRecord.id,
      soLuongTon: Number(updatedRecord.soLuongTon) || 0,
      giaBan: parseFloat(updatedRecord.giaBan) || 0,
      trangThai: updatedRecord.trangThai === 0 ? 1 : 0,
      anhGiayDtos:
        anhGiayDtos.length > 0 ? anhGiayDtos : updatedRecord.anhGiayDtos || [], // Kiểm tra danhSachAnh
    };

    console.log("📌 Dữ liệu cập nhật gửi lên API:", updatedGiayChiTiet);

    try {
      await updateGiayChiTiet(updatedGiayChiTiet);
      message.success("✅ Cập nhật sản phẩm chi tiết thành công!");

      getAllGiay();

      setEditedData((prev) => {
        const newData = { ...prev };
        delete newData[record.id];
        return newData;
      });
      setSelectedGiayIds([]);
      fetchSanPhamChiTiet({ ID: selectedGiay1 }, false);
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error.response?.data || error.message);
      message.error("❌ Lỗi cập nhật sản phẩm chi tiết!");
    }
  };

  const handleAddImage = (record) => {
    setSelectedRecord(record);
    setIsThemNhanhAnh(true);
  };
  const handleInputChange = (e, record, field) => {
    const { value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [record.id]: {
        // Mỗi sản phẩm được lưu theo ID
        ...prev[record.id],
        [field]: value, // Cập nhật trường được chỉnh sửa
      },
    }));
  };

  // Hàm hiển thị popup
  const columnsGiayChiTiet = [
    {
      title: "Tên",
      dataIndex: "ten",
      key: "ten",
      render: (text, record) => (
        <div>
          <span>{text}</span>
          <div style={{ fontSize: "12px", color: "#888", marginTop: 4 }}>
            {record.mauSac} - Kích cỡ: {record.kichCo}
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "giaBan",
      key: "giaBan",
      render: (text, record) => (
        <Input
          value={Number(text)?.toLocaleString("vi-VN")} // Format hiển thị
          onChange={(e) => {
            // Gỡ định dạng (loại bỏ dấu chấm hoặc phẩy), chuyển về số nguyên
            const rawValue = e.target.value.replace(/\D/g, ""); // Chỉ giữ số
            handleInputChange(
              { target: { value: rawValue } },
              record,
              "giaBan"
            );
          }}
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "soLuongTon",
      key: "soLuongTon",
      render: (text, record) => (
        <Input
          defaultValue={text}
          onChange={(e) => handleInputChange(e, record, "soLuongTon")}
        />
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "danhSachAnh",
      key: "danhSachAnh",
      render: (text, record) => {
        const tenUrl = record.danhSachAnh;
        return tenUrl ? (
          <img
            src={tenUrl}
            alt="Ảnh sản phẩm"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => handleAddImage(record)}
          />
        );
      },
    },

    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            danger
            onClick={() => handleDelete(record)}
            icon={<DeleteOutlined />}
          />
          <Button
            type="primary"
            onClick={() => handleUpdateGiayChiTiet(record)}
            icon={<EditOutlined />}
          />
        </div>
      ),
    },
  ];

  // const showSanPhamChiTietPopup = () => {
  //   if (!danhSachChiTiet.length) {
  //     Modal.warning({
  //       title: "Thông báo",
  //       content: "Không có dữ liệu chi tiết!",
  //     });
  //     return;
  //   }

  // };

  // logic cho bien the san pham
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const trangThai = (status) => {
    return status === 0 ? "Hoạt động" : "Không hoạt động";
  };

  useEffect(() => {
    getAllGiay();
    getThuongHieuList();
    getChatLieuList();
    getDeGiayList();
    getKieuDangList();
    getXuatXuList();
    getAnhGiayList();
    getDanhMucList();
  }, []);

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

  //viết hàm get để map lên select
  const getThuongHieuList = async () => {
    const result = await getThuongHieu();
    setThuongHieuList(result.data.filter((item) => item.trangThai === 0));
  };

  const getChatLieuList = async () => {
    const result = await getChatLieu();
    setChatLieuList(result.data.filter((item) => item.trangThai === 0));
  };

  const getDeGiayList = async () => {
    const result = await getDeGiay();
    setDeGiayList(result.data.filter((item) => item.trangThai === 0));
  };

  const getXuatXuList = async () => {
    const result = await getXuatXu();
    setXuatXuList(result.data.filter((item) => item.trangThai === 0));
  };

  const getKieuDangList = async () => {
    const result = await getKieuDang();
    setKieuDangList(result.data.filter((item) => item.trangThai === 0));
  };
  const getDanhMucList = async () => {
    const result = await getDanhMuc();
    setDanhMucList(result.data.filter((item) => item.trangThai === 0));
  };

  const getAnhGiayList = async () => {
    const result = await getAnhGiay();
    setAnhGiayList(result.data);
  };
  //viết handle để chạy vào state khi thay đổi trong select
  const handleThuongHieuChange = (value) => {
    console.log(value);
    setSelectedThuongHieu(value);
  };

  const handleChatLieuChange = (value) => {
    console.log(value);
    setSelectedChatLieu(value);
  };

  const handleDanhMucChange = (value) => {
    console.log(value);
    setSelectedDanhMuc(value);
  };
  const handleDeGiayChange = (value) => {
    console.log(value);
    setSelectedDeGiay(value);
  };

  const handleXuatXuChange = (value) => {
    console.log(value);
    setSelectedXuatXu(value);
  };

  const handleKieuDangChange = (value) => {
    console.log(value);
    setSelectedKieuDang(value);
  };

  const handleAnhGiayChange = (value) => {
    console.log(value);
    setSelectedAnhGiay(value);
  };

  const creatGiay = async () => {
    if (!ten || !giaBan) {
      message.error("Không được để trống!");
      return;
    }
    if (parseFloat(giaBan) <= 0) {
      message.error("Giá bán phải lớn hơn 0!");
      return;
    }

    const newTrangThai = value === 1 ? 1 : 0;

    const newDataGiay = {
      ten: ten,
      moTa: moTa,
      giaBan: parseFloat(giaBan),
      soLuongTon: parseFloat(soLuongTon),
      trangThai: newTrangThai,
      danhMucDto: selectedDanhMuc ? { id: selectedDanhMuc } : null,
      thuongHieuDto: selectedThuongHieu ? { id: selectedThuongHieu } : null,
      chatLieuDto: selectedChatLieu ? { id: selectedChatLieu } : null,
      deGiayDto: selectedDeGiay ? { id: selectedDeGiay } : null,
      xuatXuDto: selectedXuatXu ? { id: selectedXuatXu } : null,
      kieuDangDto: selectedKieuDang ? { id: selectedKieuDang } : null,
      mauSacDto: selectedMauSac ? { id: selectedMauSac } : null,
      kichCoDto: selectdKichCo ? { id: selectdKichCo } : null,
    };

    try {
      const giayResponse = await addGiay(newDataGiay);
      const giayMoi = giayResponse.data;
      const giayId = giayMoi.id;

      // Nếu có ảnh thì gán ảnh
      if (selectedAnhGiay && selectedAnhGiay.length > 0) {
        await assignAnhGiay(giayId, selectedAnhGiay);
        message.success("Đã gán ảnh vào sản phẩm!");
      }

      // ➕ Thêm sản phẩm mới lên đầu danh sách
      setGiay((prev) => [
        {
          ID: giayMoi.id,
          MA: giayMoi.ma || "",
          TEN: giayMoi.ten,
          MOTA: giayMoi.moTa,
          GIABAN: giayMoi.giaBan,
          SOLUONGTON: giayMoi.soLuongTon,
          TRANG_THAI: giayMoi.trangThai,
          THUONG_HIEU: giayMoi.thuongHieu?.ten || null,
          DANH_MUC: giayMoi.danhMuc?.ten || null,
          CHAT_LIEU: giayMoi.chatLieu?.ten || null,
          DE_GIAY: giayMoi.deGiay?.ten || null,
          XUAT_XU: giayMoi.xuatXu?.ten || null,
          KIEU_DANG: giayMoi.kieuDang?.ten || null,
          ANH_GIAY: giayMoi.anhGiayEntities?.[0]?.tenUrl || null,
          KICH_CO: giayMoi.kichCo?.ten || null,
        },
        ...giay,
      ]);

      message.success("Thêm sản phẩm thành công!");

      // Reset form
      setTen("");
      setMoTa("");
      setGiaBan("");
      setSoLuongTon("");
      setValue(null);
      setSelectedChatLieu(null);
      setSelectedThuongHieu(null);
      setSelectedDanhMuc(null);
      setSelectedDeGiay(null);
      setSelectedKieuDang(null);
      setSelectedXuatXu(null);
      setSelectedMauSac(null);
      setSelectedKichCo(null);
      setSelectedAnhGiay(null);

      setIsModalVisible1(false);
    } catch (error) {
      message.error(
        "Lỗi thêm sản phẩm: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const removeGiay = async (record) => {
    try {
      await deleteGiay(record.ID);
      message.success("Xóa sản phẩm thành công");
      getAllGiay();
    } catch (error) {
      message.error("Lỗi xóa sản phẩm " + error.message);
    }
  };

  const detailGiay = async (record) => {
    console.log("Chi tiết sản phẩm:", record);

    // Đóng popup danh sách sản phẩm chi tiết nếu đang mở
    setIsChiTietModalVisible(false);

    // Gọi fetch nhưng không mở popup danh sách sản phẩm
    const danhSachChiTiet = await fetchSanPhamChiTiet(record, false);

    // if (!danhSachChiTiet || danhSachChiTiet.length === 0) {
    //   message.error("Không có sản phẩm chi tiết nào!");
    //   return;
    // }

    const giayDto = {
      id: record.ID,
      ten: record.ten,
      moTa: record.moTa,
      giaBan: record.giaBan,
      soLuongTon: record.soLuongTon,
      trangThai: record.trangThai,
      danhMuc: record.danhMuc ? { id: record.danhMuc.id } : null,
      thuongHieu: record.thuongHieu ? { id: record.thuongHieu.id } : null,
      chatLieu: record.chatLieu ? { id: record.chatLieu.id } : null,
      deGiay: record.deGiay ? { id: record.deGiay.id } : null,
      kieuDang: record.kieuDang ? { id: record.kieuDang.id } : null,
      xuatXu: record.xuatXu ? { id: record.xuatXu.id } : null,
      mauSac: record.mauSac ? { id: record.mauSac.id } : null,
      kichCo: record.kichCo ? { id: record.kichCo.id } : null,
      anhGiay: record.anhGiayEntities
        ? record.anhGiayEntities.map((ag) => ({
            id: ag.id,
            tenUrl: ag.tenUrl,
          }))
        : [],
    };

    try {
      const response = await getGiayDetail(giayDto);
      const giay = response.data;

      setEditingGiay(giay);
      setTen(giay.ten);
      setMoTa(giay.moTa);
      setGiaBan(giay.giaBan);
      setSoLuongTon(giay.soLuongTon);
      setValue(giay.trangThai === 0 ? 2 : 1);
      setSelectedDanhMuc(giay.danhMuc ? giay.danhMuc.id : null);
      setSelectedThuongHieu(giay.thuongHieu ? giay.thuongHieu.id : null);
      setSelectedChatLieu(giay.chatLieu ? giay.chatLieu.id : null);
      setSelectedDeGiay(giay.deGiay ? giay.deGiay.id : null);
      setSelectedKieuDang(giay.kieuDang ? giay.kieuDang.id : null);
      setSelectedXuatXu(giay.xuatXu ? giay.xuatXu.id : null);
      setSelectedMauSac(giay.mauSac ? giay.mauSac.id : null);
      setSelectedKichCo(giay.kichCo ? giay.kichCo.id : null);
      setSelectedAnhGiay(giay.anhGiay ? giay.anhGiay.id : null);

      // Mở modal chi tiết giày
      setIsModalVisible(true);
    } catch (error) {
      message.error("Lỗi khi lấy chi tiết giày: " + error.message);
    }
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);

    // Reset dữ liệu sau khi popup đóng
    setEditingGiay(null);
    setTen("");
    setMoTa("");
    setGiaBan("");
    setSoLuongTon("");
    setValue(null);
    setSelectedChatLieu(null);
    setSelectedThuongHieu(null);
    setSelectedDanhMuc(null);
    setSelectedDeGiay(null);
    setSelectedKieuDang(null);
    setSelectedXuatXu(null);
    setSelectedMauSac(null);
    setSelectedKichCo(null);
    setSelectedAnhGiay(null);
  };

  const editGiayButton = async () => {
    // console.log("🔍 ID của sản phẩm cần cập nhật:", editingGiay.id);

    // if (!editingGiay.id) {
    //   message.error(" Lỗi: Không có ID sản phẩm cần cập nhật!");
    //   return;
    // }

    const newTrangThai = value === 1 ? 1 : 0;
    const newDataGiay = {
      id: isUuid(editingGiay.id) ? editingGiay.id : null,
      ten: ten,
      moTa: moTa,
      giaBan: parseFloat(giaBan),
      soLuongTon: parseFloat(soLuongTon),
      trangThai: newTrangThai,
      danhMucDto: selectedDanhMuc ? { id: selectedDanhMuc } : null,
      thuongHieuDto: selectedThuongHieu ? { id: selectedThuongHieu } : null,
      chatLieuDto: selectedChatLieu ? { id: selectedChatLieu } : null,
      deGiayDto: selectedDeGiay ? { id: selectedDeGiay } : null,
      xuatXuDto: selectedXuatXu ? { id: selectedXuatXu } : null,
      kieuDangDto: selectedKieuDang ? { id: selectedKieuDang } : null,

      // ...(selectedMauSac && { mauSacDto: { id: selectedMauSac } }),
      // ...(selectdKichCo && { kichCoDto: { id: selectdKichCo } }),

      anhGiayDtos: selectedAnhGiay ? selectedAnhGiay.map((id) => ({ id })) : [],
    };
    console.log("du lieu update", newDataGiay);

    try {
      await updateGiay(newDataGiay);
      message.success("Cập nhật sản phẩm thành công!");

      getAllGiay(); // Cập nhật danh sách sau khi sửa
      resetForm();
      setIsModalVisible(false);
    } catch (error) {
      console.error(
        "Lỗi cập nhật sản phẩm:",
        error.response?.data || error.message
      );
      message.error(
        "Lỗi cập nhật sản phẩm: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const resetForm = () => {
    setTen("");
    setMoTa("");
    setGiaBan("");
    setSoLuongTon("");
    setValue(null);
    setSelectedChatLieu(null);
    setSelectedThuongHieu(null);
    setSelectedDeGiay(null);
    setSelectedKieuDang(null);
    setSelectedXuatXu(null);
    setSelectedMauSac(null);
    setSelectedKichCo(null);
    setSelectedAnhGiay(null);
    setEditingGiay(null);
  };

  const handleChangeTrangThai = (record, checked) => {
    console.log(
      `Cập nhật trạng thái cho ID ${record.key}: ${checked ? "Bật" : "Tắt"}`
    );
    // Gửi request API hoặc cập nhật state tại đây
  };
  const filteredGiay = giay
    .filter((item) =>
      Object.values({
        ten: item.TEN.toLowerCase(),
        soLuong: item.SOLUONGTON?.toString() || "0",
        giaBan: item.GIABAN?.toString() || "0",
      }).some((value) => value.includes(searchTerm.toLowerCase()))
    )
    .filter((item) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "selling") return item.TRANG_THAI === 0;
      if (filterStatus === "stopped") return item.TRANG_THAI === 1;
      return true;
    })
    .filter((item) => {
      if (selectedBrand && item.THUONG_HIEU !== selectedBrand) return false;
      return true;
    })
    .filter((item) => {
      if (selectedCategory && item.DANH_MUC !== selectedCategory) return false;
      return true;
    })
    .filter((item) => {
      if (minPrice !== null && minPrice !== "" && item.GIABAN < minPrice)
        return false;
      if (maxPrice !== null && maxPrice !== "" && item.GIABAN > maxPrice)
        return false;
      return true;
    });

  const [isModalVisible1, setIsModalVisible1] = useState(false);

  const [isThemNhanhMausac, setIsThemNhanhMausac] = useState(false);
  const [isThemNhanhKichCo, setIsThemNhanhKichCo] = useState(false);
  const [isThemNhanhAnh, setIsThemNhanhAnh] = useState(false);

  const ThemNhanhMauSac = () => {
    setIsThemNhanhMausac(true);
  };
  const ThemNhanhKichCo = () => {
    setIsThemNhanhKichCo(true);
  };
  const ThemNhanhAnh = () => {
    setIsThemNhanhAnh(true);
  };
  return (
    <div
      className="sanpham-container"
      scroll={{ x: 5000 }}
      style={{ width: "100%" }}
    >
      <h1>Danh sách Sản Phẩm</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginLeft: "10px",
          float: "right",
        }}
      >
        <Button type="primary" onClick={() => setIsModalVisible1(true)}>
          Thêm Sản Phẩm
        </Button>
      </div>
      {/* Bộ lọc trạng thái */}
      <div
        style={{
          background: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <div style={{ width: 250, marginTop: 5 }}>
          <Input
            placeholder="Tìm kiếm sản phẩm "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 120, marginBottom: 20 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "nowrap",
            marginLeft: "30px",
          }}
        >
          {/* Bộ lọc thương hiệu */}
          <div style={{ display: "flex", gap: "8px" }}>
            <span
              style={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                marginTop: "5px",
              }}
            >
              Thương hiệu:
            </span>
            <Select
              placeholder="Chọn thương hiệu"
              value={selectedBrand}
              onChange={(value) => setSelectedBrand(value)}
              style={{ width: 180 }}
              dropdownStyle={{ width: 250 }}
            >
              <Select.Option value="">Tất cả</Select.Option>
              {thuongHieuList.map((brand) => (
                <Select.Option key={brand.id} value={brand.ten}>
                  {brand.ten}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Bộ lọc danh mục */}
          <div style={{ display: "flex", gap: "8px" }}>
            <span
              style={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                marginTop: "5px",
              }}
            >
              Danh mục:
            </span>
            <Select
              placeholder="Chọn danh mục"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              style={{ width: 180 }}
              dropdownStyle={{ width: 250 }}
            >
              <Select.Option value="">Tất cả</Select.Option>
              {danhMucList.map((category) => (
                <Select.Option key={category.id} value={category.ten}>
                  {category.ten}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Lọc theo khoảng giá */}
          <div style={{ display: "flex", gap: "8px", marginTop: "-10px" }}>
            <span
              style={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                marginTop: "5px",
              }}
            >
              Giá từ:
            </span>
            <InputNumber
              min={0}
              value={minPrice}
              onChange={setMinPrice}
              style={{ width: 100 }}
            />
            <span
              style={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                marginTop: "5px",
              }}
            >
              đến{" "}
            </span>
            <InputNumber
              min={0}
              value={maxPrice}
              onChange={setMaxPrice}
              style={{ width: 100 }}
            />
          </div>
        </div>
      </div>

      {/*chi tiet san pham  */}
      <Modal
        title="Chi Tiết Sản Phẩm"
        visible={isChiTietModalVisible}
        onCancel={() => setIsChiTietModalVisible(false)}
        footer={
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button type="primary" onClick={() => handleAdd()}>
              Add
            </Button>
            <Button
              type="default"
              onClick={() => setIsChiTietModalVisible(false)}
            >
              Cancel
            </Button>
          </div>
        }
        width="80%"
        centered
      >
        <div style={{ width: "100%" }}>
          <div style={{ gap: "30px", marginBottom: "15px" }}>
            {/* <Select
              mode="multiple"
              placeholder="Chọn Ảnh Giày"
              value={selectedAnhGiay1}
              onChange={setSelectedAnhGiay1}
              style={{ width: "100%", minHeight: "60px" }}
              tagRender={(props) => {
                const { value, closable, onClose } = props;
                const selectedImage = anhGiayList.find((ag) => ag.id === value);

                return selectedImage ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "5px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                    }}
                  >
                    <img
                      src={selectedImage.tenUrl}
                      alt="Ảnh giày"
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 5,
                      }}
                    />
                    {closable && (
                      <span
                        onClick={onClose}
                        style={{ cursor: "pointer", color: "red" }}
                      >
                        ✖
                      </span>
                    )}
                  </div>
                ) : null;
              }}
            >
              {Array.isArray(anhGiayList) &&
                anhGiayList.map((ag) => (
                  <Select.Option key={ag.id} value={ag.id}>
                    <img
                      src={ag.tenUrl}
                      alt="Ảnh giày"
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 5,
                      }}
                    />
                  </Select.Option>
                ))}
            </Select>

            <Input
              style={{ width: "100%" }}
              placeholder="Giá Bán ($)"
              value={giaBan1}
              onChange={(e) => setGiaBan1(e.target.value)}
            />
            <br />
            <br />
            <Input
              style={{ width: "100%" }}
              placeholder="Số Lượng Tồn"
              value={soLuongTon1}
              onChange={(e) => setSoLuongTon1(e.target.value)}
            /> */}
            <div className="shoe-picker-container">
              <h3 className="shoe-picker-title">Kích Cỡ và Màu Sắc</h3>

              {/* Hiển thị kích cỡ đã chọn */}
              <div className="shoe-picker-option-group">
                <span className="shoe-picker-label">Kích Cỡ:</span>
                {selectedKichCo1.map((kcId) => (
                  <div key={kcId} className="selected-item">
                    {kichCoList.find((kc) => kc.id === kcId)?.ten}
                    <button
                      className="remove-btn"
                      onClick={() =>
                        setSelectedKichCo1(
                          selectedKichCo1.filter((id) => id !== kcId)
                        )
                      }
                    >
                      −
                    </button>
                  </div>
                ))}
                <button className="add-btn" onClick={handleOpenPopup}>
                  +
                </button>
              </div>

              {/* Hiển thị màu sắc đã chọn (Bằng chữ) */}
              <div className="shoe-picker-option-group">
                <span className="shoe-picker-label">Màu Sắc:</span>
                {selectedMauSac1.map((msId) => (
                  <div key={msId} className="selected-item">
                    {mauSacList.find((ms) => ms.id === msId)?.ten}
                    <button
                      className="remove-btn"
                      onClick={() =>
                        setSelectedMauSac1(
                          selectedMauSac1.filter((id) => id !== msId)
                        )
                      }
                    >
                      −
                    </button>
                  </div>
                ))}
                <button className="add-btn" onClick={handleOpenPopup}>
                  +
                </button>
              </div>

              {/* Popup chọn kích cỡ và màu sắc */}
              <Modal
                title="Chọn Kích Cỡ & Màu Sắc"
                open={isPopupOpen}
                onCancel={() => setIsPopupOpen(false)}
                onOk={handleConfirmSelection}
              >
                <div>
                  <h4>Chọn Kích Cỡ</h4>
                  <div className="option-grid">
                    {kichCoList.map((kc) => (
                      <button
                        key={kc.id}
                        className={`option-btn ${
                          tempSelectedKichCo.includes(kc.id) ? "selected" : ""
                        }`}
                        onClick={() => handleSelectKichCo(kc.id)}
                      >
                        {kc.ten}
                      </button>
                    ))}
                    <Button icon={<PlusOutlined />} onClick={ThemNhanhKichCo} />
                  </div>
                  {/* Popup hiển thị khi gọi */}
                  <Modal
                    title="Thêm Nhanh Kích Cỡ"
                    open={isThemNhanhKichCo}
                    onCancel={() => setIsThemNhanhKichCo(false)}
                    footer={null}
                  >
                    <div style={{ padding: "10px" }}>
                      <PopupThemNhanhKichCo
                        setIsThemNhanhKichCo={setIsThemNhanhKichCo}
                        getKichCoList={getKichCoList}
                      />
                    </div>
                  </Modal>
                </div>
                <div>
                  <h4>Chọn Màu Sắc</h4>
                  <div className="option-grid">
                    {mauSacList.map((ms) => (
                      <button
                        key={ms.id}
                        className={`option-btn ${
                          tempSelectedMauSac.includes(ms.id) ? "selected" : ""
                        }`}
                        onClick={() => handleSelectMauSac(ms.id)}
                      >
                        {ms.ten}
                      </button>
                    ))}
                    <Button icon={<PlusOutlined />} onClick={ThemNhanhMauSac} />
                  </div>

                  {/* Popup hiển thị khi gọi */}
                  <Modal
                    title="Thêm Nhanh Màu Sắc"
                    open={isThemNhanhMausac}
                    onCancel={() => setIsThemNhanhMausac(false)}
                    footer={null}
                  >
                    <div style={{ padding: "10px" }}>
                      <PopupThemNhanhMauSac
                        setIsThemNhanhMausac={setIsThemNhanhMausac}
                        getMauSacList={getMauSacList}
                      />
                    </div>
                  </Modal>
                </div>
              </Modal>
            </div>
          </div>

          <Table
            className="no-border-table"
            columns={columnsGiayChiTiet}
            dataSource={danhSachChiTiet}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
          />

          {/* Kiểm tra isThemNhanhAnh & selectedRecord trước khi render Popup */}
          {isThemNhanhAnh && selectedRecord && (
            <Modal
              title="Thêm Ảnh Cho Sản Phẩm"
              open={isThemNhanhAnh}
              onCancel={() => setIsThemNhanhAnh(false)} // Đóng modal
              footer={[
                <Button key="cancel" onClick={huyCapNhatAnhBienThe}>
                  Hủy
                </Button>,
                <Button key="ok" type="primary" onClick={CapNhatAnhBienThe}>
                  OK
                </Button>,
              ]}
            >
              <PopupThemaAnh
                selectedGiayIds={selectedGiayIds || []} // Nếu undefined thì dùng mảng trống
                setSelectedGiayIds={setSelectedGiayIds}
              />
            </Modal>
          )}
        </div>
      </Modal>
      {/*  */}
      <Modal
        title="Thêm Sản Phẩm"
        visible={isModalVisible1}
        onOk={creatGiay}
        onCancel={() => setIsModalVisible1(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form layout="horizontal">
          <Row gutter={16}>
            {/* Cột bên trái */}
            <Col span={12}>
              <Form.Item
                label="Tên Giày"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  placeholder="Tên Giày"
                  value={ten}
                  onChange={(e) => setTen(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Giá Bán"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  placeholder="Giá Bán"
                  value={giaBan}
                  onChange={(e) => setGiaBan(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Thương Hiệu"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  placeholder="Chọn Thương Hiệu"
                  value={selectedThuongHieu}
                  onChange={handleThuongHieuChange}
                >
                  {Array.isArray(thuongHieuList) &&
                    thuongHieuList.map((th) => (
                      <Option key={th.id} value={th.id}>
                        {th.ten}
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Chất Liệu"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  placeholder="Chọn Chất Liệu"
                  value={selectedChatLieu}
                  onChange={handleChatLieuChange}
                >
                  {Array.isArray(chatLieuList) &&
                    chatLieuList.map((cl) => (
                      <Option key={cl.id} value={cl.id}>
                        {cl.ten}
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Xuất Xứ"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  placeholder="Chọn Xuất Xứ"
                  value={selectedXuatXu}
                  onChange={handleXuatXuChange}
                >
                  {Array.isArray(xuatXuList) &&
                    xuatXuList.map((xx) => (
                      <Option key={xx.id} value={xx.id}>
                        {xx.ten}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Cột bên phải */}
            <Col span={12}>
              <Form.Item
                label="Ảnh Giày"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn Ảnh Giày"
                  value={selectedAnhGiay}
                  onChange={handleAnhGiayChange}
                >
                  {Array.isArray(anhGiayList) &&
                    anhGiayList.map((ag) => (
                      <Option key={ag.id} value={ag.id}>
                        <img
                          src={ag.tenUrl}
                          alt="Ảnh giày"
                          style={{ width: "80%", height: 150, marginLeft: 30 }}
                        />
                        {ag.tenUrl}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Đế Giày"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  placeholder="Chọn Đế Giày"
                  value={selectedDeGiay}
                  onChange={handleDeGiayChange}
                >
                  {Array.isArray(deGiayList) &&
                    deGiayList.map((deg) => (
                      <Option key={deg.id} value={deg.id}>
                        {deg.ten}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Kiểu Dáng"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  placeholder="Chọn Kiểu Dáng"
                  value={selectedKieuDang}
                  onChange={handleKieuDangChange}
                >
                  {Array.isArray(kieuDangList) &&
                    kieuDangList.map((kd) => (
                      <Option key={kd.id} value={kd.id}>
                        {kd.ten}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Danh Mục"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  placeholder="Chọn Danh Mục"
                  value={selectedDanhMuc}
                  onChange={handleDanhMucChange}
                >
                  {Array.isArray(danhMucList) &&
                    danhMucList.map((kd) => (
                      <Option key={kd.id} value={kd.id}>
                        {kd.ten}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              {/* <Form.Item
                label="Trạng Thái"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Radio.Group onChange={onChange} value={value}>
                  <Radio value={2}>Hoạt động</Radio>
                  <Radio value={1}>Không hoạt động</Radio>
                </Radio.Group>
              </Form.Item> */}
            </Col>
          </Row>
          <Form.Item
            label="Mô Tả"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <TextArea
              rows={4}
              placeholder="Mô Tả"
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        className="no-border-table"
        pagination={{ pageSize: 5 }}
        bordered={false}
        columns={[
          {
            title: "#",
            dataIndex: "stt",
            width: 80,
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
            title: "Số lượng",
            dataIndex: "SOLUONGTON",
            width: 100,
          },
          {
            title: "Danh mục",
            dataIndex: "DANH_MUC",
            width: 150,
          },

          {
            title: "Thương hiệu",
            dataIndex: "THUONG_HIEU",
            width: 150,
          },
          {
            title: "Giá bán",
            dataIndex: "GIABAN",
            width: 150,
            render: (text) => {
              const giaBan = Number(text) || 0;
              return giaBan.toLocaleString("vi-VN");
            },
          },
          {
            title: "Trạng thái",
            dataIndex: "trang_thai",
            width: 150,
            render: (text, record) => {
              // Kiểm tra số lượng tồn
              const statusText =
                record.SOLUONGTON < 30
                  ? "Sắp hết hàng"
                  : record.TRANG_THAI === 0
                  ? "Hoạt động"
                  : "Không hoạt động";

              // Điều kiện thay đổi màu sắc của Switch khi sản phẩm gần hết hàng
              const switchStyle =
                record.SOLUONGTON < 30
                  ? { backgroundColor: "red", borderColor: "red" }
                  : {};

              return (
                <Switch
                  checked={record.TRANG_THAI === 0}
                  disabled
                  checkedChildren={statusText}
                  unCheckedChildren="Không hoạt động"
                  style={switchStyle} // Áp dụng màu đỏ khi số lượng tồn dưới 30
                />
              );
            },
          },

          {
            title: "Thao tác",
            key: "action",
            width: 150,
            render: (text, record) => (
              <Space size="middle">
                <EyeOutlined
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => detailGiay(record)}
                />

                <DeleteOutlined
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => {
                    setRecordToDelete(record); // ✅ lưu đúng sản phẩm muốn xoá
                    setConfirmOpen(true); // ✅ mở modal xác nhận
                  }}
                />

                {/* Hộp thoại xác nhận xóa */}
                <ConfirmModal
                  open={confirmOpen}
                  onConfirm={() => {
                    setConfirmOpen(false);
                    if (recordToDelete) {
                      removeGiay(recordToDelete);
                      setRecordToDelete(null);
                    }
                  }}
                  onCancel={() => {
                    setConfirmOpen(false);
                    setRecordToDelete(null);
                  }}
                  title="Xác nhận xóa"
                  content={`Bạn có chắc muốn xóa giày "${recordToDelete?.TEN}" không?`}
                />
              </Space>
            ),
          },
        ]}
        dataSource={filteredGiay} // Cập nhật bảng với danh sách lọc
      />

      {/* thông tin sản phẩm */}
      <Modal
        title="Thông tin  Sản Phẩm"
        // onOk={editGiayButton}
        onCancel={() => handleCloseModal()}
        visible={isModalVisible}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#f5f5f5",
            padding: "16px",
            borderRadius: "4px",
          }}
        >
          <Row gutter={[16, 16]}>
            {/* Cột bên trái */}
            <Col span={12}>
              <Form
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Form.Item label="Tên Giày">
                  <Input value={ten} onChange={(e) => setTen(e.target.value)} />
                </Form.Item>
                <Form.Item label="Đế Giày">
                  <Select value={selectedDeGiay} onChange={handleDeGiayChange}>
                    {Array.isArray(deGiayList) &&
                      deGiayList.map((deg) => (
                        <Option key={deg.id} value={deg.id}>
                          {deg.ten}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Xuất Xứ">
                  <Select value={selectedXuatXu} onChange={handleXuatXuChange}>
                    {Array.isArray(xuatXuList) &&
                      xuatXuList.map((xx) => (
                        <Option key={xx.id} value={xx.id}>
                          {xx.ten}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Form>
            </Col>

            {/* Cột bên phải */}
            <Col span={12}>
              <Form
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Form.Item label="Thương Hiệu">
                  <Select
                    value={selectedThuongHieu}
                    onChange={handleThuongHieuChange}
                  >
                    {Array.isArray(thuongHieuList) &&
                      thuongHieuList.map((th) => (
                        <Option key={th.id} value={th.id}>
                          {th.ten}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Chất Liệu">
                  <Select
                    value={selectedChatLieu}
                    onChange={handleChatLieuChange}
                  >
                    {Array.isArray(chatLieuList) &&
                      chatLieuList.map((cl) => (
                        <Option key={cl.id} value={cl.id}>
                          {cl.ten}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Danh Mục">
                  <Select
                    value={selectedDanhMuc}
                    onChange={handleDanhMucChange}
                  >
                    {Array.isArray(danhMucList) &&
                      danhMucList.map((cl) => (
                        <Option key={cl.id} value={cl.id}>
                          {cl.ten}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginLeft: "50%",
              }}
            >
              <Button icon={<EditOutlined />} onClick={editGiayButton}></Button>
            </div>
          </Row>
        </div>

        <div className="giaychitiet">
          <p>Chi tiết sản phẩm </p>
          <Table
            className="no-border-table"
            columns={columnsGiayChiTiet}
            dataSource={danhSachChiTiet}
            rowKey="id"
            pagination={false}
            bordered
          />
        </div>
      </Modal>
    </div>
  );
};

export default SanPham;
