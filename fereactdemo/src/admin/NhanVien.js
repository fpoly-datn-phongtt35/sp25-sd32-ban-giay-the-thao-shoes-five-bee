import React, { useEffect, useState } from "react";
import { getChucVu } from "../service/ChucVuService";
import {
    addNhanVien,
    deleteNhanVien,
    detailNhanVien,
    getAllNhanVien,
    updateNhanVien,
} from "../service/NhanVienService";
import {
    Button,
    Form,
    Input,
    message,
    Modal,
    Radio,
    Select,
    Space,
    Table,
    DatePicker,
} from "antd";
import { Option } from "antd/es/mentions";
import bcrypt from "bcryptjs";
import moment from "moment";

const NhanVien = () => {

    const [nhanVien, setNhanVien] = useState([]);
    const [value, setValue] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [hoTen, setHoTen] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [email, setEmail] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [editingNhanVien, setEditingNhanVien] = useState(null);
    const [activeNhanVien, setActiveNhanVien] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [ngaySinh, setNgaySinh] = useState(null);
    const [soDienThoai, setSoDienThoai] = useState("");


    const getActiveNhanVien = () => {
        return nhanVien.filter((item) => item.TRANG_THAI === 0);
    };
    const onSelectChange = (newSelectedRowKeys) => {
        console.log("selectedRowKeys changed: ", newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const onChange = (e) => {
        console.log("radio checked", e.target.value);
        setValue(e.target.value);
    };

    const trangThai = (status) => {
        return status === 0 ? "Đang sử dụng" : "Không sử dụng";
    };


    useEffect(() => {
        getNhanVien();
    }, []);

    const getNhanVien = async () => {
        try {
            const result = await getAllNhanVien();
            const loadTable = result.data
                .filter(item => {
                    // Kiểm tra xem người dùng có vai trò ROLE_STAFF không
                    return item.userRoleEntities &&
                        Array.isArray(item.userRoleEntities) &&
                        item.userRoleEntities.some(role =>
                            role.roleEntity &&
                            role.roleEntity.ten === 'ROLE_STAFF'
                        );
                })
                .map((item, index) => ({
                    key: index,
                    ID: item.id,
                    HOTEN: item.hoTen,
                    EMAIL: item.email,
                    ANH: item.anh,
                    TRANG_THAI: item.isEnabled ? 0 : 1,
                    NGAYSINH: item.ngaySinh,
                    SODIENTHOAI: item.soDienThoai,
                }));
            setNhanVien(loadTable);
            const activeNhanVienData = loadTable.filter(item => item.TRANG_THAI === 0);
            setActiveNhanVien(activeNhanVienData);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error);
            message.error("Không thể tải danh sách nhân viên");
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const createNhanVien = async () => {
        if (!hoTen) {
            message.error("Không được để trống họ tên");
            return;
        }
        if (!email) {
            message.error("Không được để trống email");
            return;
        }
        if (!matKhau) {
            message.error("Không được để trống mật khẩu");
            return;
        }

        const userData = {
            hoTen: hoTen,
            email: email,
            matKhau: matKhau,
            isEnabled: value === 1,
            roleNames: ['ROLE_STAFF'],
            ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
            soDienThoai: soDienThoai,
        };

        try {
            await addNhanVien(userData, selectedFile);
            message.success("Thêm nhân viên thành công!");
            getNhanVien();
            resetForm();
        } catch (error) {
            message.error("Lỗi khi thêm nhân viên: " + (error.response?.data?.message || error.message));
        }
    };

    const detail = async (record) => {
        console.log(record.ID);
        try {
            const response = await detailNhanVien(record.ID);
            const nhanVien = response.data;
            setEditingNhanVien(nhanVien);
            setHoTen(nhanVien.hoTen);
            setEmail(nhanVien.email);
            setMatKhau(nhanVien.matKhau);
            setValue(nhanVien.isEnabled ? 1 : 2);
            setIsModalVisible(true);
            setNgaySinh(nhanVien.ngaySinh ? moment(nhanVien.ngaySinh) : null);
            setSoDienThoai(nhanVien.soDienThoai || "");
        } catch (error) {
            message.error("Lỗi khi lấy chi tiết nhân viên");
        }
    };
    const editNhanVienButton = async () => {
        if (!hoTen || !email) {
            message.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
        const newDataNhanVien = {
            id: editingNhanVien.id,
            hoTen: hoTen,
            email: email,
            isEnabled: value === 1,
            roleNames: ['ROLE_STAFF'],
            ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
            soDienThoai: soDienThoai,
        };
        try {
            await updateNhanVien(newDataNhanVien, selectedFile);
            message.success("Cập nhật nhân viên thành công");
            getNhanVien();
            setIsModalVisible(false);
            resetForm();
            setValue(null);
        } catch (error) {
            message.error("Lỗi cập nhật nhân viên: " + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setHoTen("");
        setEmail("");
        setMatKhau("");
        setValue(1);
        setEditingNhanVien(null);
        setSelectedFile(null);
        setNgaySinh(null);
        setSoDienThoai("");
    };

    const removeNhanVien = async (record) => {
        try {
            await deleteNhanVien(record.ID);
            message.success("Xóa nhân viên thành công!");
            getNhanVien();
        } catch (error) {
            message.error("Lỗi khi xóa nhân viên: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '60%', marginLeft: '200px', overflow: 'auto' }}>
                <h1>Quản lý nhân viên</h1>
                <Input placeholder='Tên Nhân Viên' value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                <br /><br />
                <Input placeholder='Email@...' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br /><br />
                <Input.Password placeholder='Mật khẩu' value={matKhau} onChange={(e) => setMatKhau(e.target.value)} />
                <br /><br />
                <Input placeholder='Số Điện Thoại' value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} />
                <br /><br />
                <DatePicker
                    placeholder='Ngày Sinh'
                    value={ngaySinh}
                    onChange={(date) => setNgaySinh(date)}
                    style={{ width: '100%' }}
                />
                <br /><br />
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ marginBottom: '16px' }}
                />
                {selectedFile && (
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '16px' }}
                    />
                )}
                <br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={createNhanVien}>
                    Thêm
                </Button>
                <Button type="default" href="/excel/Import_User.xlsx" download style={{ marginLeft: '8px', textDecoration: 'none' }}>
                    Tải xuống mẫu Excel
                </Button>
                <br /><br />
                <Table
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                    columns={[
                        {
                            title: 'Họ tên',
                            dataIndex: 'HOTEN',
                            key: 'HOTEN'
                        },
                        {
                            title: 'Email',
                            dataIndex: 'EMAIL',
                            key: 'EMAIL'
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
                            title: 'Ảnh',
                            dataIndex: 'ANH',
                            key: 'ANH',
                            render: (text, record) => (
                                <img
                                    src={text}
                                    alt="Ảnh đại diện"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            ),
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'TRANG_THAI',
                            key: 'TRANG_THAI',
                            render: (text) => trangThai(text)
                        },
                        {
                            title: 'Thao tác',
                            key: 'action',
                            render: (text, record) => (
                                <Space size="middle">
                                    <Button onClick={() => detail(record)}>Chi tiết</Button>
                                    <Button onClick={() => removeNhanVien(record)}>Xóa</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={nhanVien}
                    scroll={{ x: 'max-content' }}
                />
            </div>
            <Modal title="Cập nhật Nhân Viên" onOk={editNhanVienButton} open={isModalVisible} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Tên Nhân Viên">
                        <Input value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
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
                        {editingNhanVien?.anh && !selectedFile && (
                            <img
                                src={editingNhanVien.anh}
                                alt="Current"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Trạng Thái">
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio value={1}>Đang sử dụng</Radio>
                            <Radio value={2}>Không sử dụng</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}


export default NhanVien;
