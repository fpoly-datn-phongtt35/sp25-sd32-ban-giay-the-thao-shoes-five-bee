import React, { useEffect, useState } from 'react'
import { getChucVu } from '../service/ChucVuService';
import { addNhanVien, deleteNhanVien, detailNhanVien, getAllNhanVien, updateNhanVien } from '../service/NhanVienService';
import { Button, Form, Input, message, Modal, Radio, Select, Space, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import bcrypt from 'bcryptjs';
const NhanVien = () => {
    const [nhanVien, setNhanVien] = useState([]);
    const [chucVuList, setChucVuList] = useState([]);
    const [value, setValue] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedChucVu, setSelectedChucVu] = useState(null);
    const [ma, setMa] = useState("");
    const [hoTen, setHoTen] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [email, setEmail] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [editingNhanVien, setEditingNhanVien] = useState(null);
    const [activeChatLieu, setActiveChatLieu] = useState([]);
    const getActiveChatLieu = () => {
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
            MA: item.ma,
            HOTEN: item.hoTen,
            MATKHAU: item.matKhau,
            EMAIL: item.email,
            CHUCVU: item.chucVu ? item.chucVu.ten : null,
            TRANG_THAI: item.trangThai,
        }));
        const activeChatLieuData = loadTable.filter(item => item.TRANG_THAI === 0);
        setActiveChatLieu(activeChatLieuData);
        setNhanVien(loadTable);
    };

    const createNhanVien = async () => {
        if (!ma || !hoTen) {
            message.error("Không được để trống ");
            return;
        };
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(matKhau, salt);

        const newTrangThai = value === 1 ? 0 : 1;
        const newData = {
            ma: ma,
            hoTen: hoTen,
            matKhau: hashedPassword,
            email: email,
            trangThai: newTrangThai,
            chucVu: selectedChucVu ? { id: selectedChucVu } : null,
        };
        try {
            await addNhanVien(newData);
            message.success("Thêm nhân viên thành công !");
            getNhanVien();
            setHoTen("");
            setMa("");
            setMatKhau("");
            setEmail("");
            setSelectedChucVu(null);
            setValue(1);
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
            setMa(nhanVien.ma);
            setHoTen(nhanVien.hoTen);
            setEmail(nhanVien.email);
            setMatKhau(nhanVien.matKhau);
            setValue(nhanVien.trangThai === 0 ? 1 : 2);
            setSelectedChucVu(nhanVien.chucVu ? nhanVien.chucVu.id : null);
            setIsModalVisible(true);
        } catch (error) {
            message.error("Lỗi khi lấy chi tiết nhân viên");
        }
    };
    const editNhanVienButton = async () => {
        if (!ma || !hoTen || !email || !matKhau) {
            message.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
        const newDataNhanVien = {
            ma: ma,
            hoTen: hoTen,
            email: email,
            matKhau: matKhau,
            chucVu: selectedChucVu ? { id: selectedChucVu } : null,
            trangThai: value === 1 ? 0 : 1,
        };
        try {
            await updateNhanVien(editingNhanVien.id, newDataNhanVien);
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
        setMa("");
        setHoTen("");
        setEmail("");
        setMatKhau("");
        setValue(1);
        setSelectedChucVu(null);
        setEditingNhanVien(null);
    };
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '60%', marginLeft: '200px', overflow: 'auto' }}>
                <Select placeholder='Chọn Chức Vụ' value={selectedChucVu} onChange={handleChucVuChange}>
                    {Array.isArray(chucVuList) && chucVuList.map(cv => (
                        <Option key={cv.id} value={cv.id}>
                            {cv.ten}
                        </Option>
                    ))}
                </Select>
                <br /><br />
                <Input placeholder='Mã Nhân Viên' value={ma} onChange={(e) => setMa(e.target.value)} />
                <br /><br />
                <Input placeholder='Tên Nhân Viên' value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                <br /><br />
                <Input.Password placeholder='Mật Khẩu' value={matKhau} onChange={(e) => setMatKhau(e.target.value)} />
                <br /><br />
                <Input placeholder='Email@...' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Còn</Radio>
                    <Radio value={2}>Hết</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={createNhanVien}>
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
                        title: 'CHUCVU',
                        dataIndex: 'CHUCVU',
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
                                <Button onClick={() => removeNhanVien(record)}>Delete</Button>
                            </Space>
                        ),
                    },
                ]} dataSource={nhanVien} />
            </div>
            <Modal title="Cập nhật Nhân Viên" onOk={editNhanVienButton} open={isModalVisible} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Mã Nhân Viên">
                        <Input value={ma} onChange={(e) => setMa(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Tên Nhân Viên">
                        <Input value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Mật Khẩu">
                        <Input.Password value={matKhau} onChange={(e) => setMatKhau(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Chức Vụ">
                        <Select placeholder='Chọn Chức Vụ' value={selectedChucVu} onChange={handleChucVuChange}>
                            {Array.isArray(chucVuList) && chucVuList.map(cv => (
                                <Option key={cv.id} value={cv.id}>
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