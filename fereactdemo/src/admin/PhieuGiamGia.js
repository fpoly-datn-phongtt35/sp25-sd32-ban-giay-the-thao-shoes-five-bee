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
} from "../service/PhieuGiamGiaService";
import { FilterOutlined } from "@ant-design/icons";

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

  const [filters, setFilters] = useState({
    ten: "",
    phanTramGiam: "",
    tuNgay: null,
    denNgay: null,
    trangThai: "all",
  });

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
      setDotGiamGia(dotGiamGiaData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đợt giảm giá:", error);
    }
  };

  useEffect(() => {
    loadDotGiamGia();
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

    const newDotGiamGia = {
      ma: ma,
      ten: ten,
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      phanTramGiam: parseFloat(phanTramGiam),
      trangThai: newTrangThai,
    };
    try {
      await addPhieuGiamGia(newDotGiamGia);
      message.success("Thêm thành công!");
      loadDotGiamGia();
      setMa("");
      setTen("");
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
      render: (text) =>
        text === 0 ? "Hoạt động" : text === 1 ? "Không hoạt động" : "Đang chờ",
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
    setIsAddModalVisible(false);
  };

  return (
    <div className="dot-giam-gia">
      <h1>Quản lý giảm giá sản phẩm</h1>
      <Button onClick={handleAdd}>Thêm Phiếu Giảm Giá</Button>

      {/* bộ lọc */}
      <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 5, marginLeft: 200 }}>
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
          <Form.Item label="Phần Trăm Giảm">
            <Input
              value={phanTramGiam}
              onChange={(e) => setPhamTramGiam(e.target.value)}
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
        </Form>
      </Modal>

      {/* Modal Cập Nhật Phiếu Giảm Giá */}
      <Modal
        title="Cập nhật phiếu giảm giá"
        visible={isModalVisible}
        onOk={handleUpdateSubmit}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Mã">
            <Input value={ma} onChange={(e) => setMa(e.target.value)} />
          </Form.Item>
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
