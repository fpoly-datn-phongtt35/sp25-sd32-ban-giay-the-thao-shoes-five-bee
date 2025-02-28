import React, { useEffect, useState } from 'react'
import { getChucVu } from '../service/ChucVuService';
import { addNhanVien, deleteNhanVien, detailNhanVien, getAllNhanVien, updateNhanVien } from '../service/NhanVienService';
import { Button, Form, Input, message, Modal, Radio, Select, Space, Table, DatePicker } from 'antd';
import { Option } from 'antd/es/mentions';
import bcrypt from 'bcryptjs';
import moment from 'moment';

const NhanVien = () => {
    const [nhanVien, setNhanVien] = useState([]);
    const [chucVuList, setChucVuList] = useState([]);
    const [value, setValue] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedChucVu, setSelectedChucVu] = useState(null);
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
        return nhanVien.filter(item => item.TRANG_THAI === 0);
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

    const handleChucVuChange = (value) => {
        console.log(value);
        setSelectedChucVu(value);
    }
    useEffect(() => {
        getAllChucVu();
        getNhanVien();
    }, []);
    const getAllChucVu = async () => {
        const result = await getChucVu();
        const activeGiay = result.data.filter(item => item.trangThai === 0);
        setChucVuList(activeGiay);
    };

    const getNhanVien = async () => {
        const result = await getAllNhanVien();
        const loadTable = result.data.map((item, index) => ({
            key: index,
            ID: item.id,
            HOTEN: item.hoTen,
            EMAIL: item.email,
            ANH: item.anh,
            ROLENAMES: item.roleNames[0],
            TRANG_THAI: item.isEnabled ? 0 : 1,
            NGAYSINH: item.ngaySinh,
            SODIENTHOAI: item.soDienThoai,
        }));
        setNhanVien(loadTable);
        const activeNhanVienData = loadTable.filter(item => item.TRANG_THAI === 0);
        setActiveNhanVien(activeNhanVienData);
    };

    const createNhanVien = async () => {
        if (!hoTen) {
            message.error("Không được để trống họ tên");
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(matKhau, salt);

        const userData = {
            hoTen: hoTen,
            email: email,
            matKhau: hashedPassword,
            isEnabled: value === 1,
            roleNames: selectedChucVu ? [`${selectedChucVu}`] : ['ROLE_USER'],
            ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DD') : null,
            soDienThoai: soDienThoai,
        };

        try {
            await addNhanVien(userData, selectedFile);
            message.success("Thêm nhân viên thành công !");
            getNhanVien();
            resetForm();
        } catch (error) {
            message.error("Lỗi khi thêm nhân viên");
        }
    };

    const removeNhanVien = async (record) => {
        await deleteNhanVien(record.ID);
        message.success("Xóa thành công !");
        getNhanVien();
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
            setSelectedChucVu(nhanVien.roleNames ? nhanVien.roleNames[0] : null);
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
            roleNames: selectedChucVu ? [`${selectedChucVu}`] : ['ROLE_USER'],
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
        setSelectedChucVu(null);
        setEditingNhanVien(null);
        setSelectedFile(null);
        setNgaySinh(null);
        setSoDienThoai("");
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '60%', marginLeft: '200px', overflow: 'auto' }}>
                <Select
                    placeholder='Chọn Chức Vụ'
                    value={selectedChucVu}
                    onChange={handleChucVuChange}
                    style={{ width: '100%' }}
                >
                    {Array.isArray(chucVuList) && chucVuList.map(cv => (
                        <Option key={cv.id} value={cv.ten}>
                            {cv.ten}
                        </Option>
                    ))}
                </Select>
                <br /><br />
                <Input placeholder='Tên Nhân Viên' value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                <br /><br />
                <Input placeholder='Email@...' value={email} onChange={(e) => setEmail(e.target.value)} />
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
                    <Radio value={1}>Đang sử dụng</Radio>
                    <Radio value={2}>Không sử dụng</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={createNhanVien}>
                    Add
                </Button>
                <Button type="default" href="/excel/Import_User.xlsx" download style={{ marginLeft: '8px', textDecoration: 'none' }}>
                    Tải xuống mẫu Excel
                </Button>
                <br /><br />
                <Table
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                    scroll={{ x: "100%" }}  // ✅ Thêm dòng này để fix lỗi
                    columns={[
                        {
                            title: 'Họ tên',
                            dataIndex: 'HOTEN',
                            key: 'HOTEN',
                            width: 200, // Điều chỉnh width hợp lý
                        },
                        {
                            title: 'Email',
                            dataIndex: 'EMAIL',
                            key: 'EMAIL',
                            width: 250, // Cột email thường dài hơn
                        },
                        {
                            title: 'Số điện thoại',
                            dataIndex: 'SODIENTHOAI',
                            key: 'SODIENTHOAI',
                            width: 180,
                        },
                        {
                            title: 'Ngày sinh',
                            dataIndex: 'NGAYSINH',
                            key: 'NGAYSINH',
                            width: 150,
                            render: (text) => text ? moment(text).format('DD/MM/YYYY') : 'Chưa có'
                        },
                        {
                            title: 'Ảnh',
                            dataIndex: 'ANH',
                            key: 'ANH',
                            width: 100,
                            render: (text) => (
                                text ? <img src={text} alt="Ảnh đại diện" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : "Không có"
                            ),
                        },
                        {
                            title: 'Chức vụ',
                            dataIndex: 'ROLENAMES',
                            key: 'ROLENAMES',
                            width: 200,
                            render: (text) => text?.replace('ROLE_', '')
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'TRANG_THAI',
                            key: 'TRANG_THAI',
                            width: 150,
                            render: (text) => trangThai(text)
                        },
                        {
                            title: 'Thao tác',
                            key: 'action',
                            width: 200,
                            render: (text, record) => (
                                <Space size="middle">
                                    <Button onClick={() => detail(record)}>Chi tiết</Button>
                                    <Button onClick={() => removeNhanVien(record)}>Xóa</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={nhanVien}
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
                    <Form.Item label="Chức Vụ">
                        <Select placeholder='Chọn Chức Vụ' value={selectedChucVu} onChange={handleChucVuChange}>
                            {Array.isArray(chucVuList) && chucVuList.map(cv => (
                                <Option key={cv.id} value={cv.ten}>
                                    {cv.ten}
                                </Option>
                            ))}
                        </Select>
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

export default NhanVien