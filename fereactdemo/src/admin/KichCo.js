import React, { useState, useEffect } from 'react';
import { Space, Table, Button, Input, Radio, message, Modal, Form } from 'antd';
import { getSizes, createSize, deleteSize, updateSize } from '../service/KichCoService';

const KichCo = () => {
    const [value, setValue] = useState(1);
    const [ten, setTen] = useState('');
    const [size, setSize] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [editingSize, setEditingSize] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho từ khóa tìm kiếm

    const getActiveChatLieu = () => {
        return size.filter(item => item.TRANG_THAI === 0);
    }

    const convertTrangThai = (status) => {
        return status === 0 ? "Hoạt động" : "Không hoạt động";
    };

    useEffect(() => {
        loadSize();
    }, []);

    const loadSize = async () => {
        try {
            const result = await getSizes();
            const sizeData = result.data.map((item, index) => ({
                key: index,
                ID: item.id,
                TEN: item.ten,
                TRANG_THAI: item.trangThai,
            }));
            setSize(sizeData);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu kích cỡ:", error);
        }
    };

    const handleAdd = async () => {
        if (!ten) {
            message.error('Tên kích cỡ không được bỏ trống!');
            return;
        }
        const sizeValue = parseInt(ten, 10);
        if (isNaN(sizeValue)) {
            message.error('Kích cỡ phải là một số!');
            return;
        }
        if (sizeValue < 3 || sizeValue > 50) {
            message.error('Kích cỡ phải là một số trong khoảng từ 3 đến 50!');
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        const newSize = {
            ten: ten,
            trangThai: newTrangThai
        };

        try {
            await createSize(newSize);
            message.success('Thêm kích cỡ thành công!');
            loadSize();
            setTen("");
            setValue(1);
        } catch (error) {
            message.error(
                (error.response?.data?.message || error.message));
            console.error("Lỗi khi thêm kích cỡ:", error);
        }
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleUpdate = (record) => {
        setEditingSize(record);
        setTen(record.TEN);
        setValue(record.TRANG_THAI === 0 ? 1 : 2);
        setIsModalVisible(true);
    };

    const handleUpdateSubmit = async () => {
        if (!ten) {
            message.error("Mã và tên không được để trống");
            return;
        }

        const sizeValue = parseInt(ten, 10);
        if (isNaN(sizeValue)) {
            message.error("Kích cỡ phải là một số!");
            return;
        }
        if (sizeValue < 3 || sizeValue > 50) {
            message.error("Kích cỡ phải là một số trong khoảng từ 3 đến 50!");
            return;
        }

        const updatedTrangThai = value === 1 ? 0 : 1;

        if (!editingSize?.ID) {
            message.error("Không tìm thấy ID của kích cỡ cần cập nhật!");
            return;
        }

        const updatedSize = {
            id: editingSize.ID,
            ten: sizeValue,
            trangThai: updatedTrangThai,
        };

        try {
            await updateSize(updatedSize);
            message.success("Cập nhật kích cỡ thành công!");
            loadSize();
            setIsModalVisible(false);
            setEditingSize(null);
            setTen("");
            setValue(null);
        } catch (error) {
            console.error("Lỗi khi cập nhật kích cỡ:", error);
            message.error("Lỗi khi cập nhật kích cỡ");
        }
    };

    const handleDelete = async (record) => {
        try {
            await deleteSize(record.ID);
            message.success("Xóa kích cỡ thành công ");
            loadSize();
        } catch (error) {
            message.error("Lỗi khi xóa kích cỡ");
        }
    };

    const onChange = (e) => {
        setValue(e.target.value);
    };

    // Lọc danh sách kích cỡ theo tên
    const filteredSize = size.filter(item => item.TEN.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
                <h1>Quản lý kích cỡ</h1>
                <Input placeholder='Nhập kích cỡ để thêm' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={handleAdd}>
                    Thêm
                </Button>
                <br /><br />

                {/* Tìm kiếm theo tên kích cỡ */}
                <Input
                    placeholder="Tìm kiếm kích cỡ"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <br /><br />

                <Table
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                    columns={[
                        {
                            title: 'Tên Kích Cỡ',
                            dataIndex: 'TEN',
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'TRANG_THAI',
                            render: (text, record) => convertTrangThai(record.TRANG_THAI),
                        },
                        {
                            title: 'Thao tác',
                            key: 'action',
                            render: (text, record) => (
                                <Space size="middle">
                                    <Button onClick={() => handleUpdate(record)}>Cập nhật</Button>
                                    <Button onClick={() => handleDelete(record)}>Xóa</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={filteredSize} // Sử dụng dữ liệu đã lọc
                />
            </div>
            <Modal title="Update Kích Cỡ" open={isModalVisible} onOk={handleUpdateSubmit} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Tên Kích Cỡ">
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

export default KichCo;
