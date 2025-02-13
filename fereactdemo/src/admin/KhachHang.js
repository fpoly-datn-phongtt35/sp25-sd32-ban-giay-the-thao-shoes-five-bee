import React, { useEffect, useState } from 'react'
import { addKhachHang, deleteKhachHang, detailKhachHang, getAllKhachHang, updateKhachHang } from '../service/KhachHangService';
import { getAllHangKhachHang } from '../service/HangKhachHangService'; // Correct import
import { Button, Form, Input, message, Modal, Radio, Select, Space, Table } from 'antd';
import bcrypt from 'bcryptjs';

const { Option } = Select;

const KhachHang = () => {
    const [khachHang, setKhachHang] = useState([]);
    const [hangKhachHangList, setHangKhachHangList] = useState([]);
    const [value, setValue] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedHangKhachHang, setSelectedHangKhachHang] = useState(null);
    const [ma, setMa] = useState("");
    const [hoTen, setHoTen] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [email, setEmail] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false); // Adjusted default state
    const [editingKhachHang, setEditingKhachHang] = useState(null);
    const [activeChatLieu, setActiveChatLieu] = useState([]);
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

    const handleKhachHangChange = (value) => {
        console.log(value);
        setSelectedHangKhachHang(value);
    }

    useEffect(() => {
        getAllHangKhachHangData();
        getKhachHangData();
    }, []);

    const getAllHangKhachHangData = async () => {
        const result = await getAllHangKhachHang();
        const activeGiay = result.data.filter(item => item.trangThai === 0);
        setHangKhachHangList(activeGiay);
    };

    const getKhachHangData = async () => {
        try {
            const result = await getAllKhachHang();
            const loadTable = result.data.map((item, index) => ({
                key: index,
                ID: item.id,
                MA: item.ma,
                HOTEN: item.hoTen,
                MATKHAU: item.matKhau,
                EMAIL: item.email,
                HANGKHACHHANG: item.hangKhachHang ? item.hangKhachHang.ten : null,
                TRANG_THAI: item.trangThai,
            }));
            const activeChatLieuData = loadTable.filter(item => item.TRANG_THAI === 0);
            setActiveChatLieu(activeChatLieuData);
            setKhachHang(loadTable);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu khách hàng");
        }
    };

    const createKhachHang = async () => {
        if (!ma || !hoTen || !matKhau || !email || !selectedHangKhachHang) {
            message.error("Không được để trống các trường bắt buộc");
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(matKhau, salt);
        const newTrangThai = value === 1 ? 0 : 1;
        const newData = {
            ma,
            hoTen,
            matKhau: hashedPassword,
            email,
            trangThai: newTrangThai,
            hangKhachHang: { id: selectedHangKhachHang },
        };

        try {
            await addKhachHang(newData);
            message.success("Thêm khách hàng thành công!");
            getKhachHangData();
            resetForm();
        } catch (error) {
            message.error("Lỗi khi thêm khách hàng");
        }
    };

    const removeKhachHang = async (record) => {
        try {
            await deleteKhachHang(record.ID);
            message.success("Xóa thành công!");
            getKhachHangData();
        } catch (error) {
            message.error("Lỗi khi xóa khách hàng");
        }
    };

    const detail = async (record) => {
        console.log(record.ID);
        try {
            const response = await detailKhachHang(record.ID);
            const khachHang = response.data;
            setEditingKhachHang(khachHang);
            setMa(khachHang.ma);
            setHoTen(khachHang.hoTen);
            setEmail(khachHang.email);
            setMatKhau(khachHang.matKhau);
            setValue(khachHang.trangThai === 0 ? 1 : 2);
            setSelectedHangKhachHang(khachHang.hangKhachHang ? khachHang.hangKhachHang.id : null);
            setIsModalVisible(true);
        } catch (error) {
            message.error("Lỗi khi lấy chi tiết khách hàng");
        }
    };

    const editKhachHangButton = async () => {
        if (!ma || !hoTen || !email || !matKhau || !selectedHangKhachHang) {
            message.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const newDataKhachHang = {
            ma,
            hoTen,
            email,
            matKhau,
            hangKhachHang: { id: selectedHangKhachHang },
            trangThai: value === 1 ? 0 : 1,
        };

        try {
            await updateKhachHang(editingKhachHang.id, newDataKhachHang);
            message.success("Cập nhật khách hàng thành công");
            getKhachHangData();
            setIsModalVisible(false);
            resetForm();
        } catch (error) {
            message.error("Lỗi cập nhật khách hàng: " + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setMa("");
        setHoTen("");
        setEmail("");
        setMatKhau("");
        setValue(1);
        setSelectedHangKhachHang(null);
        setEditingKhachHang(null);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '60%', marginLeft: '200px', overflow: 'auto' }}>
                <Select placeholder='Chọn Hạng Khách Hàng' value={selectedHangKhachHang} onChange={handleKhachHangChange}>
                    {Array.isArray(hangKhachHangList) && hangKhachHangList.map(hkh => (
                        <Option key={hkh.id} value={hkh.id}>
                            {hkh.ten}
                        </Option>
                    ))}
                </Select>
                <br /><br />
                <Input placeholder='Mã Khách Hàng' value={ma} onChange={(e) => setMa(e.target.value)} />
                <br /><br />
                <Input placeholder='Tên Khách Hàng' value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                <br /><br />
                <Input.Password placeholder='Mật Khẩu' value={matKhau} onChange={(e) => setMatKhau(e.target.value)} />
                <br /><br />
                <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Đang sử dụng</Radio>
                    <Radio value={0}>Không sử dụng</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={createKhachHang}>
                    Add
                </Button>
                <br /><br />
                <Table pagination={{ pageSize: 5, defaultPageSize: 5 }} rowSelection={{ selectedRowKeys, onChange: onSelectChange }} columns={[
                    {
                        title: 'MA',
                        dataIndex: 'MA',
                    },
                    {
                        title: 'HOTEN',
                        dataIndex: 'HOTEN',
                    },
                    {
                        title: 'EMAIL',
                        dataIndex: 'EMAIL',
                    },
                    {
                        title: 'MATKHAU',
                        dataIndex: 'MATKHAU',
                    },
                    {
                        title: 'HANGKHACHHANG',
                        dataIndex: 'HANGKHACHHANG',
                    },
                    {
                        title: 'TRANG THAI',
                        dataIndex: 'trang_thai',
                        render: (text, record) => trangThai(record.TRANG_THAI)
                    },
                    {
                        title: 'ACTION',
                        key: 'action',
                        render: (text, record) => (
                            <Space size="middle">
                                <Button onClick={() => detail(record)}>Detail</Button>
                                <Button onClick={() => removeKhachHang(record)}>Delete</Button>
                            </Space>
                        ),
                    },
                ]} dataSource={khachHang} />
            </div>
            <Modal title="Cập nhật Khách Hàng" onOk={editKhachHangButton} open={isModalVisible} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Mã Khách Hàng">
                        <Input value={ma} onChange={(e) => setMa(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Tên Khách Hàng">
                        <Input value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Mật Khẩu">
                        <Input.Password value={matKhau} onChange={(e) => setMatKhau(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Hạng Khách Hàng">
                        <Select placeholder='Chọn Hạng Khách Hàng' value={selectedHangKhachHang} onChange={handleKhachHangChange}>
                            {Array.isArray(hangKhachHangList) && hangKhachHangList.map(hkh => (
                                <Option key={hkh.id} value={hkh.id}>
                                    {hkh.ten}
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

export default KhachHang;