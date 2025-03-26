import React, { useEffect, useState } from 'react'
import { addChatLieu, deleteChatLieu, getChatLieu, updateChatLieu } from '../service/ChatLieuService';
import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd';

const ChatLieu = () => {
    const [chatLieu, setChatLieu] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [value, setValue] = useState(1);
    const [ten, setTen] = useState('');
    const [updattingChatLieu, setUpdateChatLieu] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm

    const getActiveChatLieu = () => {
        return chatLieu.filter(item => item.TRANG_THAI === 0);
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
        return status === 0 ? "Hoạt động" : "Không hoạt động";
    }

    useEffect(() => {
        getAllChatLieu();
    }, []);

    const getAllChatLieu = async () => {
        try {
            const result = await getChatLieu();
            const chatLieuData = result.data.map((item, index) => ({
                key: index,
                ID: item.id,
                TEN: item.ten,
                TRANG_THAI: item.trangThai,
            }));
            setChatLieu(chatLieuData);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu chất liệu", error);
        }
    };

    const handleAddChatLieu = async () => {
        if (!ten) {
            message.error("Mã hoặc Tên không được để trống !");
            return;
        }
        const newTrangThai = value === 1 ? 0 : 1;
        const newChatLieu = {
            ten: ten,
            trangThai: newTrangThai,
        };
        try {
            await addChatLieu(newChatLieu);
            message.success("Thêm chất liệu thành công");
            getAllChatLieu();
            setTen("");
            setValue(1);
        } catch (error) {
            message.error('Lỗi khi thêm chất liệu!');
            console.error("Lỗi khi thêm chất liệu:", error);
        }
    };

    const handDeleteChatLieu = async (record) => {
        try {
            await deleteChatLieu(record.ID);
            message.success("Xóa chất liệu thành công");
            getAllChatLieu();
        } catch (error) {
            message.error("Lỗi khi xóa chất liệu");
        }
    };

    const handleUpdateChatLieu = (record) => {
        setUpdateChatLieu(record);
        setTen(record.TEN);
        setValue(record.TRANG_THAI === 0 ? 1 : 2);
        setIsModalVisible(true);
    };

    const handleUpdateChatLieuButton = async () => {
        if (!ten) {
            message.error("Không được để trống tên chất liệu");
            return;
        }

        const updateTrangThai = value === 1 ? 0 : 1;

        if (!updattingChatLieu?.ID) {
            message.error("Không tìm thấy ID của chất liệu cần cập nhật!");
            return;
        }

        const editChatLieu = {
            id: updattingChatLieu.ID, // Thêm ID vào DTO
            ten: ten,
            trangThai: updateTrangThai,
        };

        try {
            await updateChatLieu(editChatLieu);
            message.success("Cập nhật chất liệu thành công!");
            getAllChatLieu();
            setIsModalVisible(false);
            setTen("");
            setUpdateChatLieu(null);
            setValue(null);
        } catch (error) {
            console.error("Lỗi khi cập nhật chất liệu:", error);
            message.error("Lỗi khi cập nhật chất liệu");
        }
    };

    // Hàm lọc dữ liệu chất liệu theo từ khóa tìm kiếm
    const filteredChatLieu = chatLieu.filter(item =>
        item.TEN.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
                <h2>Quản lý Chất Liệu</h2>

                {/* Ô nhập tìm kiếm */}
                <Input
                    placeholder="Tìm kiếm chất liệu"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: "20px" }}
                />

                <Input placeholder='Nhập tên chất liệu để thêm' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={handleAddChatLieu}>
                    Thêm
                </Button>
                <br /><br />
                <Table
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                    columns={[
                        {
                            title: 'Tên Chất Liệu',
                            dataIndex: 'TEN',
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'trang_thai',
                            render: (text, record) => trangThai(record.TRANG_THAI)
                        },
                        {
                            title: 'Thao tác',
                            key: 'action',
                            render: (text, record) => (
                                <Space size="middle">
                                    <Button onClick={() => handleUpdateChatLieu(record)}>Cập nhật</Button>
                                    <Button onClick={() => handDeleteChatLieu(record)}>Xóa</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={filteredChatLieu} // Hiển thị dữ liệu đã lọc
                />
            </div>
            <Modal title="Update Chất Liệu" open={isModalVisible} onOk={handleUpdateChatLieuButton} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Tên Chất Liệu">
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
}

export default ChatLieu;
