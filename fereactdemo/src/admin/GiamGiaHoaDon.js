import React, { useState, useEffect } from "react";
import "./GiamGiaSanPham.css";
import { Space, Table, Button, Input, message, Modal, Form } from "antd";
import {
  addGiamGiaHoaDon,
  deleteGiamGiaHoaDon,
  getGiamGiaHoaDon,
  updateGiamGiaHoaDon,
} from "../service/GiamGiaHoaDonService";

const GiamGiaHoaDon = () => {
  const [ma, setMa] = useState("");
  const [ten, setTen] = useState("");
  const [phanTramGiam, setPhamTramGiam] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState("");
  const [ngayKetThuc, setNgayKetThuc] = useState("");
  const [GiamGiaHoaDon, setGiamGiaHoaDon] = useState([]);
  const [dieuKien, setDieuKien] = useState("");
  const [soTienGiamMax, setSoTienGiamMax] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [editingGiamGiaHoaDon, setEditingGiamGiaHoaDon] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const loadGiamGiaHoaDon = async () => {
    try {
      const result = await getGiamGiaHoaDon();
      const GiamGiaHoaDonData = result.data.map((item, index) => ({
        key: index,
        ID: item.id,
        MA: item.ma,
        TEN: item.ten,
        DIEU_KIEN: item.dieuKien,
        SO_TIEN_GIAM_MAX: item.soTienGiamMax,
        NGAY_BAT_DAU: item.ngayBatDau,
        NGAY_KET_THUC: item.ngayKetThuc,
        PHAN_TRAM_GIAM: item.phanTramGiam,
        SO_LUONG: item.soLuong,
        TRANG_THAI: item.trangThai,
      }));
      setGiamGiaHoaDon(GiamGiaHoaDonData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đợt giảm giá:", error);
    }
  };

  useEffect(() => {
    loadGiamGiaHoaDon();
  }, []);

  const handleAddSubmit = async () => {
    // if (!ma || !ten || !dieuKien) {
    //   message.error("Mã, Tên và Điều kiện phiếu giảm giá không được bỏ trống!");
    //   return;
    // }

    const newTrangThai = getTrangThaiFromDates(
      new Date(ngayBatDau),
      new Date(ngayKetThuc)
    );

    const newGiamGiaHoaDon = {
      ma: ma,
      ten: ten,
      dieuKien: parseFloat(dieuKien),
      soTienGiamMax: parseFloat(soTienGiamMax),
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      phanTramGiam: parseFloat(phanTramGiam),
      soLuong: parseInt(soLuong),
      trangThai: newTrangThai,
    };
    try {
      await addGiamGiaHoaDon(newGiamGiaHoaDon);
      message.success("Thêm thành công!");
      loadGiamGiaHoaDon();
      setMa("");
      setTen("");
      setDieuKien("");
      setSoTienGiamMax("");
      setSoLuong("");
      setPhamTramGiam("");
      setNgayBatDau("");
      setNgayKetThuc("");
    } catch (error) {
      message.error("Lỗi khi thêm!");
      console.error("Lỗi khi thêm:", error);
    }
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

    const updatedGiamGiaHoaDon = {
      ma: ma,
      ten: ten,
      dieuKien: parseFloat(dieuKien),
      soTienGiamMax: parseFloat(soTienGiamMax),
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      phanTramGiam: parseFloat(phanTramGiam),
      soLuong: parseInt(soLuong),
      trangThai: updatedTrangThai,
    };

    try {
      await updateGiamGiaHoaDon(editingGiamGiaHoaDon.ID, updatedGiamGiaHoaDon);
      message.success("Cập nhật thành công");
      loadGiamGiaHoaDon();
      setIsModalVisible(false);
      setEditingGiamGiaHoaDon(null);
      setMa("");
      setTen("");
      setDieuKien("");
      setSoTienGiamMax("");
      setSoLuong("");
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
      await deleteGiamGiaHoaDon(record.ID);
      message.success("Xóa đợt giảm giá thành công ");
      loadGiamGiaHoaDon();
    } catch (error) {
      message.error("Lỗi khi xóa đợt giảm giá");
    }
  };

  const getTrangThaiFromDates = (startDate, endDate) => {
    const today = new Date();
    if (today >= startDate && today <= endDate) {
      return 0; // Hoạt động
    } else if (today < startDate) {
      return 2; // Đang chờ
    } else {
      return 1; // Hết
    }
  };

  const columns = [
    // { title: "ID", dataIndex: "ID", key: "ID" },
    // { title: "Mã", dataIndex: "MA", key: "MA" },
    { title: "Tên", dataIndex: "TEN", key: "TEN" },
    {
      title: "Điều Kiện",
      dataIndex: "DIEU_KIEN",
      key: "DIEU_KIEN",
      render: (text) => `${text ? text.toLocaleString() : "0"} VND`,
    },
    {
      title: "Số tiền giảm Max",
      dataIndex: "SO_TIEN_GIAM_MAX",
      key: "SO_TIEN_GIAM_MAX",
    },
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
    { title: "Số Lượng", dataIndex: "SO_LUONG", key: "SO_LUONG" },
    {
      title: "Trạng Thái",
      dataIndex: "TRANG_THAI",
      key: "TRANG_THAI",
      render: (text) => (text === 0 ? "Còn" : text === 1 ? "Hết" : "Đang chờ"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleUpdate(record)}>Cập nhật</Button>
          <Button onClick={() => handleDelete(record)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  const handleUpdate = (record) => {
    setEditingGiamGiaHoaDon(record);
    setMa(record.MA);
    setTen(record.TEN);
    setDieuKien(record.DIEU_KIEN);
    setSoTienGiamMax(record.SO_TIEN_GIAM_MAX);
    setSoLuong(record.SO_LUONG);
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
    setEditingGiamGiaHoaDon(null);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  return (
    <div className="dot-giam-gia">
      <Button onClick={handleAdd}>Thêm Phiếu Giảm Giá</Button>
      <Table
        columns={columns}
        dataSource={GiamGiaHoaDon}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Thêm Phiếu Giảm Giá */}
      <Modal
        title="Thêm Phiếu Giảm Giá"
        visible={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={handleAddModalCancel}
      >
        <Form layout="vertical">
          {/* <Form.Item label="Mã">
            <Input value={ma} onChange={(e) => setMa(e.target.value)} />
          </Form.Item> */}
          <Form.Item label="Tên">
            <Input value={ten} onChange={(e) => setTen(e.target.value)} />
          </Form.Item>
          <Form.Item label="Điều Kiện">
            <Input
              value={dieuKien}
              onChange={(e) => setDieuKien(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Số Tiền Giảm Max">
            <Input
              value={soTienGiamMax}
              onChange={(e) => setSoTienGiamMax(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Ngày Bắt Đầu">
            <Input
              type="date"
              value={ngayBatDau}
              onChange={(e) => setNgayBatDau(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Phần Trăm Giảm">
            <Input
              value={phanTramGiam}
              onChange={(e) => setPhamTramGiam(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Số Lượng">
            <Input
              value={soLuong}
              onChange={(e) => setSoLuong(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Ngày Kết Thúc">
            <Input
              type="date"
              value={ngayKetThuc}
              onChange={(e) => setNgayKetThuc(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Cập Nhật Phiếu Giảm Giá */}
      <Modal
        title="Cập Nhật Phiếu Giảm Giá"
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
          <Form.Item label="Điều Kiện">
            <Input
              value={dieuKien}
              onChange={(e) => setDieuKien(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Số Tiền Giảm Max">
            <Input
              value={soTienGiamMax}
              onChange={(e) => setSoTienGiamMax(e.target.value)}
            />
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
          <Form.Item label="Số Lượng">
            <Input
              value={soLuong}
              onChange={(e) => setSoLuong(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GiamGiaHoaDon;
