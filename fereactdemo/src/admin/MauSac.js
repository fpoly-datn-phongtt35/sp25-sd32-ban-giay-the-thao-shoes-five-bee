import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { addMauSac, deleteMauSac, getMauSac, updateMauSac } from '../service/MauSacService'

const MauSac = () => {
    const [mauSac, setMauSac] = useState([])
    const [value, setValue] = useState(1)
    const [ten, setTen] = useState("")
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [editingMauSac, setEditingMauSac] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [activeChatLieu, setActiveChatLieu] = useState([]);
    const getActiveChatLieu = () => {
        return mauSac.filter(item => item.TRANG_THAI === 0);
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
            const activeChatLieuData = mauSacData.filter(item => item.TRANG_THAI === 0);
            setActiveChatLieu(activeChatLieuData);
            setMauSac(mauSacData);
        } catch (error) {
            message.error("Lỗi hiển thị table màu sắc");
        }
    };

    const createMauSac = async () => {
        if ( !ten) {
            message.error("Không được để trống tên và mã");
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
        const updateTrangThai = value === 1 ? 0 : 1;

        const editNewMauSac = {
            
            ten: ten,
            trangThai: updateTrangThai,
        };
        try {
            await updateMauSac(editingMauSac.ID, editNewMauSac);
            message.success("Update màu sắc thành công !");
            getAllMauSac();
            setIsModalVisible(false);
            
            setTen("");
            setValue(null);
        } catch (error) {
            message.error("Update màu sắc thất bại");
        }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
                
                <Input placeholder='Tên Màu Sắc' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Còn</Radio>
                    <Radio value={2}>Hết</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={createMauSac}>
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
                                <Button onClick={() => editMauSac(record)}>Update</Button>
                                <Button onClick={() => removeMauSac(record)}>Delete</Button>
                            </Space>
                        ),
                    },
                ]} dataSource={mauSac} />
            </div>
            <Modal title="Update Kích Cỡ" open={isModalVisible} onOk={editMauSacButton} onCancel={() => setIsModalVisible(false)}>
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

export default MauSac