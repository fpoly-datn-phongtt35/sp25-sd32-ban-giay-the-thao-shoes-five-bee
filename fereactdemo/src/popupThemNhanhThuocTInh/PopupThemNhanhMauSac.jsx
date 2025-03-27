import { Button, Input, Radio, message } from "antd";
import React, { useState } from "react";
import { addMauSac } from "../service/MauSacService";
import ConfirmModal from "./ConfirmModal"; 
const PopupThemNhanhMauSac = ({ setIsThemNhanhMausac, getMauSacList }) => {
  const [value, setValue] = useState(1);
  const [ten, setTen] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false); // State điều khiển popup xác nhận

  const createMauSac = async () => {
    if (!ten) {
      message.error("Không được để trống tên màu sắc");
      return;
    }

    if (ten.length > 255) {
      message.error("Tên màu sắc không được vượt quá 255 ký tự!");
      return;
    }

    if (!/^[\p{L}\s]+$/u.test(ten)) {
      message.error("Tên màu sắc chỉ chứa chữ cái (có thể có dấu)!");
      return;
    }

    const newMauSac = { ten: ten, trangThai: value === 1 ? 0 : 1 };

    try {
      await addMauSac(newMauSac);
      message.success("Thêm màu sắc thành công");

      setIsThemNhanhMausac(false); // Đóng popup
      getMauSacList(); // Cập nhật danh sách màu sắc

      setTen("");
      setValue(1);
    } catch (error) {
      message.error("Thêm màu sắc thất bại");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>
        Thêm Nhanh Màu Sắc
      </h3>

      <Input
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          marginBottom: "15px",
        }}
        placeholder="Nhập tên màu sắc..."
        value={ten}
        onChange={(e) => setTen(e.target.value)}
      />

      <Radio.Group
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "15px",
        }}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      >
        <Radio value={1}>Hoạt động</Radio>
        <Radio value={2}>Không hoạt động</Radio>
      </Radio.Group>

      <Button
        style={{
          width: "100%",
          fontSize: "16px",
          fontWeight: "500",
          backgroundColor: "#1677ff",
        }}
        type="primary"
        onClick={() => setConfirmOpen(true)} // Mở confirm
      >
        Thêm màu sắc
      </Button>

      {/* Gọi component Confirm */}
      <ConfirmModal
        open={confirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          createMauSac();
        }}
        onCancel={() => setConfirmOpen(false)}
        title="Xác nhận thêm màu sắc"
        content={`Bạn có chắc muốn thêm màu sắc  không?`}
      />
    </div>
  );
};

export default PopupThemNhanhMauSac;
