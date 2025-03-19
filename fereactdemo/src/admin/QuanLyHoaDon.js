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
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import "./quanlyhoadon.css";
import {
  deleteHoaDon,
  detailHoaDon,
  getHoaDon,
  printfHoaDon,
  updateHoaDon,
  xacNhanHoaDon,
} from "../service/HoaDonService";
import moment from "moment";
import {
  deleteHoaDonChiTiet,
  getHoaDonChiTiet1,
  getHoaDonChiTiet,
  printfHoaDonChiTiet,
  updateHoaDonChiTiet,
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
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const mapTrangThai = (trangThai) => {
    switch (trangThai) {
      case 0:
        return "chờ xác nhận";
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

  const fetchHoaDon = async () => {
    try {
      const result = await getHoaDon();
      console.log("Dữ liệu từ API:", result.data);

      if (!Array.isArray(result.data)) {
        console.error("Dữ liệu không phải là mảng");
        setData([]);
        return;
      }
      // hinh thuc mua 0 tien mat 1 vnpay 2 thanh toan khi giao
      // 1 tại quầy 2 online
      const formattedData = result.data.map((item) => ({
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
        hinhThucThanhToan:
          item.hinhThucThanhToan === 0 ? "Chuyển khoản" : "Tiền mặt",
        phiShip: item.phiShip ?? 0, // Phí ship (nếu có)
        soTienGiam: item.soTienGiam ?? 0, // Số tiền giảm giá
        tongTien: item.tongTien, // Tổng tiền thanh toán
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
      }));

      // console.log("Dữ liệu đã định dạng:", formattedData);
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
  }, [dataHoaDonChiTiet]); // Chạy khi dữ liệu cập nhật

  const fetchHoaDonChiTiet = async (id) => {
    if (!id) {
      console.error("ID hóa đơn không hợp lệ!");
      message.error("Không tìm thấy ID hóa đơn!");
      return;
    }

    try {
      const result = await detailHoaDon(id);
      // console.log("Dữ liệu từ API hóa đơn chi tiết:", result);

      if (!result || !Array.isArray(result.items)) {
        console.error("Dữ liệu không hợp lệ hoặc không phải mảng.");
        setDataHoaDonChiTiet([]);
        return;
      }

      // Format dữ liệu
      const formattedData = {
        key: result.id,
        order_id: result.id,
        ma: result.ma,
        user: result.tenNguoiNhan || (result.userDto?.hoTen ?? "Khách lẻ"),
        user_phone:
          result.sdtNguoiNhan || (result.userDto?.soDienThoai ?? "N/A"),
        order_on: result.ngayTao
          ? moment(result.ngayTao).format("DD/MM/YYYY")
          : "N/A",
        status: mapTrangThai(result.trangThai),
        trangThai: result.trangThai,
        diaChi: result.diaChi || "Không có địa chỉ",
        hinhThucMua: result.hinhThucMua === 1 ? "Tại Quầy" : "Online",
        hinhThucThanhToan:
          result.hinhThucThanhToan === 0 ? "Chuyển khoản" : "Tiền mặt",
        phiShip: result.phiShip ?? 0,
        soTienGiam: result.soTienGiam ?? 0,
        tongTien: result.tongTien,
        products: result.items.map((product) => ({
          id: product.id,
          tenGiay: product.giayChiTietEntity.giayEntity.ten,
          mauSac: product.giayChiTietEntity.mauSacEntity.ten,
          kichCo: product.giayChiTietEntity.kichCoEntity.ten,
          soLuong: product.soLuong,
          giaBan: product.giaBan,
          hinhAnh:
            product.giayChiTietEntity.giayEntity.anhGiayEntities?.[0]?.tenUrl ??
            "",
        })),
      };
      console.log("formattedData:", formattedData);

      setDataHoaDonChiTiet(formattedData); // Chuyển thành mảng chứa 1 đối tượng
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
      message.error("Lỗi khi tải dữ liệu hóa đơn!");
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

      // console.log("Item:", item.order_id);
      // console.log("Item date:", item.order_on);
      // console.log(
      //   "Filter date:",
      //   dateFilter ? dateFilter.format("DD/MM/YYYY") : "No filter"
      // );
      // console.log("Matches date:", matchesDate);

      return matchesStatus && matchesDate;
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

  const handleDelete = () => {
    Modal.confirm({
      title:
        "Bạn có chắc chắn muốn xóa các hóa đơn chi tiết và hóa đơn chính liên quan không?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          const allDetails = await getHoaDonChiTiet1();
          const detailsToDelete = allDetails.data.filter((detail) =>
            selectedRowKeys.includes(detail.hoaDon.id)
          );

          for (const detail of detailsToDelete) {
            await deleteHoaDonChiTiet(detail.id);
          }

          for (const key of selectedRowKeys) {
            await deleteHoaDon(key);
          }

          await fetchHoaDon();
          setSelectedRowKeys([]);
          setSelectAll(false);
          message.success("Xóa thành công!");
        } catch (error) {
          console.error(
            "Lỗi khi xóa hóa đơn chi tiết và hóa đơn chính:",
            error
          );
          message.error(
            "Có lỗi xảy ra khi xóa hóa đơn chi tiết và hóa đơn chính!"
          );
        }
      },
    });
  };

  const handleDeleteSingle = async (record) => {
    try {
      Modal.confirm({
        title:
          "Bạn có chắc chắn muốn xóa hóa đơn này và các hóa đơn chi tiết liên quan không?",
        okText: "Có",
        cancelText: "Không",
        onOk: async () => {
          try {
            const detailResponse = await getHoaDonChiTiet1();
            const details = detailResponse.data.filter(
              (item) => item.hoaDon.id === record.order_id
            );

            for (const detail of details) {
              await deleteHoaDonChiTiet(detail.id);
            }

            await deleteHoaDon(record.order_id);

            await fetchHoaDon();
            setSelectedRowKeys((prevKeys) =>
              prevKeys.filter((key) => key !== record.order_id)
            );
            message.success("Xóa thành công");
          } catch (error) {
            console.error("Lỗi khi xóa hóa đơn và hóa đơn chi tiết:", error);
            message.error("Có lỗi xảy ra khi xóa hóa đơn và hóa đơn chi tiết!");
          }
        },
      });
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      message.error("Có lỗi xảy ra khi xóa hóa đơn!");
    }
  };
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectedRowKeys(checked ? data.map((item) => item.key) : []);
    setSelectAll(checked);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      width: 120,
      ...getColumnSearchProps("order_id"),
      ellipsis: true,
      render: (text, record) => (
        <a href="#" onClick={() => handleOrderClick(record.order_id)}>
          {text}
        </a>
      ),
    },
    {
      title: "User Name",
      dataIndex: "user",
      key: "user",
      width: 150,
      ...getColumnSearchProps("user"),
      ellipsis: true,
    },
    {
      title: "User Phone",
      dataIndex: "user_phone",
      key: "user_phone",
      width: 120,
      ...getColumnSearchProps("user_phone"),
    },
    // {
    //     title: "Products",
    //     key: "products",
    //     render: (text, record) => {
    //         return (
    //             <div>
    //                 {record.products.map((product, index) => (
    //                     <div key={index}>
    //                         <p><strong>Tên sản phẩm:</strong> {product.tenGiay || "N/A"}</p>
    //                         <p><strong>Màu sắc:</strong> {product.mauSac || "N/A"}</p>
    //                         <p><strong>Kích cỡ:</strong> {product.kichCo || "N/A"}</p>
    //                         <p><strong>Số lượng:</strong> {product.soLuong || 0}</p>
    //                     </div>
    //                 ))}
    //                 <p><strong>Tổng Tiền: {record.tongTien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong></p>
    //             </div>
    //         );
    //     },
    // },
    {
      title: "Ordered On",
      dataIndex: "order_on",
      key: "order_on",
      width: 100,
      ...getColumnSearchProps("order_on"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      ...getColumnSearchProps("status"),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          {/* <Button type="danger" size="small" onClick={() => handleDeleteSingle(record)}>
                        Xóa
                    </Button> */}
        </Space>
      ),
    },
  ];

  const handleRowSelect = (key) => {
    const newSelectedRowKeys = selectedRowKeys.includes(key)
      ? selectedRowKeys.filter((item) => item !== key)
      : [...selectedRowKeys, key];
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectAll(newSelectedRowKeys.length === data.length);
  };
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

  return (
    <div>
      <div className="hd_content">
        <p style={{ fontSize: "20px" }}>Quản Lí Hóa Đơn</p>
      </div>
      <div className="action_hoadon">
        <div style={{ display: "flex", gap: "30px" }}>
          <div className="filter">
            <p>Filter by Status</p>
            <Select
              defaultValue="---All---"
              style={{ width: 120 }}
              onChange={handleStatusChange}
              options={[
                { value: "Đã đặt", label: "Đã đặt" },
                { value: "Đã đóng gói", label: "Đã đóng gói" },
                { value: "Đang giao", label: "Đang giao" },
                { value: "Đã thanh toán", label: "Đã thanh toán" },
                { value: "Đã hủy", label: "Đã hủy" },
              ]}
            />
          </div>
          <div className="filter">
            <p>Filter by Date</p>
            <DatePicker onChange={handleDateChange} format="DD/MM/YYYY" />
          </div>
        </div>
        <div className="filter_right">
          <Button
            type="primary"
            onClick={handlePrint}
            disabled={selectedRowKeys.length === 0}
          >
            Print
          </Button>
          <Button type="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <div className="order_container">
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          rowKey="key" // Đảm bảo mỗi đối tượng trong dataSource có thuộc tính "key"
          scroll={{ x: 1250 }}
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
          <Form.Item name="status" label="Trạng thái">
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
            />
          </Form.Item>
        </Form>
      </Modal>

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
              style={{ float: "right" }}
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
                  HÌnh Thức Thanh Toán :{" "}
                  {dataHoaDonChiTiet?.hinhThucThanhToan || "N/A"}
                </h6>

                <h6>
                  Tổng Tiền:{" "}
                  {dataHoaDonChiTiet?.tongTien?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) || "N/A"}
                </h6>
              </div>
              <div className="phai">
                <h4>Thông tin khách hàng</h4>
                <h6>Tên Khách Hàng: {dataHoaDonChiTiet?.user || "N/A"}</h6>
                <h6>Số Điện Thoại: {dataHoaDonChiTiet?.user_phone || "N/A"}</h6>
                <h6>Địa Chỉ: {dataHoaDonChiTiet?.diaChi || "Tại Quầy"}</h6>
              </div>
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
                      <strong>Tổng cộng:</strong>
                    </td>
                    <td>
                      <strong>
                        {dataHoaDonChiTiet?.products
                          .reduce(
                            (total, product) =>
                              total + product.soLuong * product.giaBan,
                            0
                          )
                          .toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                      </strong>
                    </td>
                  </tr>
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
