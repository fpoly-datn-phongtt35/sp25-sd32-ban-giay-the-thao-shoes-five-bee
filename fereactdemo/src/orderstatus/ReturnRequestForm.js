import React, { useState } from 'react';
import {
  message,
} from "antd";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createReturnOrder } from '../service/ReturnOrderService';  // API tạo yêu cầu trả hàng

function ReturnRequestModal({ onAddReturnRequest, orderDetails }) {
  const [show, setShow] = useState(false);
  //   const [orderDetails, setOrderDetails] = useState(null);  
  const [returnRequest, setReturnRequest] = useState({
    orderId: orderDetails.id.toLocaleString(),
    reason: "",
    returnItems: orderDetails.items.map(item => item.id),  // Mặc định chọn tất cả sản phẩm
    images: "",
    status: parseInt("5", 10),  // Mặc định là "Hoàn hàng"
  });

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    // fetchOrderData();  // Lấy chi tiết đơn hàng
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReturnRequest(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleItemSelection = (e, itemId) => {
    const isChecked = e.target.checked;
    setReturnRequest(prevState => {
      let updatedItems = prevState.returnItems;
      if (isChecked) {
        updatedItems = [...updatedItems, itemId];
      } else {
        updatedItems = updatedItems.filter(id => id !== itemId);
      }
      return { ...prevState, returnItems: updatedItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const returnItems = returnRequest.returnItems.map(itemId => ({
      hoaDonChiTietId: itemId,
      soLuongTra: 1
    }));

    const response = await createReturnOrder(returnRequest.orderId, returnItems);

    // Xử lý phản hồi
    if (response) {
      message.success("Yêu cầu trả hàng đã được tạo");
      handleClose();
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Trả Hàng/Hoàn Tiền
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Yêu cầu trả hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetails ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formOrderId">
                <Form.Label>Mã đơn hàng</Form.Label>
                <Form.Control
                  type="text"
                  value={orderDetails.ma}
                  disabled
                />
              </Form.Group>

              <Form.Group controlId="formReturnReason" className="mt-3">
                <Form.Label>Lý do trả hàng</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập lý do trả hàng"
                  name="reason"
                  value={returnRequest.reason}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formReturnItems" className="mt-3">
                <Form.Label>Chọn sản phẩm trả hàng</Form.Label>
                {orderDetails.items.map(item => (
                  <Form.Check
                    key={item.id}
                    type="checkbox"
                    label={`${item.giay} - Số lượng: ${item.soLuong}`}
                    checked={returnRequest.returnItems.includes(item.id)}  // Mặc định được chọn
                    onChange={(e) => handleItemSelection(e, item.id)} // Cập nhật trạng thái khi chọn/mở chọn
                  />
                ))}
              </Form.Group>

              <Form.Group controlId="formImages" className="mt-3">
                <Form.Label>Hình ảnh minh họa (URL)</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Nhập URL hình ảnh"
                  name="images"
                  value={returnRequest.images}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formStatus" className="mt-3">
                <Form.Check
                  checked={returnRequest.status === 5}  // Mặc định trạng thái là "Hoàn hàng"
                  onChange={(e) => setReturnRequest(prevState => ({ ...prevState, status: e.target.checked ? 5 : 0 }))}
                  type="checkbox"
                  label="Đặt làm trạng thái Hoàn hàng"
                />
              </Form.Group>

            </Form>
          ) : (
            <p>Đang tải chi tiết đơn hàng...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Trở Lại
          </Button>
          <Button variant="danger" type="submit" onClick={handleSubmit}>
            Hoàn Thành
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export default ReturnRequestModal;
