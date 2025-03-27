import { Modal } from "antd";

const ConfirmModal = ({ open, onCancel, onConfirm, title, content }) => {
  return (
    <Modal
      title={title || "Xác nhận"}
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <p>{content || "Bạn có chắc chắn muốn thực hiện hành động này?"}</p>
    </Modal>
  );
};

export default ConfirmModal;
