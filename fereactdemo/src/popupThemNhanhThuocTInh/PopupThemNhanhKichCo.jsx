import { Button, Input, Radio, message } from "antd";
import React, { useState } from "react";
import { createSize } from "../service/KichCoService";
import ConfirmModal from "./ConfirmModal";

const PopupThemNhanhKichCo = ({ setIsThemNhanhKichCo, getKichCoList }) => {
  const [ten, setTen] = useState("");
  const [value, setValue] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false); // State để điều khiển popup xác nhận

  const createKichCo = async () => {
    if (!ten) {
      message.error("Không được để trống tên kích cỡ");
      return;
    }

    if (ten.length > 10) {
      message.error("Tên kích cỡ không được vượt quá 10 ký tự!");
      return;
    }

    const newKichCo = { ten: ten, trangThai: value === 1 ? 0 : 1 };

    try {
      await createSize(newKichCo);
      message.success("Thêm kích cỡ thành công");

      setIsThemNhanhKichCo(false); // Đóng popup
      getKichCoList(); // Cập nhật danh sách kích cỡ

      setTen("");
      setValue(1);
    } catch (error) {
      message.error("Kích cỡ này đã tồn tại");
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
        Thêm Nhanh Kích Cỡ
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
        placeholder="Nhập tên kích cỡ..."
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
        onClick={() => setConfirmOpen(true)} // Mở hộp thoại xác nhận
      >
        Thêm Kích Cỡ
      </Button>

      {/* Gọi component xác nhận */}
      <ConfirmModal
        open={confirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          createKichCo();
        }}
        onCancel={() => setConfirmOpen(false)}
        title="Xác nhận thêm kích cỡ"
        content={`Bạn có chắc muốn thêm kích cỡ không?`}
      />
    </div>
  );
};

export default PopupThemNhanhKichCo;
