import React, { useEffect, useState } from 'react'
import { addKhachHang, deleteKhachHang, detailKhachHang, getAllKhachHang, updateKhachHang, importExcel } from '../service/KhachHangService';
import { Button, Form, Input, message, Modal, Radio, Select, Space, Table, DatePicker, Drawer } from 'antd';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { DownloadOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const KhachHang = () => {
    const [khachHang, setKhachHang] = useState([]);
    const [value, setValue] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [hoTen, setHoTen] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [email, setEmail] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false); // Adjusted default state
    const [editingKhachHang, setEditingKhachHang] = useState(null);
    const [activeChatLieu, setActiveChatLieu] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [ngaySinh, setNgaySinh] = useState(null);
    const [soDienThoai, setSoDienThoai] = useState("");
    const [importFile, setImportFile] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const getActiveChatLieu = () => {
        return khachHang.filter(item => item.TRANG_THAI === 0);
    }
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const trangThai = (status) => {
        return status === 0 ? "Đang sử dụng" : "Không sử dụng";
    };


    useEffect(() => {
        getKhachHangData();
    }, []);


    const getKhachHangData = async () => {
        try {
            const result = await getAllKhachHang();
            console.log(result);

            const loadTable = result.data
                .filter(item => item.userRoleEntities.some(role => role.roleEntity.ten === 'ROLE_USER')) // Lọc ROLE_USER
                .map((item, index) => ({
                    key: index,
                    ID: item.id,
                    MA: item.ma,
                    HOTEN: item.hoTen,
                    MATKHAU: item.matKhau,
                    EMAIL: item.email,
                    TRANG_THAI: item.trangThai || 0, // Mặc định là 0 nếu null
                    SODIENTHOAI: item.soDienThoai,
                    NGAYSINH: item.ngaySinh,
                    ANH: item.anh
                }));

            console.log(loadTable);
            const activeChatLieuData = loadTable.filter(item => item.TRANG_THAI === 0);
            setActiveChatLieu(activeChatLieuData);
            setKhachHang(loadTable);

        } catch (error) {
            message.error("Lỗi khi tải dữ liệu khách hàng");
        }
    };

    const createKhachHang = async () => {
        if (!hoTen || !matKhau || !email) {
            message.error("Không được để trống các trường bắt buộc");
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(matKhau, salt);
        const newTrangThai = value === 1 ? 0 : 1;
        const newData = {
            hoTen,
            matKhau: hashedPassword,
            email,
            trangThai: newTrangThai,
            roleNames: ['ROLE_USER'],
            ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
            soDienThoai,
        };

        try {
            await addKhachHang(newData, selectedFile);
            message.success("Thêm khách hàng thành công!");
            getKhachHangData();
            resetForm();
        } catch (error) {
            message.error("Lỗi khi thêm khách hàng");
        }
    };

    const removeKhachHang = async (record) => {
        try {
            const userDto = {
                id: record.ID,
                hoTen: record.HOTEN,
                email: record.EMAIL,
                matKhau: record.MATKHAU,
                trangThai: record.TRANG_THAI,
                soDienThoai: record.SODIENTHOAI,
                ngaySinh: record.NGAYSINH,
                anh: record.ANH
            };

            await deleteKhachHang(userDto);
            message.success("Xóa thành công!");
            getKhachHangData();
        } catch (error) {
            message.error("Lỗi khi xóa khách hàng: " + (error.response?.data?.message || error.message));
        }
    };

    const detail = async (record) => {
        try {
            const response = await detailKhachHang(record.ID);
            const khachHang = response.data;
            setEditingKhachHang(khachHang);
            setHoTen(khachHang.hoTen);
            setEmail(khachHang.email);
            setMatKhau(khachHang.matKhau);
            setValue(khachHang.trangThai === 0 ? 1 : 2);
            setNgaySinh(khachHang.ngaySinh ? moment(khachHang.ngaySinh) : null);
            setSoDienThoai(khachHang.soDienThoai || "");

            setIsModalVisible(true);
        } catch (error) {
            message.error("Lỗi khi lấy chi tiết khách hàng");
        }
    };

    const editKhachHangButton = async () => {
        if (!hoTen || !email) {
            message.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const newDataKhachHang = {
            id: editingKhachHang.id,
            hoTen,
            email,
            soDienThoai,
            ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
            trangThai: value === 1 ? 0 : 1,
            roleNames: ['ROLE_USER'],
        };

        try {
            await updateKhachHang(newDataKhachHang);
            message.success("Cập nhật khách hàng thành công");
            getKhachHangData();
            setIsModalVisible(false);
            resetForm();
        } catch (error) {
            message.error("Lỗi cập nhật khách hàng: " + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setHoTen("");
        setEmail("");
        setMatKhau("");
        setValue(1);

        setEditingKhachHang(null);
        setSelectedFile(null);
        setNgaySinh(null);
        setSoDienThoai("");
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleImportFileChange = (e) => {
        setImportFile(e.target.files[0]);
    };

    const handleImportExcel = async () => {
        if (!importFile) {
            message.error("Vui lòng chọn file Excel để import");
            return;
        }

        if (!importFile.name.endsWith('.xlsx') && !importFile.name.endsWith('.xls')) {
            message.error("File phải có định dạng Excel (.xlsx hoặc .xls)");
            return;
        }

        try {
            await importExcel(importFile);
            message.success("Import dữ liệu thành công!");
            getKhachHangData(); // Refresh data
            setImportFile(null); // Reset file input
        } catch (error) {
            message.error("Lỗi khi import dữ liệu: " + (error.response?.data || "Đã xảy ra lỗi"));
        }
    };

    const showDrawer = () => {
        setIsDrawerVisible(true);
        resetForm();
    };

    const closeDrawer = () => {
        setIsDrawerVisible(false);
        resetForm();
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Quản lý khách hàng</h1>
            {/* Header Actions */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                {/* Left side - Add Customer Button */}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showDrawer}
                >
                    Thêm Khách Hàng
                </Button>

                {/* Right side - Import Excel */}
                <Space style={{ flex: 1 }}>
                    <Button
                        icon={<DownloadOutlined />}
                        href="/public/excel/Export_User.xlsx"
                        download
                    >
                        Tải File Mẫu Excel
                    </Button>
                    <input
                        type="file"
                        onChange={handleImportFileChange}
                        accept=".xlsx,.xls"
                        style={{
                            padding: '4px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px'
                        }}
                    />
                    <Button
                        type="primary"
                        onClick={handleImportExcel}
                        disabled={!importFile}
                        icon={<UploadOutlined />}
                    >
                        Import Excel
                    </Button>
                </Space>
            </div>

            {/* Table Section */}
            <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                width: '100%'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Danh sách khách hàng</h2>
                <Table
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                    columns={[
                        {
                            title: 'Ảnh',
                            dataIndex: 'ANH',
                            key: 'ANH',
                            width: 100,
                            render: (text) => text ? (
                                <img
                                    src={text}
                                    alt="Ảnh đại diện"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        border: '2px solid #f0f0f0'
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#999'
                                    }}
                                >
                                    No Image
                                </div>
                            )
                        },
                        {
                            title: 'Họ tên',
                            dataIndex: 'HOTEN',
                        },
                        {
                            title: 'Email',
                            dataIndex: 'EMAIL',
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'TRANG_THAI',
                            render: (text, record) => trangThai(record.TRANG_THAI)
                        },
                        {
                            title: 'Số điện thoại',
                            dataIndex: 'SODIENTHOAI',
                            key: 'SODIENTHOAI'
                        },
                        {
                            title: 'Ngày sinh',
                            dataIndex: 'NGAYSINH',
                            key: 'NGAYSINH',
                            render: (text) => text ? moment(text).format('DD/MM/YYYY') : 'Chưa có'
                        },
                        {
                            title: 'Thao tác',
                            key: 'action',
                            render: (text, record) => (
                                <Space size="middle">
                                    <Button onClick={() => detail(record)}>Chi tiết</Button>
                                    <Button onClick={() => removeKhachHang(record)}>Xóa</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={khachHang}
                />
            </div>

            {/* Add Customer Drawer */}
            <Drawer
                title="Thêm Khách Hàng Mới"
                placement="right"
                width={520}
                onClose={closeDrawer}
                open={isDrawerVisible}
                extra={
                    <Space>
                        <Button onClick={closeDrawer}>Hủy</Button>
                        <Button type="primary" onClick={createKhachHang}>
                            Thêm
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical">
                    <Form.Item label="Tên Khách Hàng" required>
                        <Input value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Mật Khẩu" required>
                        <Input.Password value={matKhau} onChange={(e) => setMatKhau(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Email" required>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Số Điện Thoại">
                        <Input value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Ngày Sinh">
                        <DatePicker
                            value={ngaySinh}
                            onChange={(date) => setNgaySinh(date)}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item label="Ảnh đại diện">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        {selectedFile && (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    marginTop: '10px',
                                    borderRadius: '4px'
                                }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Trạng thái">
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio value={0}>Đang sử dụng</Radio>
                            <Radio value={1}>Không sử dụng</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Drawer>

            {/* Edit Modal */}
            <Modal
                title="Cập nhật Khách Hàng"
                open={isModalVisible}
                onOk={editKhachHangButton}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form>
                    <Form.Item label="Tên Khách Hàng">
                        <Input value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Trạng Thái">
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio value={0}>Đang sử dụng</Radio>
                            <Radio value={1}>Không sử dụng</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Số Điện Thoại">
                        <Input value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Ngày Sinh">
                        <DatePicker
                            value={ngaySinh}
                            onChange={(date) => setNgaySinh(date)}
                        />
                    </Form.Item>
                    <Form.Item label="Ảnh đại diện">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        {selectedFile && (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                            />
                        )}
                        {editingKhachHang?.anh && !selectedFile && (
                            <img
                                src={editingKhachHang.anh}
                                alt="Current"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default KhachHang;