import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { addXuatXu, deleteXuatXu, getXuatXu, updateXuatXu } from '../service/XuatXuService';

const XuatXu = () => {
    const [xuatXu, setXuatXu] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [value, setValue] = useState(1);
    const [ten, setTen] = useState('');
    const [editingXuatXu, setEditingXuatXu] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [activeChatLieu, setActiveChatLieu] = useState([]);
    const getActiveChatLieu = () => {
        return xuatXu.filter(item => item.TRANG_THAI === 0);
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
        getAllXuatXu();
    }, []);
    const getAllXuatXu = async () => {
        try {
            const result = await getXuatXu();
            const xuatXuData = result.data.map((item, index) => ({
                key: index,
                ID: item.id,
                MA: item.ma,
                TEN: item.ten,
                TRANG_THAI: item.trangThai,
            }));
            const activeChatLieuData = xuatXuData.filter(item => item.TRANG_THAI === 0);
            setActiveChatLieu(activeChatLieuData);
            setXuatXu(xuatXuData);
        } catch (error) {
            message.error("Lỗi hiển thị table xuất xứ !");
        }

    };

    const creatXuatXu = async () => {
        if (!ten) {
            message.error("Không được để trống mã và tên xuất xứ");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên xuất xứ không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên xuất xứ phải là chữ cái và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        const newXuatXu = {
            ten: ten,
            trangThai: newTrangThai,
        };
        try {
            await addXuatXu(newXuatXu);
            message.success("Thêm xuất xứ thành công !");
            getAllXuatXu();

            setTen("");
            setValue(1);
        } catch (error) {
            message.error("Thêm xuất xứ thất bại ");
        }
    };
    const removeXuatXu = async (record) => {
        await deleteXuatXu(record.ID);
        message.success("Xóa thành công !");
        getAllXuatXu();
    };

    const handleUpdateXuatXu = (record) => {
        setEditingXuatXu(record);

        setTen(record.TEN);
        setValue(record.TRANG_THAI === 0 ? 1 : 2);
        setIsModalVisible(true);
    };
    const handleUpdateXuatXuButton = async () => {
        if (!ten) {
            message.error("Không được để trống mã và tên xuất xứ");
            return;
        }

        if (ten.length > 255) {
            message.error("Tên xuất xứ không được vượt quá 255 ký tự!");
            return;
        }

        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên xuất xứ phải là chữ cái và không được chứa số!");
            return;
        }

        const updatedTrangThai = value === 1 ? 0 : 1;

        // Đảm bảo ID tồn tại trước khi gửi request
        if (!editingXuatXu?.ID) {
            message.error("Không tìm thấy ID của xuất xứ cần cập nhật!");
            return;
        }

        const editXuatXu = {
            id: editingXuatXu.ID, // Thêm ID vào DTO
            ma: editingXuatXu.MA, // Giữ nguyên mã
            ten: ten,
            trangThai: updatedTrangThai,
        };

        try {
            console.log(editXuatXu);
            await updateXuatXu(editXuatXu); // Không truyền ID vào URL nữa
            message.success("Cập nhật xuất xứ thành công!");
            getAllXuatXu();
            setIsModalVisible(false);
            setTen("");
            setValue(null);
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            message.error("Lỗi khi cập nhật xuất xứ");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
                <h2>Quản lý Xuất Xứ</h2>
                <Input placeholder='Tên Xuất Xứ' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={creatXuatXu}>
                    Thêm
                </Button>
                <br /><br />
                <Table pagination={{ pageSize: 5, defaultPageSize: 5 }} rowSelection={{ selectedRowKeys, onChange: onSelectChange }} columns={[

                    {
                        title: 'Tên xuất xứ',
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
                                <Button onClick={() => handleUpdateXuatXu(record)}>Cập nhật</Button>
                                <Button onClick={() => removeXuatXu(record)} >Xóa</Button>
                            </Space>
                        ),
                    },
                ]} dataSource={xuatXu} />
            </div>
            <Modal title="Update Xuất Xứ" open={isModalVisible} onOk={handleUpdateXuatXuButton} onCancel={() => setIsModalVisible(false)}>
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
    )
}

export default XuatXu