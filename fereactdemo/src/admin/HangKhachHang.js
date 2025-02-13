import React, { useEffect, useState } from 'react';
import { addHangKhachHang, deleteHangKhachHang, detailHangKhachHang, getAllHangKhachHang, updateHangKhachHang } from '../service/HangKhachHangService';
import { Button, Form, Input, message, Modal, Radio, Space, Table } from 'antd';

const HangKhachHang = () => {
  const [hangKhachHang, setHangKhachHang] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [value, setValue] = useState(1);
  const [ma, setMa] = useState('');
  const [ten, setTen] = useState('');
  const [updatingHangKhachHang, setUpdatingHangKhachHang] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeChatLieu, setActiveChatLieu] = useState([]);
  const getActiveChatLieu = () => {
    return hangKhachHang.filter(item => item.TRANG_THAI === 0);
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
  };

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      const result = await getAllHangKhachHang();
      const hangKhachHangData = result.data.map((item, index) => ({
        key: index,
        ID: item.id,
        MA: item.ma,
        TEN: item.ten,
        TRANG_THAI: item.trangThai,
      }));
      const activeChatLieuData = hangKhachHangData.filter(item => item.TRANG_THAI === 0);
      setActiveChatLieu(activeChatLieuData);
      setHangKhachHang(hangKhachHangData);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu hạng khách hàng", error);
    }
  };

  const add = async () => {
    if (!ma || !ten) {
      message.error("Không được để trống mã và tên");
      return;
    }
    const newTrangThai = value === 1 ? 0 : 1;
    const newData = {
      ma: ma,
      ten: ten,
      trangThai: newTrangThai,
    };
    try {
      await addHangKhachHang(newData);
      message.success("Thêm hạng khách hàng thành công");
      getAll();
      setMa("");
      setTen("");
      setValue(1);
    } catch (error) {
      message.error("Lỗi khi thêm hạng khách hàng");
    }
  };

  const removeHangKhachHang = async (record) => {
    try {
      await deleteHangKhachHang(record.ID);
      message.success("Xóa thành công");
      getAll();
    } catch (error) {
      message.error("Lỗi khi xóa chức vụ");
    }
  };

  const detail = async (record) => {
    console.log(record.ID);
    try {
      const response = await detailHangKhachHang(record.ID);
      const hangKhachHang = response.data;
      setUpdatingHangKhachHang(hangKhachHang);
      setMa(hangKhachHang.ma);
      setTen(hangKhachHang.ten);
      setValue(hangKhachHang.trangThai === 0 ? 1 : 2);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Lỗi khi lấy chi tiết hạng khách hàng");
    }
  };

  const editHangKhachHangButton = async () => {
    if (!ma || !ten) {
      message.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const newDataHangKhachHang = {
      ma: ma,
      ten: ten,
      trangThai: value === 1 ? 0 : 1,
    };

    try {
      await updateHangKhachHang(updatingHangKhachHang.id, newDataHangKhachHang);
      message.success("Cập nhật hạng khách hàng thành công");
      getAll();
      setIsModalVisible(false);
      resetForm();
    } catch (error) {
      message.error("Lỗi cập nhật hạng khách hàng: " + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setMa("");
    setTen("");
    setValue(1);
    setUpdatingHangKhachHang(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', marginLeft: '200px' }}>
        <Input placeholder='Mã HKH' value={ma} onChange={(e) => setMa(e.target.value)} />
        <br /><br />
        <Input placeholder='Tên HKH' value={ten} onChange={(e) => setTen(e.target.value)} />
        <br /><br />
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>Còn</Radio>
          <Radio value={2}>Hết</Radio>
        </Radio.Group>
        <br /><br />
        <Button type="primary" onClick={add}>
          Add
        </Button>
        <br /><br />
        <Table pagination={{ pageSize: 5, defaultPageSize: 5 }} rowSelection={{ selectedRowKeys, onChange: onSelectChange }} columns={[
          {
            title: 'ID',
            dataIndex: 'ID',
          },
          {
            title: 'MA',
            dataIndex: 'MA',
          },
          {
            title: 'TEN',
            dataIndex: 'TEN',
          },
          {
            title: 'TRANG THAI',
            dataIndex: 'TRANG_THAI',
            render: (text, record) => trangThai(record.TRANG_THAI)
          },
          {
            title: 'ACTION',
            key: 'action',
            render: (text, record) => (
              <Space size="middle">
                <Button onClick={() => detail(record)}>Update</Button>
                <Button onClick={() => removeHangKhachHang(record)}>Delete</Button>
              </Space>
            ),
          },
        ]} dataSource={hangKhachHang} />
      </div>
      <Modal title="Update Hạng Khách Hàng" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={editHangKhachHangButton}>
        <Form>
          <Form.Item label="Mã HKH">
            <Input value={ma} onChange={(e) => setMa(e.target.value)} />
          </Form.Item>
          <Form.Item label="Tên HKH">
            <Input value={ten} onChange={(e) => setTen(e.target.value)} />
          </Form.Item>
          <Form.Item label="Trạng Thái">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Đang sử dụng</Radio>
              <Radio value={2}>Không sử dụng</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default HangKhachHang;