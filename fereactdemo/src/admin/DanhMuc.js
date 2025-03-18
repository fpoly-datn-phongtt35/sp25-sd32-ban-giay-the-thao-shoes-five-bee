import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { addDanhMuc, deleteDanhMuc, getDanhMuc, updateDanhMuc } from '../service/DanhMucService';


const DanhMuc = () => {
    const [danhMuc, setDanhMuc] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [value, setValue] = useState(1);
    const [ten, setTen] = useState('');
    const [updattingDanhMuc, setUpdattingDanhMuc] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
    const [activeDanhMuc, setActiveDanhMuc] = useState([]);
    const getActiveDanhMuc = () => {
        return danhMuc.filter(item => item.TRANG_THAI === 0);
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
            const activeDanhMucData = danhMucData.filter(item => item.TRANG_THAI === 0);
            setActiveDanhMuc(activeDanhMucData);
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

        // Kiểm tra độ dài tên
        if (ten.length > 255) {
            message.error("Tên danh mục không được vượt quá 255 ký tự!");
            return;
        }

        // Kiểm tra xem tên có phải là số hay không, cho phép ký tự tiếng Việt
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

        // Kiểm tra độ dài tên
        if (ten.length > 255) {
            message.error("Tên danh mục không được vượt quá 255 ký tự!");
            return;
        }

        // Kiểm tra xem tên có phải là số hay không, cho phép ký tự tiếng Việt
        if (!/^[\p{L}\s]+$/u.test(ten)) {
            message.error("Tên danh mục phải là chữ cái (bao gồm cả dấu tiếng Việt) và không được chứa số!");
            return;
        }

        const newTrangThai = value === 1 ? 0 : 1;

        // Đảm bảo ID tồn tại trước khi gửi request
        if (!updattingDanhMuc?.ID) {
            message.error("Không tìm thấy ID của đế giày cần cập nhật!");
            return;
        }

        const editingDanhMuc = {
            id: updattingDanhMuc.ID, // Thêm ID vào DTO
            ten: ten,
            trangThai: newTrangThai,
        };

        try {
            await updateDanhMuc(editingDanhMuc); // Không truyền ID vào URL nữa
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


    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '350px' }}>

                <Input placeholder='Tên danh mục' value={ten} onChange={(e) => setTen(e.target.value)} />
                <br /><br />
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Hoạt động</Radio>
                    <Radio value={2}>Không hoạt động</Radio>
                </Radio.Group>
                <br /><br />
                <Button type="primary" onClick={createDanhMuc}>
                    Add
                </Button>
                <br /><br />
                <Table pagination={{ pageSize: 5, defaultPageSize: 5 }} rowSelection={{ selectedRowKeys, onChange: onSelectChange }} columns={[
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
                ]} dataSource={danhMuc} />
            </div>
            <Modal title="Update danh mục" open={isModalVisible} onOk={handleUpdateDanhMucButton} onCancel={() => setIsModalVisible(false)}>
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
    )
}

export default DanhMuc