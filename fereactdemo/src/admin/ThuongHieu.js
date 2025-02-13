import React, { useEffect, useState } from 'react'
import { addThuongHieu, deleteThuongHieu, getThuongHieu, updateThuongHieu } from '../service/ThuongHieuService';
import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd';

const ThuongHieu = () => {
    const [thuongHieu, setThuongHieu] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [ten, setTen] = useState("");
    const [tenUrl, setTenUrl] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [value, setValue] = useState(1);
    const [edittingThuongHieu, setEdittingThuongHieu] = useState(null);
    const [activeChatLieu, setActiveChatLieu] = useState([]);
    const getActiveChatLieu = () => {
        return thuongHieu.filter(item => item.TRANG_THAI === 0);
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
    }
    useEffect(() => {
        getAllThuongHieu();
    }, []);
    const getAllThuongHieu = async () => {
        const result = await getThuongHieu();
        const thuongHieuDaTa = result.data.map((item, index) => ({
            key: index,
            ID: item.id,

            TEN: item.ten,
            TRANG_THAI: item.trangThai,
        }));
        const activeChatLieuData = thuongHieuDaTa.filter(item => item.TRANG_THAI === 0);
        setActiveChatLieu(activeChatLieuData);
        setThuongHieu(thuongHieuDaTa);
    };
    const creatThuongHieu = async () => {
        if ( !ten) {
            message.error("Không được để trống tên và mã");
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
            message.error("Lỗi khi thêm mới thương hiệu");
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
        const updateTrangThai = value === 1 ? 0 : 1;
        const updateNewThuongHieu = {
            ten: ten,
            trangThai: updateTrangThai,
        };
        try {
            await updateThuongHieu(edittingThuongHieu.ID, updateNewThuongHieu);
            message.success("Update thương hiệu thành công ");
            getAllThuongHieu();
            setIsModalVisible(false);
            setTen("");
            setValue(null);
        } catch (error) {
            message.error("Update thương hiệu không thành công");
        }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
               
                <Input placeholder='Tên Thương Hiệu' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Còn</Radio>
                    <Radio value={2}>Hết</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={creatThuongHieu}>
                    Add
                </Button>
                <br /><br />
                <Table pagination={{ pageSize: 5, defaultPageSize: 5 }} rowSelection={{ selectedRowKeys, onChange: onSelectChange }} columns={[
                    
                    {
                        title: 'TEN',
                        dataIndex: 'TEN',
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
                                <Button onClick={() => editThuongHieu(record)}>Update</Button>
                                <Button onClick={() => removeThuongHieu(record)}>Delete</Button>
                            </Space>
                        ),
                    },
                ]} dataSource={thuongHieu} />
            </div>
            <Modal title="Update Kích Cỡ" open={isModalVisible} onOk={editThuongHieuButton} onCancel={() => setIsModalVisible(false)}>
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
    )
}

export default ThuongHieu