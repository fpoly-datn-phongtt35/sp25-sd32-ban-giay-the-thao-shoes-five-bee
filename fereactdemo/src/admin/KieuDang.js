import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { addKieuDang, deleteKieuDang, getKieuDang, updateKieuDang } from '../service/KieuDangService';

const KieuDang = () => {
    const [kieuDang, setKieuDang] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [value, setValue] = useState(1);
    const [ten, setTen] = useState('');
    const [updattingKieuDang, setUpdattingDeGiay] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm

    const getActiveChatLieu = () => {
        return kieuDang.filter(item => item.TRANG_THAI === 0);
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
        getAllKieuDang();
    }, []);

    const getAllKieuDang = async () => {
        try {
            const result = await getKieuDang();
            const dataKieuGiang = result.data.map((item, index) => ({
                key: index,
                ID: item.id,
                TEN: item.ten,
                TRANG_THAI: item.trangThai,
            }));
            setKieuDang(dataKieuGiang);
        } catch (error) {
            message.error("Lỗi load table kiểu dáng");
        }
    };

    const creatKieuDang = async () => {
        if (!ten) {
            message.error("Không được để trống tên kiểu dáng");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên kiểu dáng không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên kiểu dáng phải là chữ cái  và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        const newKieuDang = {
            ten: ten,
            trangThai: newTrangThai,
        };
        try {
            await addKieuDang(newKieuDang);
            message.success("Thêm kiểu dáng thành công");
            getAllKieuDang();
            setTen("");
            setValue(0);
        } catch (error) {
            message.error("Lỗi không thể thêm kiểu dáng của giày");
        }
    };

    const removeKieuDang = async (record) => {
        await deleteKieuDang(record.ID);
        message.success("Xóa kiểu dáng thành công !");
        getAllKieuDang();
    };

    const editingKieuDang = (record) => {
        setUpdattingDeGiay(record);
        setTen(record.TEN);
        setValue(record.TRANG_THAI === 0 ? 1 : 2);
        setIsModalVisible(true);
    };

    const editingKieuDangButton = async () => {
        if (!ten) {
            message.error("Không được để trống tên kiểu dáng");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên kiểu dáng không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên kiểu dáng phải là chữ cái (bao gồm cả dấu tiếng Việt) và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        if (!updattingKieuDang?.ID) {
            message.error("Không tìm thấy ID của kiểu dáng cần cập nhật!");
            return;
        }

        const editKieuDang = {
            id: updattingKieuDang.ID,
            ten: ten,
            trangThai: newTrangThai,
        };

        try {
            await updateKieuDang(editKieuDang);
            message.success("Cập nhật kiểu dáng thành công!");
            getAllKieuDang();
            setIsModalVisible(false);
            setTen("");
            setValue(null);
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            message.error("Không thể cập nhật kiểu dáng của giày");
        }
    };

    // Hàm lọc kiểu dáng theo từ khóa tìm kiếm
    const filteredKieuDang = kieuDang.filter(item =>
        item.TEN.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
                <h2>Quản lý Kiểu Dáng</h2>

                {/* Ô nhập tìm kiếm */}
                <Input
                    placeholder="Tìm kiếm kiểu dáng"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: "20px" }}
                />

                <Input placeholder='Nhập tên kiểu dáng để thêm' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={creatKieuDang}>
                    Thêm
                </Button>
                <br /><br />

                {/* Bảng kiểu dáng */}
                <Table
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                    columns={[
                        {
                            title: 'Tên kiểu dáng',
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
                                    <Button onClick={() => editingKieuDang(record)}>Cập nhật</Button>
                                    <Button onClick={() => removeKieuDang(record)}>Xóa</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={filteredKieuDang} // Hiển thị dữ liệu sau khi lọc
                />
            </div>

            {/* Modal chỉnh sửa kiểu dáng */}
            <Modal title="Update Kiểu Dáng" open={isModalVisible} onOk={editingKieuDangButton} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Tên Kiểu Dáng">
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

export default KieuDang;
