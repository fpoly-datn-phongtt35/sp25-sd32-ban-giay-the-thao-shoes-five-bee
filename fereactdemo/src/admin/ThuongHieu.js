import React, { useEffect, useState } from 'react';
import { addThuongHieu, deleteThuongHieu, getThuongHieu, updateThuongHieu } from '../service/ThuongHieuService';
import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd';

const ThuongHieu = () => {
    const [thuongHieu, setThuongHieu] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [ten, setTen] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [value, setValue] = useState(1);
    const [edittingThuongHieu, setEdittingThuongHieu] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho từ khóa tìm kiếm

    const getActiveChatLieu = () => {
        return thuongHieu.filter(item => item.TRANG_THAI === 0);
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const trangThai = (status) => {
        return status === 0 ? "Hoạt động" : "Không hoạt động";
    };

    useEffect(() => {
        getAllThuongHieu();
    }, []);

    const getAllThuongHieu = async () => {
        try {
            const result = await getThuongHieu();
            const thuongHieuDaTa = result.data.map((item, index) => ({
                key: index,
                ID: item.id,
                TEN: item.ten,
                TRANG_THAI: item.trangThai,
            }));
            setThuongHieu(thuongHieuDaTa);
        } catch (error) {
            message.error("Lỗi hiển thị table thương hiệu");
        }
    };

    const creatThuongHieu = async () => {
        if (!ten) {
            message.error("Không được để trống tên thương hiệu");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên thương hiệu không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên thương hiệu phải là chữ cái và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        const newThuongHieu = {
            ten: ten,
            trangThai: newTrangThai,
        };

        try {
            await addThuongHieu(newThuongHieu);
            message.success("Thêm thương hiệu mới thành công");
            getAllThuongHieu();
            setTen("");
            setValue(1);
        } catch (error) {
            message.error((error.response?.data?.message || error.message));
        }
    };

    const removeThuongHieu = async (record) => {
        await deleteThuongHieu(record.ID);
        message.success("Xóa thương hiệu thành công ");
        getAllThuongHieu();
    };

    const editThuongHieu = (record) => {
        setEdittingThuongHieu(record);
        setTen(record.TEN);
        setValue(record.TRANG_THAI === 0 ? 1 : 2);
        setIsModalVisible(true);
    };

    const editThuongHieuButton = async () => {
        if (!ten) {
            message.error("Không được để trống tên thương hiệu");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên thương hiệu không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên thương hiệu phải là chữ cái và không được chứa số!");
            return;
        }

        const updateTrangThai = value === 1 ? 0 : 1;

        if (!edittingThuongHieu?.ID) {
            message.error("Không tìm thấy ID của thương hiệu cần cập nhật!");
            return;
        }

        const updateNewThuongHieu = {
            id: edittingThuongHieu.ID,
            ten: ten,
            trangThai: updateTrangThai,
        };

        try {
            await updateThuongHieu(updateNewThuongHieu);
            message.success("Cập nhật thương hiệu thành công");
            getAllThuongHieu();
            setIsModalVisible(false);
            setTen("");
            setValue(null);
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            message.error("Cập nhật thương hiệu không thành công");
        }
    };

    // Lọc danh sách thương hiệu theo tên
    const filteredThuongHieu = thuongHieu.filter(item => item.TEN.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
                <h1>Quản lý thương hiệu</h1>
                <Input placeholder='Nhập tên thương hiệu để thêm' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={creatThuongHieu}>
                    Thêm
                </Button>
                <br /><br />

                {/* Tìm kiếm theo tên thương hiệu */}
                <Input
                    placeholder="Tìm kiếm thương hiệu theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <br /><br />

                <Table
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                    columns={[
                        {
                            title: 'Tên Thương Hiệu',
                            dataIndex: 'TEN',
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'TRANG_THAI',
                            render: (text, record) => trangThai(record.TRANG_THAI),
                        },
                        {
                            title: 'Thao tác',
                            key: 'action',
                            render: (text, record) => (
                                <Space size="middle">
                                    <Button onClick={() => editThuongHieu(record)}>Cập nhật</Button>
                                    <Button onClick={() => removeThuongHieu(record)}>Xóa</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={filteredThuongHieu} // Sử dụng dữ liệu đã lọc
                />
            </div>
            <Modal title="Update Thương Hiệu" open={isModalVisible} onOk={editThuongHieuButton} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Tên Thương Hiệu">
                        <Input value={ten} onChange={(e) => setTen(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Trạng Thái">
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio value={1}>Hoạt động</Radio>
                            <Radio value={2}>Không hoạt động</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ThuongHieu;
