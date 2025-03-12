import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Select } from "antd";

const SanPhamChiTietPopup = ({ danhSachChiTiet, kichCoList, mauSacList, visible, onClose }) => {
  const [selectedKichCo, setSelectedKichCo] = useState(null);
  const [selectedMauSac, setSelectedMauSac] = useState(null);

  useEffect(() => {
    if (kichCoList.length > 0) {
      setSelectedKichCo(kichCoList[0].id);
    }
    if (mauSacList.length > 0) {
      setSelectedMauSac(mauSacList[0].id);
    }
  }, [kichCoList, mauSacList]);

  const handleEdit = (record) => {
    console.log("Sửa sản phẩm:", record);
  };

  const handleDelete = (record) => {
    console.log("Xóa sản phẩm:", record);
  };

  const handleAdd = () => {
    console.log("Thêm sản phẩm mới");
  };

  const columns = [
    { title: "Tên", dataIndex: "ten", key: "ten" },
    { title: "Giá Bán", dataIndex: "giaBan", key: "giaBan" },
    { title: "Màu Sắc", dataIndex: "mauSac", key: "mauSac" },
    { title: "Kích Cỡ", dataIndex: "kichCo", key: "kichCo" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="danger" onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Chi Tiết Sản Phẩm"
      visible={visible}
      width="auto"
      style={{ maxWidth: "90vw" }}
      onCancel={onClose}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button type="primary" onClick={handleAdd}>
            Thêm
          </Button>
          <Button type="default" onClick={onClose}>
            OK
          </Button>
        </div>
      }
    >
      {/* Select Inputs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <Select
          placeholder="Chọn Kích Cỡ"
          value={selectedKichCo}
          onChange={setSelectedKichCo}
          style={{ width: 150 }}
        >
          {kichCoList.map((kc) => (
            <Select.Option key={kc.id} value={kc.id}>
              {kc.ten}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn Màu Sắc"
          value={selectedMauSac}
          onChange={setSelectedMauSac}
          style={{ width: 150 }}
        >
          {mauSacList.map((ms) => (
            <Select.Option key={ms.id} value={ms.id}>
              {ms.ten}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={danhSachChiTiet}
        rowKey="id"
        pagination={false}
        bordered
      />
    </Modal>
  );
};

export default SanPhamChiTietPopup;
