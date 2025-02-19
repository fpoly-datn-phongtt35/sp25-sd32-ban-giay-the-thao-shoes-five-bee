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
    const [activeChatLieu, setActiveChatLieu] = useState([]);
    const getActiveChatLieu = () => {
        return size.filter(item => item.TRANG_THAI === 0);
    }
    const convertTrangThai = (status) => {
        return status === 0 ? "Còn" : "Hết";
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
            const activeChatLieuData = sizeData.filter(item => item.TRANG_THAI === 0);
            setActiveChatLieu(activeChatLieuData);
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
            message.error('Lỗi khi thêm kích cỡ!');
            console.error("Lỗi khi thêm kích cỡ:", error);
        }
    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
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
            message.error('Kích cỡ phải là một số!');
            return;
        }
        if (sizeValue < 3 || sizeValue > 50) {
            message.error('Kích cỡ phải là một số trong khoảng từ 3 đến 50!');
            return;
        }

        const updatedTrangThai = value === 1 ? 0 : 1;

        const updatedSize = {
            ten: ten,
            trangThai: updatedTrangThai
        };

        try {
            await updateSize(editingSize.ID, updatedSize);
            message.success("Cập nhật thành công");
            loadSize();
            setIsModalVisible(false);
            setEditingSize(null);
            setTen("");
        } catch (error) {
            message.error("Lỗi khi cập nhật kích cỡ");
            console.error("Lỗi khi cập nhật kích cỡ:", error);
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
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>

                <Input placeholder='Tên Kích Cỡ' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Còn</Radio>
                    <Radio value={2}>Hết</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={handleAdd}>
                    Add
                </Button>
                <br /><br />
                <Table pagination={{ pageSize: 5, defaultPageSize: 5 }} rowSelection={{ selectedRowKeys, onChange: onSelectChange }} columns={[
                    {
                        title: 'Ten',
                        dataIndex: 'TEN',
                    },
                    {
                        title: 'TRANG THAI',
                        dataIndex: 'TRANG_THAI',
                        render: (text, record) => convertTrangThai(record.TRANG_THAI),
                    },
                    {
                        title: 'ACTION',
                        key: 'action',
                        render: (text, record) => (
                            <Space size="middle">
                                <Button onClick={() => handleUpdate(record)}>Update</Button>
                                <Button onClick={() => handleDelete(record)}>Delete</Button>
                            </Space>
                        ),
                    },
                ]} dataSource={size} />
            </div>
            <Modal title="Update Kích Cỡ" open={isModalVisible} onOk={handleUpdateSubmit} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Tên Kích Cỡ">
                        <Input value={ten} onChange={(e) => setTen(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Trạng Thái">
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio value={1}>Còn</Radio>
                            <Radio value={2}>Hết</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default KichCo;