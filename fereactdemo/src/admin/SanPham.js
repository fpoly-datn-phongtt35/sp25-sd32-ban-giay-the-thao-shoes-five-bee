import React, { useEffect, useState, useRef } from "react";
import {
  addGiay,
  deleteGiay,
  getGiay,
  getGiayDetail,
  updateGiay,
  assignAnhGiay,
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
} from "antd";
import "./Sanpham.css";
import { validate as isUuid } from "uuid";
import { getThuongHieu } from "../service/ThuongHieuService";
import { getChatLieu } from "../service/ChatLieuService";
import { getDeGiay } from "../service/DeGiayService";
import { getKieuDang } from "../service/KieuDangService";
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

const SanPham = () => {
  const [giay, setGiay] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [value, setValue] = useState(1);
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
  const [anhGiayList, setAnhGiayList] = useState([]);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState();
  const [selectedChatLieu, setSelectedChatLieu] = useState();
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

  const [selectedMauSac1, setSelectedMauSac1] = useState(null);
  const [selectedKichCo1, setSelectedKichCo1] = useState(null);
  const [selectedAnhGiay1, setSelectedAnhGiay1] = useState(null);

  const [danhSachChiTiet, setDanhSachChiTiet] = useState([]);

  const [soLuongTon1, setSoLuongTon1] = useState(null);

  const [giaBan1, setGiaBan1] = useState(null);

  const [selectedGiay1, setSelectedGiay1] = useState(null);
  const [IsModalVisibleUpdateGiayChiTiet, setIsModalVisibleUpdateGiayChiTiet] =
    useState(null);

  useEffect(() => {
    getMauSacList();
    getKichCoList();
    getAnhList();
  }, []);
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
  const fetchSanPhamChiTiet = async (data) => {
    try {
      const id = data.ID || data.id; // Lấy ID từ object (cả ID viết hoa hoặc thường)
      if (!id) {
        console.error("Lỗi: ID không hợp lệ!", data);
        return null;
      }
      setSelectedGiay1(id);

      
      const response = await getGiayChitietDetail1(id);
      console.log("Dữ liệu sản phẩm chi tiết:", response.data);

      // Kiểm tra nếu dữ liệu là mảng
      if (!Array.isArray(response.data)) {
        console.error("Dữ liệu trả về không phải mảng!", response.data);
        return [];
      }

      // Trích xuất dữ liệu từ danh sách sản phẩm chi tiết
      const danhSachChiTiet = response.data.map((item) => ({
        id: item.id,
        ten: item.giayEntity?.ten || "N/A",
        anh: item.danhSachAnh.length > 0 ? item.danhSachAnh[0] : null, // Lấy ảnh đầu tiên hoặc null
        giaBan: item.giaBan || 0,
        mauSac: item.mauSacEntity?.ten || "Không có",
        kichCo: item.kichCoEntity?.ten || "Không có",
        soLuongTon: item.soLuongTon || 0,
      }));

      console.log("Danh sách chi tiết sản phẩm:", danhSachChiTiet);
      setDanhSachChiTiet(danhSachChiTiet);
      // Gọi hàm hiển thị popup
      // showSanPhamChiTietPopup(danhSachChiTiet);
      setIsChiTietModalVisible(true);
      return danhSachChiTiet;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm chi tiết:", error);
      return [];
    }
  };
  const handleEdit = async (record) => {
    try {
      const response = await detailGiayChiTiet2(record.id);

      const giayChiTiet = response.data;
      console.log("🔍 Chi tiết giày:", giayChiTiet);

      setEditingGiayChiTiet(giayChiTiet);
      setGiaBan1(giayChiTiet.giaBan);
      setSoLuongTon1(giayChiTiet.soLuongTon); // Cập nhật số lượng tồn cho sản phẩm 1
      setValue(giayChiTiet.trangThai === 0 ? 1 : 2);
      setSelectedMauSac1(
        giayChiTiet.mauSacEntity ? giayChiTiet.mauSacEntity.id : null
      );
      setSelectedKichCo1(
        giayChiTiet.kichCoEntity ? giayChiTiet.kichCoEntity.id : null
      );
      setSelectedGiay1(
        giayChiTiet.giayEntity ? giayChiTiet.giayEntity.id : null,
        giayChiTiet.giayEntity ? giayChiTiet.giayEntity.ten : null
      );
      setIsModalVisibleUpdateGiayChiTiet(true);
    } catch (error) {
      message.error("Lỗi khi detail giày chi tiết");
    }
  };
  const handleUpdate = async (record) => {
    if (!editingGiayChiTiet) {
        message.error("❌ Không có dữ liệu sản phẩm chi tiết để cập nhật!");
        return;
    }

    // Kiểm tra xem sản phẩm có đúng với sản phẩm đang được xem không
    if (editingGiayChiTiet?.id !== record.id) {
      message.error("❌ Bạn đang chỉnh sửa một sản phẩm khác với sản phẩm trong chi tiết!");
      return;
  }
  
    const updatedGiayChiTiet = {
        id: editingGiayChiTiet?.id || null,
        soLuongTon: soLuongTon1,
        giaBan: giaBan1,
        giayDto: selectedGiay1 ? { id: selectedGiay1 } : null,
        trangThai: value === 1 ? 0 : 1,
        mauSacDto: selectedMauSac1 ? { id: selectedMauSac1 } : null,
        kichCoDto: selectedKichCo1 ? { id: selectedKichCo1 } : null,
        danhSachAnh: selectedAnhGiay1 ? selectedAnhGiay1.map((id) => ({ id })) : [],
    };

    console.log("🔍 Dữ liệu cập nhật gửi đi:", updatedGiayChiTiet);

    try {
        if (!updatedGiayChiTiet.giayDto?.id ||
            !updatedGiayChiTiet.mauSacDto?.id ||
            !updatedGiayChiTiet.kichCoDto?.id) {
            message.error("❌ Vui lòng chọn đầy đủ Giày, Màu sắc và Kích cỡ trước khi cập nhật!");
            return;
        }

        const response = await updateGiayChiTiet(updatedGiayChiTiet);
        message.success("✅ Cập nhật sản phẩm chi tiết thành công!");

        // Cập nhật danh sách sản phẩm chi tiết
        fetchSanPhamChiTiet({ ID: selectedGiay1 });

        // Cập nhật lại form với dữ liệu mới từ API
        setSoLuongTon1("");
        setGiaBan1("");
        setSelectedMauSac1(response.data.mauSacDto?.id || null);
        setSelectedKichCo1(response.data.kichCoDto?.id || null);
        setSelectedGiay1(response.data.giayDto?.id || null);
        selectedAnhGiay1(response.data.danhSachAnh || null);
        setIsModalVisible(false);
    } catch (error) {
        console.error("❌ Lỗi cập nhật sản phẩm chi tiết:", error.response?.data || error.message);
        message.error("❌ Lỗi cập nhật sản phẩm chi tiết: " + (error.response?.data?.message || error.message));
    }
};



  const handleDelete = async (record) => {
    try {
      await removeGiayChiTiet(record.id);
      message.success("Xóa sản phẩm chi tiết thành công!");

      // 🌀 Cập nhật danh sách ngay lập tức bằng cách lọc bỏ sản phẩm vừa xóa
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

    console.log("🔹 Số lượng tồn:", soLuongTon1);
    console.log("🔹 Giá bán:", giaBan1);
    console.log("🔹 Giày đã chọn:", selectedGiay1);
    console.log("🔹 Màu sắc đã chọn:", selectedMauSac1);
    console.log("🔹 Kích cỡ đã chọn:", selectedKichCo1);
    console.log("🔹 ảnh đã chọn:", selectedAnhGiay1);

    try {
      // 🏀 Kiểm tra dữ liệu đầu vào trước khi gửi
      if (
        !soLuongTon1 ||
        !selectedGiay1 ||
        !selectedMauSac1 ||
        !selectedKichCo1
      ) {
        message.error("Vui lòng nhập đầy đủ thông tin trước khi thêm!");
        return;
      }

      // console.log("📤 Dữ liệu gửi lên BE:", {
      //   soLuongTon1,
      //   giaBan1,
      //   selectedGiay1,
      //   selectedMauSac1,
      //   selectedKichCo1,
      //   selectedAnhGiay1,
      // });

      // 🏀 Thêm mới sản phẩm chi tiết
      const newProduct = await addGiayChiTiet({
        soLuongTon: parseInt(soLuongTon1), // Ép kiểu số nguyên
        giaBan: parseFloat(giaBan1), // Ép kiểu số
        giayDto: { id: selectedGiay1 },
        mauSacDto: { id: selectedMauSac1 },
        kichCoDto: { id: selectedKichCo1 },
        danhSachAnh: selectedAnhGiay1
          ? selectedAnhGiay1.map((id) => ({ id }))
          : [],
        trangThai: newTrangThai1,
      });

      // 🌀 Cập nhật danh sách ngay lập tức
      // setDanhSachChiTiet((prevList) => [
      //   ...prevList,
      //   {
      //     id: newProduct.id, // Lấy ID từ dữ liệu trả về
      //     ten: newProduct.giayDto.ten, // Lấy tên từ giày
      //     giaBan: newProduct.giaBan,
      //     mauSac: newProduct.mauSacDto.ten,
      //     kichCo: newProduct.kichCoDto.ten,
      //     soLuongTon: newProduct.soLuongTon,
      //     anh: newProduct.anhGiayDtos.map((ag) => ag.tenUrl),
      //   },
      // ]);
      console.log("📥 Phản hồi từ BE:", newProduct);
      fetchSanPhamChiTiet({ ID: selectedGiay1 });

      message.success("Thêm sản phẩm chi tiết mới thành công!");

      // Reset form
      setTen("");
      setSoLuongTon1("");
      setGiaBan1("");
      setSelectedMauSac1(null);
      setSelectedKichCo1(null);
      setSelectedGiay1(null);
      setValue(1);
    } catch (error) {
      console.error("❌ Lỗi khi thêm giày chi tiết:", error);
      message.error("Lỗi khi thực hiện thao tác: " + error.message);
    }
  };

  // Hàm hiển thị popup
  const columnsGiayChiTiet = [
    // { title: "Tên", dataIndex: "ten", key: "ten" },
    { title: "Ảnh", dataIndex: "anh", key: "anh" },
    { title: "Giá Bán", dataIndex: "giaBan", key: "giaBan" },
    { title: "Số Lượng Tồn", dataIndex: "soLuongTon", key: "soLuongTon" },
    {
      title: "Màu Sắc",
      dataIndex: "mauSac",
      key: "mauSac",
    },
    {
      title: "Kích Cỡ",
      dataIndex: "kichCo",
      key: "kichCo",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Detail
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
          <Button danger onClick={() => handleUpdate(record)}>
            Update
          </Button>
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

    const newTrangThai = value === 1 ? 1 : 0;

    const newDataGiay = {
      ten: ten,
      moTa: moTa,
      giaBan: parseFloat(giaBan),
      soLuongTon: parseFloat(soLuongTon),
      trangThai: newTrangThai,
      thuongHieuDto: selectedThuongHieu ? { id: selectedThuongHieu } : null,
      chatLieuDto: selectedChatLieu ? { id: selectedChatLieu } : null,
      deGiayDto: selectedDeGiay ? { id: selectedDeGiay } : null,
      xuatXuDto: selectedXuatXu ? { id: selectedXuatXu } : null,
      kieuDangDto: selectedKieuDang ? { id: selectedKieuDang } : null,
      mauSacDto: selectedMauSac ? { id: selectedMauSac } : null,
      kichCoDto: selectdKichCo ? { id: selectdKichCo } : null,
    };

    try {
      // 1️⃣ Gọi API tạo sản phẩm, lấy `id` của sản phẩm vừa tạo
      const giayResponse = await addGiay(newDataGiay);
      const giayId = giayResponse.data.id; // Lấy ID sản phẩm mới từ response

      // 2️⃣ Nếu có ảnh, gọi API gán ảnh cho sản phẩm đó
      if (selectedAnhGiay && selectedAnhGiay.length > 0) {
        await assignAnhGiay(giayId, selectedAnhGiay);
        message.success("Đã gán ảnh vào sản phẩm!");
      }

      message.success("Thêm sản phẩm thành công!");
      getAllGiay();

      // Reset lại form
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

      console.log("Sản phẩm mới:", giayResponse.data);
    } catch (error) {
      message.error(
        "Lỗi thêm sản phẩm: " + (error.response?.data?.message || error.message)
      );
    }

    setIsModalVisible1(false);
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
    // Tạo đối tượng GiayDto từ thông tin của giày mà bạn có
    const giayDto = {
      id: record.ID, // Nếu bạn muốn gửi ID cùng với các thông tin khác
      ten: record.ten,
      moTa: record.moTa,
      giaBan: record.giaBan,
      soLuongTon: record.soLuongTon,
      trangThai: record.trangThai,
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
            tenUrl: ag.tenUrl, // ✅ Thêm đường dẫn ảnh vào object
          }))
        : [],
    };

    try {
      // Gửi DTO qua API để lấy chi tiết giày
      const response = await getGiayDetail(giayDto);
      const giay = response.data;

      // Cập nhật state với dữ liệu nhận được
      setEditingGiay(giay);
      setTen(giay.ten);
      setMoTa(giay.moTa);
      setGiaBan(giay.giaBan);
      setSoLuongTon(giay.soLuongTon);
      setValue(giay.trangThai === 0 ? 2 : 1);
      setSelectedThuongHieu(giay.thuongHieu ? giay.thuongHieu.id : null);
      setSelectedChatLieu(giay.chatLieu ? giay.chatLieu.id : null);
      setSelectedDeGiay(giay.deGiay ? giay.deGiay.id : null);
      setSelectedKieuDang(giay.kieuDang ? giay.kieuDang.id : null);
      setSelectedXuatXu(giay.xuatXu ? giay.xuatXu.id : null);
      setSelectedMauSac(giay.mauSac ? giay.mauSac.id : null);
      setSelectedKichCo(giay.kichCo ? giay.kichCo.id : null);
      setSelectedAnhGiay(giay.anhGiay ? giay.anhGiay.id : null);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Lỗi khi lấy chi tiết giày: " + error.message);
    }
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

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  return (
    <div className="sanpham-container" scroll={{ x: 5000 }}>
      <Button type="primary" onClick={() => setIsModalVisible1(true)}>
        Thêm Giày
      </Button>
      {/*  */}
      <Modal
        title="Chi Tiết Sản Phẩm"
        visible={isChiTietModalVisible}
        onCancel={() => setIsChiTietModalVisible(false)}
        footer={
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button type="primary" onClick={() => handleAdd()}>
              Thêm
            </Button>
            <Button
              type="default"
              onClick={() => setIsChiTietModalVisible(false)}
            >
              OK
            </Button>
          </div>
        }
        width="auto"
        style={{ maxWidth: "100vw" }}
      >
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <Select
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
            />
            <Select
              placeholder="Chọn Kích Cỡ"
              value={selectedKichCo1}
              onChange={setSelectedKichCo1}
            >
              {Array.isArray(kichCoList) &&
                kichCoList.map((kc) => (
                  <Select.Option key={kc.id} value={kc.id}>
                    {kc.ten}
                  </Select.Option>
                ))}
            </Select>
            <Select
              placeholder="Chọn Màu Sắc"
              value={selectedMauSac1}
              onChange={setSelectedMauSac1}
            >
              {Array.isArray(mauSacList) &&
                mauSacList.map((ms) => (
                  <Select.Option key={ms.id} value={ms.id}>
                    {ms.ten}
                  </Select.Option>
                ))}
            </Select>
          </div>

          <Table
            columns={columnsGiayChiTiet}
            dataSource={danhSachChiTiet}
            rowKey="id"
            pagination={false}
            bordered
          />
        </div>
      </Modal>
      {/*  */}
      <Modal
        title="Thêm Giày"
        visible={isModalVisible1}
        onOk={creatGiay}
        onCancel={() => setIsModalVisible1(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <div style={{ float: "left", width: "45%" }}>
          <Select
            style={{ width: "100%" }}
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
          <br />
          <br />
          <Select
            style={{ width: "100%" }}
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
          <br />
          <br />
          <Select
            style={{ width: "100%" }}
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
          <br />
          <br />
          <Select
            style={{ width: "100%" }}
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
          <br />
          <br />
          <Select
            style={{ width: "100%" }}
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
          <br />
          <br />
        </div>

        <div style={{ float: "right", width: "45%" }}>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
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
                    style={{
                      width: "80%",
                      height: 150,
                      marginLeft: 30,
                    }}
                  />
                  {ag.tenUrl}
                </Option>
              ))}
          </Select>

          <br />
          <br />
          <Input
            style={{ width: "100%" }}
            placeholder="Tên Giày"
            value={ten}
            onChange={(e) => setTen(e.target.value)}
          />
          <br />
          <br />

          <Input
            style={{ width: "100%" }}
            placeholder="Giá Bán ($)"
            value={giaBan}
            onChange={(e) => setGiaBan(e.target.value)}
          />
          <br />
          <br />
          <Input
            style={{ width: "100%" }}
            placeholder="Số Lượng Tồn"
            value={soLuongTon}
            onChange={(e) => setSoLuongTon(e.target.value)}
          />
          <br />
          <br />
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>Không hoạt động</Radio>
            <Radio value={2}>Hoạt động</Radio>
          </Radio.Group>
        </div>

        <br />

        <TextArea
          rows={4}
          placeholder="Mô Tả"
          value={moTa}
          onChange={(e) => setMoTa(e.target.value)}
        />
        <br />
        <br />
      </Modal>

      <Table
        style={{ marginLeft: "150px" }}
        pagination={{ pageSize: 5, defaultPageSize: 5 }}
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        columns={[
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
          // {
          //   title: "Giá bán",
          //   dataIndex: "GIABAN",
          //   width: 100,
          //   render: (text) => {
          //     // Kiểm tra nếu giá trị là số, rồi định dạng với toLocaleString
          //     return Number(text).toLocaleString("vi-VN", {
          //       style: "currency",
          //       currency: "VND",
          //     });
          //   },
          // },
          // {
          //   title: "Số Lượng",
          //   dataIndex: "SOLUONGTON",
          //   width: 100,
          // },
          {
            title: "Trạng Thái",
            dataIndex: "trang_thai",
            width: 150,
            render: (text, record) => trangThai(record.TRANG_THAI),
          },
          // {
          //     title: 'THUONG_HIEU', dataIndex: 'THUONG_HIEU',
          //     width: 150,
          // },
          // {
          //     title: 'CHAT_LIEU',
          //     dataIndex: 'CHAT_LIEU',
          //     width: 150,
          // },
          // {
          //     title: 'DE_GIAY',
          //     dataIndex: 'DE_GIAY',
          //     width: 150,
          // },
          // {
          //     title: 'XUAT_XU',
          //     dataIndex: 'XUAT_XU',
          //     width: 150,
          // },
          // {
          //     title: 'KIEU_DANG',
          //     dataIndex: 'KIEU_DANG',
          //     width: 150,
          // },

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
            title: "Thao tác",
            key: "action",
            width: 150,
            render: (text, record) => (
              <Space size="middle">
                <Button onClick={() => detailGiay(record)}>Chi tiết</Button>
                <Button onClick={() => removeGiay(record)}>Xóa</Button>
              </Space>
            ),
          },
        ]}
        dataSource={giay}
      />
      <Modal
        title="Update Sản Phẩm"
        onOk={editGiayButton}
        onCancel={() => setIsModalVisible(false)}
        visible={isModalVisible}
      >
        <Form>
          <Form.Item label="Tên Giày">
            <Input value={ten} onChange={(e) => setTen(e.target.value)} />
          </Form.Item>
          <Form.Item label="Mô Tả">
            <TextArea
              rows={4}
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Giá Bán">
            <Input value={giaBan} onChange={(e) => setGiaBan(e.target.value)} />
          </Form.Item>
          <Form.Item label="Số Lượng Tồn">
            <Input
              value={soLuongTon}
              onChange={(e) => setSoLuongTon(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Trạng Thái">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Không hoạt động</Radio>
              <Radio value={2}>Hoạt động</Radio>
            </Radio.Group>
          </Form.Item>
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
            <Select value={selectedChatLieu} onChange={handleChatLieuChange}>
              {Array.isArray(chatLieuList) &&
                chatLieuList.map((cl) => (
                  <Option key={cl.id} value={cl.id}>
                    {cl.ten}
                  </Option>
                ))}
            </Select>
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
          <Form.Item label="Kiểu Dáng">
            <Select value={selectedKieuDang} onChange={handleKieuDangChange}>
              {Array.isArray(kieuDangList) &&
                kieuDangList.map((kd) => (
                  <Option key={kd.id} value={kd.id}>
                    {kd.ten}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ảnh Giày">
            <Select
              mode="multiple" // Nếu muốn chọn nhiều ảnh
              value={selectedAnhGiay} // ✅ Bây giờ chứa danh sách `tenUrl`
              onChange={handleAnhGiayChange}
              style={{ width: "100%" }}
            >
              {Array.isArray(anhGiayList) &&
                anhGiayList.map((ag) => (
                  <Option key={ag.id} value={ag.tenUrl}>
                    <img
                      src={ag.tenUrl}
                      alt="Ảnh giày"
                      style={{ width: 50, height: 50, marginRight: 10 }}
                    />
                    {ag.tenUrl}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SanPham;
