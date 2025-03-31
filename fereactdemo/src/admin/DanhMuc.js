import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { addDanhMuc, deleteDanhMuc, getDanhMuc, updateDanhMuc } from '../service/DanhMucService';

const DanhMuc = () => {
    const [danhMuc, setDanhMuc] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [value, setValue] = useState(1);
    const [ten, setTen] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // State cho từ khóa tìm kiếm
    const [updattingDanhMuc, setUpdattingDanhMuc] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);

    const getActiveDanhMuc = () => {
        return danhMuc.filter(item => item.TRANG_THAI === 0);
    };

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
    };

    useEffect(() => {
        getAllDanhMuc();
    }, []);

    const getAllDanhMuc = async () => {
        try {
            const result = await getDanhMuc();
            const danhMucData = result.data.map((item, index) => ({
                key: index,
                ID: item.id,
                TEN: item.ten,
                TRANG_THAI: item.trangThai,
            }));
            setDanhMuc(danhMucData);
        } catch (error) {
            message.error("Lỗi hiển thị load table danh mục ");
        }
    };

    const createDanhMuc = async () => {
        if (!ten) {
            message.error("Không được để trống tên danh mục");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên danh mục không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên danh mục phải là chữ cái (bao gồm cả dấu tiếng Việt) và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;
        const newDanhMuc = {
            ten: ten,
            trangThai: newTrangThai,
        };
        try {
            await addDanhMuc(newDanhMuc);
            message.success("Thêm danh mục thành công");
            getAllDanhMuc();
            setTen("");
            setValue(1);
        } catch (error) {
            message.error('Lỗi khi thêm danh mục');
            console.error("Lỗi khi thêm danh mục", error);
        }
    };

    const handledeleteDanhMuc = async (record) => {
        try {
            await deleteDanhMuc(record.ID);
            message.success("Xóa danh mục thành công !");
            getAllDanhMuc();
        } catch (error) {
            message.error("Xóa danh mục thất bại ");
        }
    };

    const handleUpdateDanhMuc = (record) => {
        setUpdattingDanhMuc(record);
        setTen(record.TEN);
        setValue(record.TRANG_THAI === 0 ? 1 : 2);
        setIsModalVisible(true);
    };

    const handleUpdateDanhMucButton = async () => {
        if (!ten) {
            message.error("Không được để trống tên danh mục");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên danh mục không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên danh mục phải là chữ cái (bao gồm cả dấu tiếng Việt) và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        if (!updattingDanhMuc?.ID) {
            message.error("Không tìm thấy ID của danh mục cần cập nhật!");
            return;
        }

        const editingDanhMuc = {
            id: updattingDanhMuc.ID,
            ten: ten,
            trangThai: newTrangThai,
        };

        try {
            await updateDanhMuc(editingDanhMuc);
            message.success("Cập nhật danh mục thành công!");
            getAllDanhMuc();
            setIsModalVisible(false);
            setTen("");
            setValue(null);
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            message.error("Lỗi khi cập nhật danh mục");
        }
    };

    // Lọc danh mục theo tên
    const filteredDanhMuc = danhMuc.filter(item => item.TEN.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
                <h1>Quản lý danh mục</h1>
                <Input
                    placeholder="Nhập tên danh mục để thêm"
                    value={ten}
                    onChange={(e) => setTen(e.target.value)}
                />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={createDanhMuc}>
                    Thêm
                </Button>
                <br /><br />

                {/* Tìm kiếm theo tên danh mục */}
                <Input
                    placeholder="Tìm kiếm danh mục theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <br /><br />

                <Table
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                    columns={[
                        {
                            title: 'Tên danh mục',
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
                                    <Button onClick={() => handleUpdateDanhMuc(record)}>Cập nhật</Button>
                                    <Button onClick={() => handledeleteDanhMuc(record)}>Xóa</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={filteredDanhMuc} // Sử dụng dữ liệu đã lọc
                />
            </div>
            <Modal title="Cập nhật danh mục" open={isModalVisible} onOk={handleUpdateDanhMucButton} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Tên danh mục">
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

export default DanhMuc;
