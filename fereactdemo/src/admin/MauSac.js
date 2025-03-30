import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { addMauSac, deleteMauSac, getMauSac, updateMauSac } from '../service/MauSacService';

const MauSac = () => {
    const [mauSac, setMauSac] = useState([]);
    const [value, setValue] = useState(1);
    const [ten, setTen] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [editingMauSac, setEditingMauSac] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho từ khóa tìm kiếm

    const getActiveChatLieu = () => {
        return mauSac.filter(item => item.TRANG_THAI === 0);
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
        getAllMauSac();
    }, []);

    const getAllMauSac = async () => {
        try {
            const result = await getMauSac();
            const mauSacData = result.data.map((item, index) => ({
                key: index,
                ID: item.id,
                TEN: item.ten,
                TRANG_THAI: item.trangThai,
            }));
            setMauSac(mauSacData);
        } catch (error) {
            message.error("Lỗi hiển thị table màu sắc");
        }
    };

    const createMauSac = async () => {
        if (!ten) {
            message.error("Không được để trống tên màu sắc");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên màu sắc không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên màu sắc phải là chữ cái và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        const newMauSac = {
            ten: ten,
            trangThai: newTrangThai,
        };

        try {
            await addMauSac(newMauSac);
            message.success("Thêm màu sắc thành công");
            getAllMauSac();
            setTen("");
            setValue(1);
        } catch (error) {
            message.error("Thêm màu sắc thất bại");
        }
    };

    const removeMauSac = async (record) => {
        await deleteMauSac(record.ID);
        message.success("Xóa thành công màu sắc");
        getAllMauSac();
    };

    const editMauSac = (record) => {
        setEditingMauSac(record);
        setTen(record.TEN);
        setValue(record.TRANG_THAI === 0 ? 1 : 2);
        setIsModalVisible(true);
    };

    const editMauSacButton = async () => {
        if (!ten) {
            message.error("Không được để trống tên màu sắc");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên màu sắc không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên màu sắc phải là chữ cái và không được chứa số!");
            return;
        }

        const updateTrangThai = value === 1 ? 0 : 1;

        if (!editingMauSac?.ID) {
            message.error("Không tìm thấy ID của màu sắc cần cập nhật!");
            return;
        }

        const editNewMauSac = {
            id: editingMauSac.ID,
            ten: ten,
            trangThai: updateTrangThai,
        };

        try {
            await updateMauSac(editNewMauSac);
            message.success("Cập nhật màu sắc thành công!");
            getAllMauSac();
            setIsModalVisible(false);
            setTen("");
            setValue(null);
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            message.error("Cập nhật màu sắc thất bại");
        }
    };

    // Lọc danh sách màu sắc theo tên
    const filteredMauSac = mauSac.filter(item => item.TEN.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
                <h1>Quản lý màu sắc</h1>
                <Input placeholder='Nhập tên màu sắc để thêm' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={createMauSac}>
                    Thêm
                </Button>
                <br /><br />

                {/* Tìm kiếm theo tên màu sắc */}
                <Input
                    placeholder="Tìm kiếm màu sắc theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <br /><br />

                <Table
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                    columns={[
                        {
                            title: 'Tên màu',
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
                                    <Button onClick={() => editMauSac(record)}>Cập nhật</Button>
                                    <Button onClick={() => removeMauSac(record)}>Xóa</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={filteredMauSac} // Hiển thị danh sách đã lọc
                />
            </div>
            <Modal title="Update Màu Sắc" open={isModalVisible} onOk={editMauSacButton} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Tên Màu Sắc">
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

export default MauSac;
