import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { addDeGiay, deleteDeGiay, getDeGiay, updateDeGiay } from '../service/DeGiayService';


const DeGiay = () => {
    const [deGiay, setDeGiay] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [value, setValue] = useState(1);
    const [ten, setTen] = useState('');
    const [updattingDeGiay, setUpdattingDeGiay] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [activeChatLieu, setActiveChatLieu] = useState([]);
    const getActiveChatLieu = () => {
        return deGiay.filter(item => item.TRANG_THAI === 0);
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
        getAllDeGiay();
    }, []);
    const getAllDeGiay = async () => {
        try {
            const result = await getDeGiay();
            const deGiayData = result.data.map((item, index) => ({
                key: index,
                ID: item.id,

                TEN: item.ten,
                TRANG_THAI: item.trangThai,
            }));
            const activeChatLieuData = deGiayData.filter(item => item.TRANG_THAI === 0);
            setActiveChatLieu(activeChatLieuData);
            setDeGiay(deGiayData);
        } catch (error) {
            message.error("Lỗi hiển thị load table đế giày ");
        }
    };

    const createDeGiay = async () => {
        if (!ten) {
            message.error("Không được để trống tên đế giày");
            return;
        }

        // Kiểm tra độ dài tên
        if (ten.length > 255) {
            message.error("Tên đế giày không được vượt quá 255 ký tự!");
            return;
        }

        // Kiểm tra xem tên có phải là số hay không, cho phép ký tự tiếng Việt
        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên đế giày phải là chữ cái (bao gồm cả dấu tiếng Việt) và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        const newDeGiay = {
            ten: ten,
            trangThai: newTrangThai,
        };
        try {
            await addDeGiay(newDeGiay);
            message.success("Thêm đế giày thành công");
            getAllDeGiay();
            setTen("");
            setValue(1);
        } catch (error) {
            message.error('Lỗi khi thêm đế giày');
            console.error("Lỗi khi thêm đế giày", error);
        }
    };

    const handledeleteDeGiay = async (record) => {
        try {
            await deleteDeGiay(record.ID);
            message.success("Xóa đế giày thành công !");
            getAllDeGiay();
        } catch (error) {
            message.error("Xóa đế giày thất bại ");
        }
    };

    const handleUpdateDeGiay = (record) => {
        setUpdattingDeGiay(record);
        setTen(record.TEN);
        setValue(record.TRANG_THAI === 0 ? 1 : 2);
        setIsModalVisible(true);
    };

    const handleUpdateDeGiayButton = async () => {
        if (!ten) {
            message.error("Không được để trống tên đế giày");
            return;
        }

        // Kiểm tra độ dài tên
        if (ten.length > 255) {
            message.error("Tên đế giày không được vượt quá 255 ký tự!");
            return;
        }

        // Kiểm tra xem tên có phải là số hay không, cho phép ký tự tiếng Việt
        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên đế giày phải là chữ cái (bao gồm cả dấu tiếng Việt) và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        // Đảm bảo ID tồn tại trước khi gửi request
        if (!updattingDeGiay?.ID) {
            message.error("Không tìm thấy ID của đế giày cần cập nhật!");
            return;
        }

        const editingDeGiay = {
            id: updattingDeGiay.ID, // Thêm ID vào DTO
            ten: ten,
            trangThai: newTrangThai,
        };

        try {
            await updateDeGiay(editingDeGiay); // Không truyền ID vào URL nữa
            message.success("Cập nhật đế giày thành công!");
            getAllDeGiay();
            setIsModalVisible(false);
            setTen("");
            setValue(null);
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            message.error("Lỗi khi cập nhật đế giày");
        }
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>
                <h2>Quản lý Đế giày</h2>
                <Input placeholder='Tên Đế Giày' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={createDeGiay}>
                    Thêm
                </Button>
                <br /><br />
                <Table pagination={{ pageSize: 5, defaultPageSize: 5 }} rowSelection={{ selectedRowKeys, onChange: onSelectChange }} columns={[
                    {
                        title: 'Tên Đế Giày',
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
                                <Button onClick={() => handleUpdateDeGiay(record)}>Cập nhật</Button>
                                <Button onClick={() => handledeleteDeGiay(record)}>Xóa</Button>
                            </Space>
                        ),
                    },
                ]} dataSource={deGiay} />
            </div>
            <Modal title="Update Đế Giày" open={isModalVisible} onOk={handleUpdateDeGiayButton} onCancel={() => setIsModalVisible(false)}>
                <Form>
                    <Form.Item label="Tên Đế Giày">
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

export default DeGiay