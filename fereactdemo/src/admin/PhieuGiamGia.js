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
} from "../service/PhieuGiamGiaService";
import { getGiay, getGiayDetail } from "../service/GiayService";
import { FilterOutlined } from "@ant-design/icons";
import { getAllGiayChiTiet, getGiayChitietDetail1 } from "../service/GiayChiTietService";
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
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [filters, setFilters] = useState({
    ten: "",
    phanTramGiam: "",
    tuNgay: null,
    denNgay: null,
    trangThai: "all",
  });
  const handleRowClick = (record) => {
    setSelectedRowKey(record.id);  // Cập nhật ID dòng được chọn
    fetchSanPhamChiTiet(record);    // Gọi hàm để lấy chi tiết sản phẩm
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
      setDotGiamGia(dotGiamGiaData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đợt giảm giá:", error);
    }
  };
  const getAllGiay = async () => {
    try {
      const result = await getGiay();
      console.log("Dữ liệu giày:", result);

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

      if (!Array.isArray(response.data)) {
        console.error("Dữ liệu trả về không phải mảng!", response.data);
        return [];
      }

      const danhSachChiTiet = response.data.map((item) => ({
        id: item.id,
        ten: item.giayEntity?.ten || "N/A",
        anh: item.danhSachAnh.length > 0 ? item.danhSachAnh[0] : null,
        giaBan: item.giaBan || 0,
        mauSac: item.mauSacEntity?.ten || "Không có",
        kichCo: item.kichCoEntity?.ten || "Không có",
        soLuongTon: item.soLuongTon || 0,
      }));

 

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
      idGiayChiTiet: selectedProducts.map(product => product.id),
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
      setSelectedProducts(null)
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
              <Form.Item label="Giá trị giảm">
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
              <Table
                rowSelection={{
                  type: "checkbox",
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedProducts(selectedRows); // Lưu danh sách sản phẩm được chọn
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
                    title: "Số lượng tồn",
                    dataIndex: "soLuongTon",
                    width: 120,
                  },
                  { title: "Màu sắc", dataIndex: "mauSac", width: 120 },
                  { title: "Kích cỡ", dataIndex: "kichCo", width: 100 },
                  {
                    title: "Giá bán",
                    dataIndex: "giaBan",
                    width: 120,
                    render: (gia) => gia.toLocaleString() + " VNĐ",
                  },
                ]}
                dataSource={giayChiTiet}
                rowKey="id"
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
