import React, { useState, useRef, useEffect } from "react";
import {
  DatePicker,
  Input,
  Select,
  Space,
  Button,
  Table,
  Modal,
  Form,
  message,
} from "antd";
import { EditOutlined, FileTextOutlined, HistoryOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import "./quanlyhoadon.css";
import {
  detailHoaDon,
  getHoaDon,
  getHoaDonById1,
  xacNhanHoaDon,

} from "../service/HoaDonService";
import {
  getLichSuHoaDon,
  getLichSuHoaDonById,

} from "../service/LichSuHoaDonService";
import moment from "moment";
import {
  printfHoaDonChiTiet,
} from "../service/HoaDonChiTietService";
const QuanLyHoaDon = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [data, setData] = useState([]);
  const [dataHoaDonChiTiet, setDataHoaDonChiTiet] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [phoneFilter, setPhoneFilter] = useState("");
  const [isHistoryPopupVisible, setIsHistoryPopupVisible] = useState(false);
  const [lichSuHoaDon, setLichSuHoaDon] = useState([]);
  const mapTrangThai = (trangThai) => {
    switch (trangThai) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Hóa đơn chờ thanh toán";
      case 2:
        return "Hoàn thành";
      case 3:
        return "Đã xác nhận";
      case 4:
        return "Chờ vận chuyển";
      case 5:
        return "Đang vận chuyển";
      case 6:
        return "Đã giao hàng";
      case 7:
        return "Trả hàng";

      default:
        return "Đã hủy";
    }
  };



  useEffect(() => {
    fetchHoaDon();
  }, [statusFilter, dateFilter]);

  const fetchLichSuHoaDon = async () => {
    try {
      const response = await getLichSuHoaDon(); // Gọi API getAll từ backend

      if (response.data && response.data.length > 0) {
        console.log("Lịch sử hóa đơn:", response.data); // Kiểm tra dữ liệu trả về
        setLichSuHoaDon(response.data); // Cập nhật dữ liệu vào state
        setIsHistoryPopupVisible(true); // Mở popup nếu có dữ liệu
      } else {
        console.log("Không có lịch sử hóa đơn");
        setLichSuHoaDon([]); // Đảm bảo cập nhật state khi không có dữ liệu
        setIsHistoryPopupVisible(false); // Ẩn popup nếu không có dữ liệu
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử hóa đơn:", error);
      message.error("Không thể lấy lịch sử hóa đơn!");
      setLichSuHoaDon([]); // Đảm bảo cập nhật state khi có lỗi
      setIsHistoryPopupVisible(false); // Ẩn popup nếu có lỗi
    }
  };


  const fetchLichSuHoaDonById = async (hoaDonId) => {
    try {
      const response = await getLichSuHoaDonById(hoaDonId); // Gọi API với hoaDonId
      console.log("Lịch sử hóa đơn theo ID:", response.data); // Kiểm tra dữ liệu trả về

      // Map qua dữ liệu và lấy mã hóa đơn (maHoaDon)
      const lichSuData = response.data.map(item => ({
        ...item,
        maHoaDon: item.maHoaDon  // Mã hóa đơn
      }));

      setLichSuHoaDon(lichSuData); // Cập nhật dữ liệu vào state
      setIsHistoryPopupVisible(true); // Mở popup nếu có dữ liệu
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử hóa đơn theo ID:", error);
      message.error("Không thể lấy lịch sử hóa đơn theo ID!");
    }
  };



  const handleHistoryClick = () => {
    fetchLichSuHoaDon(); // Gọi API để fetch dữ liệu lịch sử hóa đơn
    setIsHistoryPopupVisible(true); // Mở popup sau khi dữ liệu được fetch
  };


  const fetchHoaDon = async () => {
    try {
      const result = await getHoaDon();
      console.log("Dữ liệu từ API:", result.data);

      if (!Array.isArray(result.data)) {
        console.error("Dữ liệu không phải là mảng");
        setData([]);
        return;
      }

      const formattedData = result.data.map((item) => {
        // Tổng tiền thanh toán là số tiền từ API
        const tongTienThanhToan = item.tongTien;

        return {
          key: item.id, // ID hóa đơn
          order_id: item.id,
          ma: item.ma, // Mã hóa đơn
          user: item.tenNguoiNhan || (item.userDto?.hoTen ?? "Khách lẻ"), // Tên người nhận hoặc user
          user_phone: item.sdtNguoiNhan || (item.userDto?.soDienThoai ?? "N/A"), // Số điện thoại
          order_on: item.ngayTao
            ? moment(item.ngayTao).format("DD/MM/YYYY")
            : "N/A", // Ngày tạo đơn
          status: mapTrangThai(item.trangThai), // Trạng thái đơn hàng
          trangThai: item.trangThai,
          diaChi: item.diaChi || "Không có địa chỉ", // Địa chỉ đơn hàng
          hinhThucMua: item.hinhThucMua === 1 ? "Tại Quầy" : "Online",
          hinhThucThanhToan: item.hinhThucThanhToan === 0
            ? "Tiền mặt"
            : item.hinhThucThanhToan === 1
              ? "Chuyển khoản"
              : item.hinhThucThanhToan === 2
                ? "Thanh toán khi nhận hàng"
                : "VNPay",

          phiShip: item.phiShip ?? 0, // Phí ship (nếu có)
          soTienGiam: item.soTienGiam ?? 0, // Số tiền giảm giá
          tongTien: tongTienThanhToan, // Tổng tiền thanh toán
          products:
            item.items?.map((product) => ({
              id: product.id,
              tenGiay: product.giayChiTietEntity.giayEntity.ten,
              mauSac: product.giayChiTietEntity.mauSacEntity.ten,
              kichCo: product.giayChiTietEntity.kichCoEntity.ten,
              soLuong: product.soLuong,
              giaBan: product.giaBan,
              hinhAnh:
                product.giayChiTietEntity.giayEntity.anhGiayEntities?.[0]
                  ?.tenUrl ?? "", // Lấy ảnh đầu tiên nếu có
            })) ?? [],
          chuongTrinhGiamGiaChiTietHoaDons: item.chuongTrinhGiamGiaChiTietHoaDons || [],
        };
      });

      setData(formattedData);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu: ", error);
      message.error("Lỗi khi tải dữ liệu!");
    }
  };
  useEffect(() => {
    if (dataHoaDonChiTiet.length > 0) {
      togglePopup();
    }
  }, [dataHoaDonChiTiet]);
  const fetchHoaDonChiTiet = async (id) => {
    try {
      const response = await getHoaDonById1(id);
      console.log("Chi tiết hóa đơn:", response.data);

      // Tính tổng tiền sản phẩm từ items
      const tongTienSanPham = response.data.items.reduce(
        (total, item) => total + (item.giaBan * item.soLuong),
        0
      );

      // Xử lý dữ liệu hóa đơn
      const hoaDonData = {
        id: response.data.id,
        ma: response.data.ma,
        order_on: response.data.ngayTao,
        user: response.data.tenNguoiNhan,
        user_phone: response.data.sdtNguoiNhan,
        diaChi: response.data.diaChi || "Tại Quầy",
        tongTienGoc: tongTienSanPham, // Tổng tiền sản phẩm
        soTienGiam: response.data.soTienGiam || 0, // Số tiền giảm giá
        tongTien: response.data.tongTien, // Tổng tiền thanh toán từ API
        hinhThucMua: response.data.hinhThucMua === 1 ? "Tại quầy" : "Online",
        hinhThucThanhToan: getPaymentMethodText(response.data.hinhThucThanhToan),
        products: response.data.items.map(item => ({
          id: item.id,
          tenGiay: item.giayChiTietEntity?.giayEntity?.ten,
          mauSac: item.giayChiTietEntity?.mauSacEntity?.ten,
          kichCo: item.giayChiTietEntity?.kichCoEntity?.ten,
          giaBan: item.giaBan,
          soLuong: item.soLuong,
          hinhAnh: item.giayChiTietEntity?.giayEntity?.anhGiayEntities?.[0]?.tenUrl
        })),
        // Thêm thông tin giảm giá
        chuongTrinhGiamGiaChiTietHoaDons: response.data.chuongTrinhGiamGiaChiTietHoaDons || []
      };

      setDataHoaDonChiTiet(hoaDonData);
      setIsPopupVisible(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      message.error("Không thể lấy thông tin chi tiết hóa đơn!");
    }
  };
  const handleOrderClick = async (orderId) => {
    if (!orderId) {
      console.error("Order ID không hợp lệ");
      message.error("Không tìm thấy ID hóa đơn!");
      return;
    }

    await fetchHoaDonChiTiet(orderId);

    togglePopup();
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleDateChange = (date, dateString) => {
    console.log("Selected Date:", dateString);
    setDateFilter(date ? moment(date).startOf("day") : null);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const getFilteredData = () => {
    if (!data) {
      console.error("Dữ liệu nguồn là undefined");
      return [];
    }

    return data.filter((item) => {
      const matchesStatus = !statusFilter || item.status === statusFilter;

      let matchesDate = true;
      if (dateFilter) {
        const itemDate = moment(item.order_on, "DD/MM/YYYY").startOf("day");
        matchesDate = itemDate.isSame(dateFilter, "day");
      }

      // Kiểm tra nếu phoneFilter tồn tại thì phải khớp với số điện thoại
      const matchesPhone =
        !phoneFilter || item.user_phone.includes(phoneFilter);

      return matchesStatus && matchesDate && matchesPhone;
    });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput} // Đảm bảo searchInput được tham chiếu đúng
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });



  const handleEdit = async (record) => {
    try {
      console.log("📌 Record nhận được trong handleEdit:", record);

      if (!record || !record.order_id) {
        throw new Error(
          "❌ Không có order_id! Dữ liệu nhận được: " + JSON.stringify(record)
        );
      }

      // Gọi API lấy chi tiết hóa đơn
      const hoaDon = await detailHoaDon(record.order_id);

      if (!hoaDon) {
        throw new Error("❌ API trả về dữ liệu null hoặc undefined!");
      }

      // Chuyển đổi ngày tạo
      const ngayTao = hoaDon.order_on
        ? moment(hoaDon.order_on, "DD/MM/YYYY")
        : null;

      // Kiểm tra danh sách sản phẩm
      const products = Array.isArray(hoaDon.products) ? hoaDon.products : [];
      console.log("📦 Danh sách sản phẩm trong hóa đơn:", products);

      // Cập nhật dữ liệu vào form
      form.setFieldsValue({
        status: getTrangThaiText(hoaDon.trangThai), // Hiển thị trạng thái đúng
        user: hoaDon.user || "",
        user_phone: hoaDon.user_phone || "",
        order_on: ngayTao,
        soLuong: products.reduce(
          (sum, product) => sum + (product.soLuong || 0),
          0
        ),
        tenGiay: products
          .map((product) => product.tenGiay || "Không xác định")
          .join(", "),
      });

      // Cập nhật trạng thái bản ghi
      setEditingRecord({
        ...hoaDon,
        ngayTao,
        id: hoaDon.id || hoaDon.order_id, // Đảm bảo có ID
      });

      setIsViewOnly(true);
      setIsModalVisible(true);
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết hóa đơn:", error);
      message.error("Có lỗi xảy ra khi lấy chi tiết hóa đơn!");
    }
  };
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      console.log("Values to Update:", values);

      const trangThaiMoi = chuyenDoiTrangThai(values.status);
      const totalAmount = editingRecord?.tongTien; // Đảm bảo editingRecord tồn tại
      console.log("editingRecord", editingRecord);

      if (!editingRecord?.id) {
        console.error("Lỗi: Không tìm thấy ID hóa đơn!");
        message.error("Không tìm thấy ID hóa đơn!");
        return;
      }

      if (trangThaiMoi === undefined) {
        console.error("Lỗi: Trạng thái không hợp lệ!", values.status);
        message.error("Trạng thái không hợp lệ!");
        return;
      }

      try {
        console.log("Data sent to updateHoaDon:", {
          trangThai: trangThaiMoi,
          // tongTien: totalAmount,
        });

        await xacNhanHoaDon(editingRecord.id || editingRecord.order_id, {
          trangThai: trangThaiMoi,
        });

        await fetchHoaDon();

        setIsModalVisible(false);
        message.success("Cập nhật thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật hóa đơn chi tiết:", error);
        message.error("Có lỗi xảy ra khi cập nhật hóa đơn chi tiết!");
      }
    });
  };
  const getTrangThaiText = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "cho xac nhan";
      case 1:
        return "hoa don cho thanh toan";
      case 2:
        return "hoan thanh";
      case 3:
        return "da xac nhan";
      case 4:
        return "cho van chuyen";
      case 5:
        return "dang van chuyen";
      case 6:
        return "da giao hang";
      case 7:
        return "tra hang";
      case 8:
        return "huy";
      default:
        return "cho xac nhan"; // Giá trị mặc định nếu không khớp
    }
  };
  const chuyenDoiTrangThai = (trangThai) => {
    switch (trangThai) {
      case "cho xac nhan":
        return 0;
      case "hoa don cho thanh toan":
        return 1;
      case "hoan thanh":
        return 2;
      case "da xac nhan":
        return 3;
      case "cho van chuyen":
        return 4;
      case "dang van chuyen":
        return 5;
      case "da giao hang":
        return 6;
      case "tra hang":
        return 7;
      case "huy":
        return 8;
      default:
        return 0;
    }
  };

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "user",
      key: "user",
      width: 150,
      ...getColumnSearchProps("user"),
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "user_phone",
      key: "user_phone",
      width: 120,
      ...getColumnSearchProps("user_phone"),
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_on",
      key: "order_on",
      width: 100,
      ...getColumnSearchProps("order_on"),
    },
    {
      title: "Hình thức mua",
      dataIndex: "hinhThucMua",
      key: "hinhThucMua",
      width: 100,
      ...getColumnSearchProps("hinhThucMua"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      ...getColumnSearchProps("status"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongTien",
      key: "tongTien",
      width: 100,
      render: (text, record) => {
        // Tính tổng tiền gốc từ danh sách sản phẩm
        const tongTienGoc = record.products && record.products.length > 0
          ? record.products.reduce(
            (total, product) => total + product.soLuong * product.giaBan,
            0
          )
          : record.tongTien + (record.soTienGiam || 0); // Nếu không có products, tính ngược từ tổng tiền và số tiền giảm

        // Nếu có giảm giá, hiển thị cả giá gốc và giá sau giảm
        if (record.soTienGiam > 0) {
          return (
            <div>
              <div className="original-price">
                {tongTienGoc.toLocaleString("vi-VN")}đ
              </div>
              <div className="discounted-price">
                {record.tongTien.toLocaleString("vi-VN")}đ
              </div>
              <div className="discount-amount">
                (Giảm: {record.soTienGiam.toLocaleString("vi-VN")}đ)
              </div>
            </div>
          );
        }
        // Nếu không có giảm giá, chỉ hiển thị giá gốc
        return <span>{record.tongTien?.toLocaleString("vi-VN")}đ</span>;
      },
      sorter: (a, b) => a.tongTien - b.tongTien,
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,

      render: (_, record) => (

        <><Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{ marginRight: "8px" }}
        >
        </Button><Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={() => handleOrderClick(record.order_id)}
          style={{ marginRight: "8px" }}
        >

          </Button>

          <Button
            type="primary"
            icon={<HistoryOutlined />}
            onClick={() => fetchLichSuHoaDonById(record.order_id)}
          >

          </Button>
        </>

      ),
    },
  ];

  const handlePrint = async () => {
    try {
      for (const id of selectedRowKeys) {
        try {
          const response = await printfHoaDonChiTiet(id);

          // Kiểm tra xem response có dữ liệu hợp lệ không
          if (response && response.data) {
            const blob = new Blob([response.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `hoa_don_${id}.pdf`;
            link.click();
          } else {
            throw new Error("Không nhận được dữ liệu PDF hợp lệ");
          }
        } catch (error) {
          console.error(`Lỗi khi in hóa đơn ${id}:`, error);
          message.error(`Không thể in hóa đơn ${id}. Vui lòng thử lại sau.`);
        }
      }
      message.success(`Đã xử lý ${selectedRowKeys.length} yêu cầu in hóa đơn.`);
    } catch (error) {
      console.error("Lỗi khi xử lý in hóa đơn:", error);
      message.error(
        "Có lỗi xảy ra khi xử lý in hóa đơn. Vui lòng thử lại sau."
      );
    }
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  // Hàm hỗ trợ để hiển thị phương thức thanh toán
  const getPaymentMethodText = (method) => {
    switch (method) {
      case 0:
        return "Tiền mặt";
      case 1:
        return "Chuyển khoản";
      case 2:
        return "Thanh toán khi nhận hàng";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="main-container">
      <div className="hd_content">
        <p style={{ fontSize: "20px" }}>Quản Lí Hóa Đơn</p>
      </div>

      <div className="action_hoadon">
        <div style={{ display: "flex", gap: "30px" }}>
          <div className="filter">
            <p>Lọc theo trạng thái</p>
            <Select
              defaultValue="Tất cả"
              style={{ width: 120 }}
              onChange={handleStatusChange}
              options={[
                { value: "Chờ xác nhận", label: "Chờ xác nhận" },
                { value: "Hóa đơn chờ thanh toán", label: "Hóa đơn chờ thanh toán" },
                { value: "Đã xác nhận", label: "Đã xác nhận" },
                { value: "Chờ vận chuyển", label: "Chờ vận chuyển" },
                { value: "Đang vận chuyển", label: "Đang vận chuyển" },
                { value: "Đã vận chuyển", label: "Đã vận chuyển" },
                { value: "Hoàn thành", label: "Hoàn thành" },
                { value: "Trả hàng", label: "Trả hàng" },
                { value: "Đã hủy", label: "Đã hủy" },
              ]}
            />
          </div>
          <div className="filter">
            <p>Lọc theo ngày</p>
            <DatePicker onChange={handleDateChange} format="DD/MM/YYYY" />
          </div>
          <div className="filter">
            <p>Lọc theo số điện thoại</p>
            <Input
              placeholder="Nhập số điện thoại"
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
              style={{ width: 150 }}
            />
          </div>
        </div>
        <div className="filter_right">
          <Button
            type="primary"
            icon={<HistoryOutlined />}
            onClick={handleHistoryClick}
          >
          </Button>
          <Button
            type="primary"
            onClick={handlePrint}
            disabled={selectedRowKeys.length === 0}
          >
            Print
          </Button>
          {/* <Button type="danger" onClick={handleDelete}>
            Delete
          </Button> */}
        </div>
      </div>
      <div className="order_container">
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          rowKey="key" // Đảm bảo mỗi đối tượng trong dataSource có thuộc tính "key"
          scroll={{ x: 1000 }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => {
              setSelectedRowKeys(keys);
              setSelectAll(keys.length === data.length);
            },
          }}
          pagination={{ pageSize: 5 }} // Thay đổi số lượng hàng trên mỗi trang
        />
      </div>

      <Modal
        title="Chi tiết và Cập nhật Hóa đơn"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="status" label="Trạng thái hiện tại:">
            <Select
              options={[
                { value: "cho xac nhan", label: "Chờ xác nhận" },
                {
                  value: "hoa don cho thanh toan",
                  label: "Hóa đơn chờ thanh toán",
                },
                { value: "hoan thanh", label: "Hoàn thành" },
                { value: "da xac nhan", label: "Đã xác nhận" },
                { value: "cho van chuyen", label: "Chờ vận chuyển" },
                { value: "dang van chuyen", label: "Đang vận chuyển" },
                { value: "da giao hang", label: "Đã giao hàng" },
                { value: "tra hang", label: "Trả hàng" },
                { value: "huy", label: "Đã Hủy" },
              ]}
              disabled={true}
            />
          </Form.Item>
        </Form>



      </Modal>
      {isHistoryPopupVisible && (
        <div className="popup-overlay" onClick={() => setIsHistoryPopupVisible(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="history-popup">
              <h1>Lịch sử hóa đơn</h1>
              <Button style={{ float: "right" }} onClick={() => setIsHistoryPopupVisible(false)}>
                Đóng
              </Button>
              <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Ngày cập nhật</th>
                    <th>Trạng thái cũ</th>
                    <th>Trạng thái mới</th>
                    <th>Người cập nhật</th>
                    <th>Mã Hóa Đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {lichSuHoaDon.map((historyItem, index) => (
                    <tr key={index}>
                      <td>{moment(historyItem.thoiGianCapNhat).format("DD/MM/YYYY")}</td>
                      <td>{mapTrangThai(historyItem.trangThaiCu)}</td>
                      <td>{mapTrangThai(historyItem.trangThaiMoi)}</td>
                      <td>{historyItem.nguoiCapNhat}</td>
                      <td>{historyItem.maHoaDon}</td> {/* Hiển thị mã hóa đơn */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ĐÂY LÀ CODE CỦA PHẦN HÓA ĐƠN CHI TIẾT NHA MỌI NGƯỜI  */}

      {isPopupVisible && (
        <div className="popup-overlay" onClick={togglePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="HoaDonChiTiet">
              <h1>Chi tiết hóa đơn</h1>
            </div>
            <Button style={{ float: "right" }} onClick={togglePopup}>
              Back
            </Button>
            <Button
              style={{ float: "right", marginRight: "10px" }}
              type="primary"
              onClick={handlePrint}
            >
              Print
            </Button>
            {/* Thông tin chi tiết đơn hàng */}
            <div className="thongtinhoadon">
              <div className="trai">
                <h4>Chi Tiết Đơn Hàng </h4>
                <h6>Mã Hóa Đơn: {dataHoaDonChiTiet?.ma || "N/A"}</h6>
                <h6>Ngày Mua: {dataHoaDonChiTiet?.order_on || "N/A"}</h6>
                <h6>
                  Hình Thức Mua: {dataHoaDonChiTiet?.hinhThucMua || "N/A"}
                </h6>
                <h6>
                  Hình Thức Thanh Toán:{" "}
                  {dataHoaDonChiTiet?.hinhThucThanhToan || "N/A"}
                </h6>

                {dataHoaDonChiTiet?.soTienGiam > 0 ? (
                  <>
                    <h6>
                      Tổng Tiền Gốc:{" "}
                      {dataHoaDonChiTiet?.tongTienGoc?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || "N/A"}
                    </h6>
                    <h6>
                      Số Tiền Giảm:{" "}
                      {dataHoaDonChiTiet?.soTienGiam?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || "N/A"}
                    </h6>
                    <h6 className="total-after-discount">
                      Tổng Tiền Thanh Toán:{" "}
                      {dataHoaDonChiTiet?.tongTien?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || "N/A"}
                    </h6>
                  </>
                ) : (
                  <h6>
                    Tổng Tiền:{" "}
                    {dataHoaDonChiTiet?.tongTien?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) || "N/A"}
                  </h6>
                )}
              </div>
              <div className="phai">
                <h4>Thông tin khách hàng</h4>
                <h6>Khách Hàng: {dataHoaDonChiTiet?.user || "N/A"}</h6>
                <h6>Số Điện Thoại: {dataHoaDonChiTiet?.user_phone || "N/A"}</h6>
                <h6>Địa Chỉ: {dataHoaDonChiTiet?.diaChi || "Tại Quầy"}</h6>
              </div>

              {/* Thêm phần hiển thị thông tin giảm giá */}
              {dataHoaDonChiTiet?.chuongTrinhGiamGiaChiTietHoaDons &&
                dataHoaDonChiTiet.chuongTrinhGiamGiaChiTietHoaDons.length > 0 && (
                  <div className="giamgia">
                    <h4>Thông tin giảm giá</h4>
                    {dataHoaDonChiTiet.chuongTrinhGiamGiaChiTietHoaDons.map((giamGia, index) => (
                      <div key={index}>
                        <h6>Mã giảm giá: {giamGia.chuongTrinhGiamGiaHoaDonEntity?.ten || "N/A"}</h6>
                        <h6>Phần trăm giảm: {giamGia.chuongTrinhGiamGiaHoaDonEntity?.phanTramGiam || 0}%</h6>
                        <h6>Số tiền đã giảm: {giamGia.soTienDaGiam?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }) || "N/A"}</h6>
                        <h6>Điều kiện áp dụng: {giamGia.chuongTrinhGiamGiaHoaDonEntity?.dieuKien?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }) || "N/A"}</h6>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Thông tin các sản phẩm trong đơn hàng */}
            <div>
              <table
                border="1"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Màu sắc</th>
                    <th>Kích cỡ</th>
                    <th>Giá bán</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {dataHoaDonChiTiet?.products.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={product.hinhAnh || "/placeholder.jpg"}
                          alt={product.tenGiay || "Hình ảnh sản phẩm"}
                          style={{
                            width: "50px",
                            height: "50px",
                            marginRight: "5px",
                          }}
                        />
                        {product.tenGiay || "N/A"}
                      </td>
                      <td>{product.mauSac || "N/A"}</td>
                      <td>{product.kichCo || "N/A"}</td>
                      <td>
                        {product.giaBan?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }) || "N/A"}
                      </td>
                      <td>{product.soLuong || 0}</td>
                      <td>
                        {(product.soLuong * product.giaBan)?.toLocaleString(
                          "vi-VN",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        ) || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" style={{ textAlign: "right" }}>
                      <strong>Tổng tiền hàng:</strong>
                    </td>
                    <td>
                      <strong>
                        {dataHoaDonChiTiet?.tongTienGoc?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </strong>
                    </td>
                  </tr>
                  {dataHoaDonChiTiet?.soTienGiam > 0 && (
                    <>
                      <tr>
                        <td colSpan="5" style={{ textAlign: "right" }}>
                          <span>Giảm giá:</span>
                        </td>
                        <td>
                          <span className="discount-amount-table">
                            -{dataHoaDonChiTiet.soTienGiam.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </td>
                      </tr>
                      <tr className="total-after-discount-row">
                        <td colSpan="5" style={{ textAlign: "right" }}>
                          <strong>Thành tiền:</strong>
                        </td>
                        <td>
                          <strong className="final-total">
                            {dataHoaDonChiTiet.tongTien.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </strong>
                        </td>
                      </tr>
                    </>
                  )}
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyHoaDon;
