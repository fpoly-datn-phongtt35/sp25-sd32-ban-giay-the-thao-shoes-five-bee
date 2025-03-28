import React, { useEffect, useState } from 'react'
import { addChucVu, deleteChucVu, detailChucVu, getChucVu, updateChucVu } from '../service/ChucVuService';
import { Button, Form, Input, message, Modal, Radio, Space, Table } from 'antd';

const ChucVu = () => {
  const [chucVu, setChucVu] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [value, setValue] = useState(1);
  const [ma, setMa] = useState('');
  const [ten, setTen] = useState('');
  const [moTa, setMoTa] = useState('');
  const [updatingChucVu, setUpdatingChucVu] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeChucVu, setActiveChucVu] = useState([]);
  const getActiveChatLieu = () => {
    return chucVu.filter(item => item.TRANG_THAI === 0);
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
    getAllChucVu();
  }, []);

  const getAllChucVu = async () => {
    try {
      const result = await getChucVu();
      const chucVuData = result.data.map((item, index) => ({
        key: index,
        ID: item.id,
        MA: item.ma,
        TEN: item.ten,
        TRANG_THAI: item.trangThai,
        MO_TA: item.moTa,
      }));
      const activeChucVuData = chucVuData.filter(item => item.TRANG_THAI === 0);
      setActiveChucVu(activeChucVuData);
      setChucVu(chucVuData);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu chức vụ", error);
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
      moTa: moTa,
    };
    try {
      await addChucVu(newData);
      message.success("Thêm chức vụ thành công");
      getAllChucVu();
      setMa("");
      setTen("");
      setValue(1);
      setMoTa("");
    } catch (error) {
      message.error("Lỗi khi thêm chức vụ");
    }
  };

  const removeChucVu = async (record) => {
    try {
      await deleteChucVu(record.ID);
      message.success("Xóa thành công");
      getAllChucVu();
    } catch (error) {
      message.error("Lỗi khi xóa chức vụ");
    }
  };

  const detail = async (record) => {
    console.log(record.ID);
    try {
      const response = await detailChucVu(record.ID);
      const chucVu = response.data;
      setUpdatingChucVu(chucVu);
      setMa(chucVu.ma);
      setTen(chucVu.ten);
      setMoTa(chucVu.moTa);
      setValue(chucVu.trangThai === 0 ? 1 : 2);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Lỗi khi lấy chi tiết chức vụ");
    }
  };

  const editChucVuButton = async () => {
    if (!ma || !ten) {
      message.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const newDataChucVu = {
      id: updatingChucVu.id,
      ma: ma,
      ten: ten,
      trangThai: value === 1 ? 0 : 1,
      moTa: moTa,
    };

    try {
      await updateChucVu(newDataChucVu);
      message.success("Cập nhật chức vụ thành công");
      getAllChucVu();
      setIsModalVisible(false);
      resetForm();
    } catch (error) {
      message.error("Lỗi cập nhật chức vụ: " + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setMa("");
    setTen("");
    setValue(1);
    setUpdatingChucVu(null);
    setMoTa("");
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>

      <div style={{ width: '100%', marginLeft: '200px' }}>
        <h1>Quản lý chức vụ</h1>
        {/* <Input placeholder='Mã Chức Vụ' value={ma} onChange={(e) => setMa(e.target.value)} /> */}
        <br /><br />
        <Input placeholder='Tên Chức Vụ' value={ten} onChange={(e) => setTen(e.target.value)} />
        <br /><br />
        <Input placeholder='Mô Tả' value={moTa} onChange={(e) => setMoTa(e.target.value)} />
        <br /><br />
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>Sử dụng</Radio>
          <Radio value={2}>Không còn sử dụng</Radio>
        </Radio.Group>
        <br /><br />
        <Button type="primary" onClick={add}>
          Thêm
        </Button>
        <br /><br />
        <Table pagination={{ pageSize: 5, defaultPageSize: 5 }} rowSelection={{ selectedRowKeys, onChange: onSelectChange }} columns={[
          // {
          //   title: 'ID',
          //   dataIndex: 'ID',
          // },
          // {
          //   title: 'MA',
          //   dataIndex: 'MA',
          // },
          {
            title: 'Tên',
            dataIndex: 'TEN',
          },
          {
            title: 'Mô tả',
            dataIndex: 'MO_TA',
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
                <Button onClick={() => detail(record)}>Cập nhật</Button>
                <Button onClick={() => removeChucVu(record)}>Xóa</Button>
              </Space>
            ),
          },
        ]} dataSource={chucVu} />
      </div>
      <Modal title="Update Chức Vụ" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={editChucVuButton}>
        <Form>
          {/* <Form.Item label="Mã Chức Vụ">
            <Input value={ma} onChange={(e) => setMa(e.target.value)} />
          </Form.Item> */}
          <Form.Item label="Tên Chức Vụ">
            <Input value={ten} onChange={(e) => setTen(e.target.value)} />
          </Form.Item>
          <Form.Item label="Mô Tả">
            <Input value={moTa} onChange={(e) => setMoTa(e.target.value)} />
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
  )
}

export default ChucVu;