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
import { deleteHoaDon, detailHoaDon, getHoaDon, printfHoaDon, updateHoaDon } from "../service/HoaDonService";
import moment from 'moment';
import { deleteHoaDonChiTiet, getHoaDonChiTiet1, getHoaDonChiTiet, printfHoaDonChiTiet, updateHoaDonChiTiet } from "../service/HoaDonChiTietService";
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
    const [statusFilter, setStatusFilter] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState();
    const [isPopupVisible, setIsPopupVisible] = useState(false);




    const mapTrangThai = (trangThai) => {
        switch (trangThai) {
            case 0:
                return "Đã đặt";
            case 1:
                return "Đã đóng gói";
            case 2:
                return "Đang giao";
            case 3:
                return "Hoàn thành";
            case 4:
                return "Đã hủy";
            default:
                return "Trả hàng";
        }
    };
    useEffect(() => {
        fetchHoaDon();
    }, [statusFilter, dateFilter]);

    const fetchHoaDon = async () => {
        try {
            const result = await getHoaDonChiTiet1();
            console.log("Dữ liệu từ API:", result.data);

            if (!Array.isArray(result.data)) {
                console.error("Dữ liệu không phải là mảng");
                setData([]);
                return;
            }

            const formattedData = result.data.reduce((acc, item) => {
                if (!item || !item.hoaDon) {
                    console.error("Dữ liệu không hợp lệ:", item);
                    return acc;
                }

                const existingOrder = acc.find(order => order.order_id === item.hoaDon.id);
                const khachHang = item.hoaDon.khachHang || {};

                if (existingOrder) {
                    existingOrder.products.push({
                        tenGiay: item.giayChiTiet && item.giayChiTiet.giay ? item.giayChiTiet.giay.ten : null,
                        mauSac: item.giayChiTiet && item.giayChiTiet.mauSac ? item.giayChiTiet.mauSac.ten : null,
                        kichCo: item.giayChiTiet && item.giayChiTiet.kichCo ? item.giayChiTiet.kichCo.ten : null,
                        giaBan: item.giayChiTiet && item.giayChiTiet ? item.giayChiTiet.giaBan : null,
                        soLuong: item.soLuong,

                    });
                } else {
                    acc.push({
                        key: item.hoaDon.id,
                        order_id: item.hoaDon.id,
                        ma: item.hoaDon.ma,
                        user: khachHang.hoTen || item.hoaDon.hoTenKhachHang || "Khách lẻ",
                        user_phone: khachHang.soDienThoai || item.hoaDon.soDienThoaiKhachHang || "N/A",
                        order_on: item.hoaDon.ngayTao ? moment(item.hoaDon.ngayTao).format('DD/MM/YYYY') : 'N/A',
                        status: mapTrangThai(item.hoaDon.trangThai),
                        trangThai: item.hoaDon.trangThai,
                        diaChi: item.hoaDon.diaChi,
                        hinhThucMua: item.hoaDon.hinhThucMua === 0 ? 'Online' : 'Tại quầy',
                        hinhThucThanhToan: item.hoaDon.hinhThucThanhToan === 0 ? 'Chuyển khoản' : 'Tiền mặt',

                        products: [{
                            tenGiay: item.giayChiTiet && item.giayChiTiet.giay ? item.giayChiTiet.giay.ten : null,
                            mauSac: item.giayChiTiet && item.giayChiTiet.mauSac ? item.giayChiTiet.mauSac.ten : null,
                            kichCo: item.giayChiTiet && item.giayChiTiet.kichCo ? item.giayChiTiet.kichCo.ten : null,
                            giaBan: item.giayChiTiet && item.giayChiTiet ? item.giayChiTiet.giaBan : null,

                            soLuong: item.soLuong,
                        }],
                        tongTien: item.hoaDon.tongTien,
                    });
                }
                return acc;
            }, []);

            console.log("Dữ liệu đã định dạng:", formattedData);
            setData(formattedData);
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu: ", error);
            message.error("Lỗi khi tải dữ liệu!");
        }
    };



    const handleStatusChange = (value) => {
        setStatusFilter(value);
    };

    const handleDateChange = (date, dateString) => {
        console.log("Selected Date:", dateString);
        setDateFilter(date ? moment(date).startOf('day') : null);
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
                const itemDate = moment(item.order_on, 'DD/MM/YYYY').startOf('day');
                matchesDate = itemDate.isSame(dateFilter, 'day');
            }

            console.log('Item:', item.order_id);
            console.log('Item date:', item.order_on);
            console.log('Filter date:', dateFilter ? dateFilter.format('DD/MM/YYYY') : 'No filter');
            console.log('Matches date:', matchesDate);

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
            setEditingRecord({
                ...record,
                ngayTao: moment(record.order_on, 'DD/MM/YYYY'),
            });
            form.setFieldsValue({
                status: record.status,
                user: record.user,
                user_phone: record.user_phone,
                order_on: moment(record.order_on, 'DD/MM/YYYY'),
                soLuong: record.products.reduce((sum, product) => sum + product.soLuong, 0), // Tổng số lượng sản phẩm
                tenGiay: record.products.map(product => product.tenGiay).join(', '), // Danh sách tên sản phẩm
            });
            setIsViewOnly(true);
            setIsModalVisible(true);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết hóa đơn chi tiết:", error);
            message.error("Có lỗi xảy ra khi lấy chi tiết hóa đơn chi tiết!");
        }
    };

    const handleSave = () => {
        form.validateFields().then(async (values) => {
            console.log("Values to Update:", values);

            const trangThaiMoi = chuyenDoiTrangThai(values.status);
            const totalAmount = editingRecord.tongTien;
            try {
                console.log("Data sent to updateHoaDon:", {
                    trangThai: trangThaiMoi,
                    tongTien: totalAmount,
                });

                await updateHoaDon(editingRecord.order_id, {
                    trangThai: trangThaiMoi,
                    tongTien: totalAmount,
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

    const chuyenDoiTrangThai = (trangThai) => {
        switch (trangThai) {
            case "Đã đặt": return 0;
            case "Đã đóng gói": return 1;
            case "Đang giao": return 2;
            case "Đã thanh toán": return 3;
            case "Đã hủy": return 4;
            default: return 0;
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa các hóa đơn chi tiết và hóa đơn chính liên quan không?",
            okText: "Có",
            cancelText: "Không",
            onOk: async () => {
                try {
                    const allDetails = await getHoaDonChiTiet1();
                    const detailsToDelete = allDetails.data.filter(detail => selectedRowKeys.includes(detail.hoaDon.id));

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
                    console.error("Lỗi khi xóa hóa đơn chi tiết và hóa đơn chính:", error);
                    message.error("Có lỗi xảy ra khi xóa hóa đơn chi tiết và hóa đơn chính!");
                }
            },
        });
    }

    const handleDeleteSingle = async (record) => {
        try {
            Modal.confirm({
                title: "Bạn có chắc chắn muốn xóa hóa đơn này và các hóa đơn chi tiết liên quan không?",
                okText: "Có",
                cancelText: "Không",
                onOk: async () => {
                    try {
                        const detailResponse = await getHoaDonChiTiet1();
                        const details = detailResponse.data.filter(item => item.hoaDon.id === record.order_id);

                        for (const detail of details) {
                            await deleteHoaDonChiTiet(detail.id);
                        }

                        await deleteHoaDon(record.order_id);

                        await fetchHoaDon();
                        setSelectedRowKeys((prevKeys) => prevKeys.filter((key) => key !== record.order_id));
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
                <a
                    href="#"
                    onClick={() => handleOrderClick(record.order_id)}
                >
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
                    <Button type="primary" size="small" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button type="danger" size="small" onClick={() => handleDeleteSingle(record)}>
                        Xóa
                    </Button>
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
                        const blob = new Blob([response.data], { type: 'application/pdf' });
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `hoa_don_${id}.pdf`;
                        link.click();
                    } else {
                        throw new Error('Không nhận được dữ liệu PDF hợp lệ');
                    }
                } catch (error) {
                    console.error(`Lỗi khi in hóa đơn ${id}:`, error);
                    message.error(`Không thể in hóa đơn ${id}. Vui lòng thử lại sau.`);
                }
            }
            message.success(`Đã xử lý ${selectedRowKeys.length} yêu cầu in hóa đơn.`);
        } catch (error) {
            console.error("Lỗi khi xử lý in hóa đơn:", error);
            message.error("Có lỗi xảy ra khi xử lý in hóa đơn. Vui lòng thử lại sau.");
        }
    };
    const handleOrderClick = (orderId) => {
        const selectedOrder = data.find(order => order.order_id === orderId);
        setSelectedOrder(selectedOrder);
        togglePopup();
    };
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    return (
        <div>
            <div className="hd_content">
                <p style={{ fontSize: "20px" }}>QuanLyHoaDon</p>
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
                        <DatePicker
                            onChange={handleDateChange}
                            format="DD/MM/YYYY"
                        />
                    </div>
                </div>
                <div className="filter_right">
                    <Button type="primary" onClick={handlePrint} disabled={selectedRowKeys.length === 0}>
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
                                { value: "Đã đặt", label: "Đã đặt" },
                                { value: "Đã đóng gói", label: "Đã đóng gói" },
                                { value: "Đang giao", label: "Đang giao" },
                                { value: "Đã thanh toán", label: "Đã thanh toán" },
                                { value: "Đã hủy", label: "Đã hủy" },
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
                        <Button style={{ float: "right" }} onClick={togglePopup}>Back</Button>
                        <Button style={{ float: "right" }} type="primary" onClick={handlePrint} >
                            Print
                        </Button>
                        {/* Thông tin chi tiết đơn hàng */}
                        <div className="thongtinhoadon">
                            <div className="trai">
                                <h4>Chi Tiết Đơn Hàng </h4>
                                <h6>Mã Hóa Đơn: {selectedOrder?.ma || 'N/A'}</h6>
                                <h6>Ngày Mua: {selectedOrder?.order_on || 'N/A'}</h6>
                                <h6>Hình Thức Mua: {selectedOrder?.hinhThucMua || 'N/A'}</h6>
                                <h6>HÌnh Thức Thanh Toán : {selectedOrder?.hinhThucThanhToan || 'N/A'}</h6>

                                <h6>Tổng Tiền: {selectedOrder?.tongTien?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}</h6>
                            </div>
                            <div className="phai">
                                <h4>Thông tin khách hàng</h4>
                                <h6>Tên Khách Hàng: {selectedOrder?.user || 'N/A'}</h6>
                                <h6>Số Điện Thoại: {selectedOrder?.user_phone || 'N/A'}</h6>
                                <h6>Địa Chỉ: {selectedOrder?.diaChi || 'Tại Quầy'}</h6>

                            </div>
                        </div>

                        {/* Thông tin các sản phẩm trong đơn hàng */}
                        <div>
                            {/* <h4>Sản phẩm:</h4> */}
                            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                                    {selectedOrder?.products.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.tenGiay}</td>
                                            <td>{product.mauSac}</td>
                                            <td>{product.kichCo}</td>
                                            <td>{product.giaBan?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}</td>
                                            <td>{product.soLuong}</td>
                                            <td>
                                                {(product.soLuong * product.giaBan)?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'right' }}><strong>Tổng cộng:</strong></td>
                                        <td>
                                            <strong>
                                                {selectedOrder?.products.reduce((total, product) => total + (product.soLuong * product.giaBan), 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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