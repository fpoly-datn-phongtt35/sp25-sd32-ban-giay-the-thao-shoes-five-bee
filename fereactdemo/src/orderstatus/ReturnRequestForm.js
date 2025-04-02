
import React, { useState, useEffect } from 'react';
import {
  message,
} from "antd";
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createReturnOrder } from '../service/ReturnOrderService';  // API tạo yêu cầu trả hàng

function ReturnRequestModal({ onAddReturnRequest, orderDetails }) {
  const [show, setShow] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalRefundAmount, setTotalRefundAmount] = useState(0);

  const [returnRequest, setReturnRequest] = useState({
    orderId: orderDetails?.id?.toString(),
    lyDo: "",
    status: 7,  // Mặc định là "Hoàn hàng"
  });

  useEffect(() => {
    // Tính toán tổng tiền hoàn lại khi selectedItems thay đổi
    calculateTotalRefund();
  }, [selectedItems]);

  const calculateTotalRefund = () => {
    const total = selectedItems.reduce((sum, item) => {
      return sum + (item.donGia * item.soLuongTra);
    }, 0);
    setTotalRefundAmount(total);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Reset state khi mở modal
    setSelectedItems([]);
    setTotalRefundAmount(0);
    setReturnRequest({
      orderId: orderDetails?.id?.toString(),
      reason: "",
      status: 7,
    });
    setShow(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReturnRequest(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleItemSelection = (e, item) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // Thêm item vào danh sách với số lượng trả mặc định là 1
      setSelectedItems(prev => [...prev, {
        ...item,
        soLuongTra: 1
      }]);
    } else {
      // Loại bỏ item khỏi danh sách
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    // Đảm bảo số lượng không vượt quá số lượng đã mua
    const item = orderDetails.items.find(i => i.id === itemId);
    const maxQuantity = item ? item.soLuong : 1;
    newQuantity = Math.min(Math.max(1, newQuantity), maxQuantity);

    setSelectedItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, soLuongTra: newQuantity } : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      message.error("Vui lòng chọn ít nhất một sản phẩm để trả hàng");
      return;
    }

    if (!returnRequest.reason.trim()) {
      message.error("Vui lòng nhập lý do trả hàng");
      return;
    }

    // Chuẩn bị dữ liệu để gửi lên server
    const returnItems = selectedItems.map(item => ({
      hoaDonChiTietId: item.id,
      soLuongTra: item.soLuongTra
    }));

    try {
      const response = await createReturnOrder(orderDetails.id, returnItems);

      // Xử lý phản hồi
      if (response) {
        message.success("Yêu cầu trả hàng đã được tạo thành công");
        if (onAddReturnRequest) {
          onAddReturnRequest(response);
        }
        handleClose();
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tạo yêu cầu trả hàng: " + (error.response?.data || error.message));
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Trả Hàng/Hoàn Tiền
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Yêu cầu trả hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetails ? (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formOrderId">
                    <Form.Label>Mã đơn hàng</Form.Label>
                    <Form.Control
                      type="text"
                      value={orderDetails.ma || ''}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formTotalRefund">
                    <Form.Label>Tổng tiền hoàn trả</Form.Label>
                    <Form.Control
                      type="text"
                      value={`${totalRefundAmount.toLocaleString()} VNĐ`}
                      disabled
                      className="font-weight-bold text-danger"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formReturnReason" className="mt-3">
                <Form.Label>Lý do trả hàng <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập lý do trả hàng"
                  name="reason"
                  value={returnRequest.lyDo}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formReturnItems" className="mt-3">
                <Form.Label>Chọn sản phẩm trả hàng <span className="text-danger">*</span></Form.Label>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th width="5%"></th>
                      <th width="40%">Sản phẩm</th>
                      <th width="15%">Đơn giá</th>
                      <th width="20%">Số lượng trả</th>
                      <th width="20%">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items.map(item => {
                      const selectedItem = selectedItems.find(i => i.id === item.id);
                      const isSelected = !!selectedItem;
                      const soLuongTra = selectedItem ? selectedItem.soLuongTra : 1;

                      return (
                        <tr key={item.id}>
                          <td>
                            <Form.Check
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleItemSelection(e, item)}
                            />
                          </td>
                          <td>{item.giay}</td>
                          <td>{item.donGia?.toLocaleString()} VNĐ</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={!isSelected}
                                onClick={() => handleQuantityChange(item.id, soLuongTra - 1)}
                              >
                                -
                              </Button>
                              <Form.Control
                                type="number"
                                min="1"
                                max={item.soLuong}
                                className="mx-2 text-center"
                                value={soLuongTra}
                                disabled={!isSelected}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                                style={{ width: "60px" }}
                              />
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={!isSelected || soLuongTra >= item.soLuong}
                                onClick={() => handleQuantityChange(item.id, soLuongTra + 1)}
                              >
                                +
                              </Button>
                              <span className="ml-2 text-muted small">
                                / {item.soLuong}
                              </span>
                            </div>
                          </td>
                          <td>
                            {isSelected ? (item.donGia * soLuongTra).toLocaleString() : 0} VNĐ
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Form.Group>
            </Form>
          ) : (
            <p>Đang tải chi tiết đơn hàng...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="danger" type="submit" onClick={handleSubmit} disabled={selectedItems.length === 0}>
            Gửi yêu cầu trả hàng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReturnRequestModal;