import { Button, Input, message, Modal, Rate, Select } from "antd";
import "./OrderDetailPopup.css";
import { useEffect, useState } from "react";
import { fetchCustomerId } from "../service/LoginService";
import { getDiaChiByKhachHangId } from "../service/DiaChiService";
import { tachNguoiNhanMoiInHoaDon, updateOrderAddress } from "../service/HoaDonService";
import { addDanhGia } from "../service/DanhGiaService";

const OrderDetailPopup = ({
  selectedOrder,
  isPopupVisible,
  togglePopup,
  handlePrint,
}) => {
  const [khachHangId, setKhachHangId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState(selectedOrder);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewedProductIds, setReviewedProductIds] = useState([]);
  const [tenNguoiNhanMoi, setTenNguoiNhanMoi] = useState('');
  const [sdtNguoiNhanMoi, setSdtNguoiNhanMoi] = useState('');
  const [formData, setFormData] = useState({
    tenNguoiNhanMoi: selectedOrder?.tenNguoiNhanMoi || "",
    sdtNguoiNhanMoi: selectedOrder?.sdtNguoiNhanMoi || "",
  });
  useEffect(() => {
    if (selectedOrder) {
      setUpdatedOrder(selectedOrder);
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (selectedOrder) {
      setFormData({
        tenNguoiNhanMoi: selectedOrder?.tenNguoiNhanMoi || "",
        sdtNguoiNhanMoi: selectedOrder?.sdtNguoiNhanMoi || "",
      });
    }
  }, [selectedOrder]);

  useEffect(() => {
    const getCustomerId = async () => {
      const id = await fetchCustomerId();
      if (id) {
        setKhachHangId(id);
      } else {
        alert("Không thể lấy ID khách hàng. Vui lòng thử lại.");
      }
    };
    getCustomerId();
  }, []);

  const fetchAddresses = async () => {
    if (!khachHangId) return;
    try {
      const response = await getDiaChiByKhachHangId(khachHangId);
      if (!response.data || response.data.length === 0) {
        message.warning("Không có địa chỉ nào được tìm thấy.");
      }
      setAddresses(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      message.error("Lỗi khi lấy danh sách địa chỉ");
    }
  };

  const handleOpenReviewModal = (product) => {
    setSelectedProduct(product);
    setIsReviewModalVisible(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct || rating === 0 || !reviewText.trim()) {
      message.warning("Vui lòng nhập đầy đủ thông tin đánh giá");
      return;
    }

    console.log("Selected product:", selectedProduct);
    console.log("Product ID:", selectedProduct?.id);

    // lấy ngày hiện tại
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      await addDanhGia({
        hoaDonChiTietId: selectedProduct.id,
        userId: khachHangId,
        saoDanhGia: rating,
        nhanXet: reviewText,
        ngayNhanXet: currentDate,
      });
      message.success("Đánh giá đã được gửi thành công");
      setReviewedProductIds((prev) => [...prev, selectedProduct.id]);
      setIsReviewModalVisible(false);
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Lỗi khi thêm đánh giá:", error);
      message.error("Lỗi khi gửi đánh giá");
    }
  };

  const handleEditAddress = async () => {
    await fetchAddresses();
    setSelectedAddressId(selectedOrder.diaChiId);
    setIsModalVisible(true);
  };

  const handleUpdateAddress = async () => {
    if (!selectedAddressId) {
      message.warning("Vui lòng chọn địa chỉ");
      return;
    }

    const selectedAddress = addresses.find(
      (addr) => addr.id === selectedAddressId
    );
    if (!selectedAddress) {
      message.error("Không tìm thấy địa chỉ");
      return;
    }

    try {
      await updateOrderAddress(updatedOrder.id, selectedAddressId);
      setUpdatedOrder((prevOrder) => ({
        ...prevOrder,
        diaChiCuThe: selectedAddress.diaChiCuThe || "",
        xa: selectedAddress.xa || "",
        huyen: selectedAddress.huyen || "",
        tinh: selectedAddress.tinh || "",
      }));
      selectedOrder.hoTen = selectedAddress.hoTen || "";
      selectedOrder.soDienThoai = selectedAddress.soDienThoai || "";
      selectedOrder.diaChi = selectedAddress.diaChiCuThe || "";
      selectedOrder.xa = selectedAddress.xa || "";
      selectedOrder.huyen = selectedAddress.huyen || "";
      selectedOrder.tinh = selectedAddress.tinh || "";

      message.success("Cập nhật địa chỉ thành công");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Lỗi cập nhật:", error.response?.data || error.message);
      message.error("Lỗi khi cập nhật địa chỉ");
    }
  };

  if (!selectedOrder) {
    return null;
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await tachNguoiNhanMoiInHoaDon(selectedOrder.id, {
        tenNguoiNhanMoi: formData.tenNguoiNhanMoi,
        sdtNguoiNhanMoi: formData.sdtNguoiNhanMoi
      });
      
      // // Cập nhật lại selectedOrder
      // selectedOrder.tenNguoiNhan = formData.tenNguoiNhanMoi;
      // selectedOrder.sdtNguoiNhan = formData.sdtNguoiNhanMoi;
      
      setFormData({
        tenNguoiNhanMoi: formData.tenNguoiNhanMoi,
        sdtNguoiNhanMoi: formData.sdtNguoiNhanMoi
      });
      
      message.success("Thêm thông tin người nhận thành công");

      console.log(response);
      setUpdatedOrder((prev) => ({
        ...prev,
        tenNguoiNhan: formData.tenNguoiNhanMoi,
        sdtNguoiNhan: formData.sdtNguoiNhanMoi
      }));
    } catch (error) {
      message.warning(error.response?.data || 'Có lỗi xảy ra.');
    }
  };

  return (
    isPopupVisible && (
      <div className="popup-overlay" onClick={togglePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="HoaDonChiTiet">
            <h1>Chi tiết hóa đơn</h1>
          </div>
          <Button style={{ float: "right" }} onClick={togglePopup}>
            Back
          </Button>
          <Button
            style={{ float: "right", marginRight: "10px" }}
            type="primary"
            onClick={handlePrint}
          >
            Print
          </Button>
          <div className="thongtinhoadon">
            <div className="trai">
              <h4>Chi Tiết Đơn Hàng </h4>
              <h6>Mã Hóa Đơn: {selectedOrder?.ma || "N/A"}</h6>
              <h6>Ngày Mua: {selectedOrder?.ngayTao.split("T")[0] || "N/A"}</h6>
              <h6>
                Hình Thức Mua:{" "}
                {selectedOrder?.hinhThucMua === 2
                  ? "Online"
                  : selectedOrder?.hinhThucMua === 1
                  ? "Tại quầy"
                  : "N/A"}
              </h6>
              <h6>
                Hình Thức Thanh Toán:{" "}
                {selectedOrder?.hinhThucThanhToan === 0
                  ? "Tiền mặt"
                  : selectedOrder?.hinhThucThanhToan === 1
                  ? "VNpay"
                  : selectedOrder?.hinhThucThanhToan === 2
                  ? "Thu hộ (COD)"
                  : "N/A"}
              </h6>
              <h6>
                Tổng Tiền:{" "}
                {selectedOrder?.tongTien?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }) || "N/A"}
              </h6>
            </div>
            <div className="phai">
              <h4>Thông tin khách hàng</h4>
              <h6>Tên Khách Hàng : {selectedOrder?.tenNguoiNhan || "N/A"}</h6>
              <h6>Số Điện Thoại : {selectedOrder?.sdtNguoiNhan || "N/A"}</h6>
              <h6>
                Địa Chỉ :
                {selectedOrder?.diaChi
                  ? `${selectedOrder.diaChi || ""}, ${
                      selectedOrder.xa || ""
                    }, ${selectedOrder.huyen || ""}, ${
                      selectedOrder.tinh || ""
                    }`
                  : "Tại quầy"}
              </h6>
              {selectedOrder?.trangThai === 0 && (
                <Button type="primary" onClick={handleEditAddress}>
                  Chỉnh sửa địa chỉ
                </Button>
              )}
              <Modal
                title="Chọn địa chỉ mới"
                visible={isModalVisible}
                onOk={handleUpdateAddress}
                onCancel={() => setIsModalVisible(false)}
              >
                <Select
                  style={{ width: "100%" }}
                  onChange={setSelectedAddressId}
                  value={selectedAddressId}
                  placeholder="Chọn địa chỉ mới"
                >
                  {addresses.map((addr) => (
                    <Select.Option key={addr.id} value={addr.id}>
                      {`${addr.diaChiCuThe}, ${addr.xa}, ${addr.huyen}, ${addr.thanhPho}`}
                    </Select.Option>
                  ))}
                </Select>
              </Modal>
            </div>
          </div>
          <div className="phai">
            <h4>Thông tin người nhận</h4>

            {selectedOrder?.trangThai === 0 ? (
              <>
                <div className="info-row">
                  <h6 className="info-label">Tên người nhận:</h6>
                  <Input
                    placeholder="Tên người nhận"
                    value={formData.tenNguoiNhanMoi}
                    onChange={(e) =>
                      handleChange("tenNguoiNhanMoi", e.target.value)
                    }
                  />
                </div>

                <div className="info-row">
                  <h6 className="info-label">Số điện thoại:</h6>
                  <Input
                    placeholder="Số điện thoại"
                    value={formData.sdtNguoiNhanMoi}
                    onChange={(e) =>
                      handleChange("sdtNguoiNhanMoi", e.target.value)
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div className="info-row">
                  <h6 className="info-label">Tên người nhận:</h6>
                  <span>{selectedOrder?.tenNguoiNhan || "N/A"}</span>
                </div>
                <div className="info-row">
                  <h6 className="info-label">Số điện thoại:</h6>
                  <span>{selectedOrder?.sdtNguoiNhan || "N/A"}</span>
                </div>
              </>
            )}

            {selectedOrder?.trangThai === 0 && (
              <Button type="primary" onClick={handleSubmit}>
                Cập nhật thông tin người nhận
              </Button>
            )}

            <Modal
              title="Chọn địa chỉ mới"
              visible={isModalVisible}
              onOk={handleUpdateAddress}
              onCancel={() => setIsModalVisible(false)}
            >
              <Select
                style={{ width: "100%" }}
                onChange={setSelectedAddressId}
                value={selectedAddressId}
                placeholder="Chọn địa chỉ mới"
              >
                {addresses.map((addr) => (
                  <Select.Option key={addr.id} value={addr.id}>
                    {`${addr.diaChiCuThe}, ${addr.xa}, ${addr.huyen}, ${addr.thanhPho}`}
                  </Select.Option>
                ))}
              </Select>
            </Modal>
          </div>

          <div>
            <table
              border="1"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Màu sắc</th>
                  <th>Kích cỡ</th>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                  {selectedOrder?.trangThai === 2 && <th>Đánh giá</th>}
                </tr>
              </thead>
              <tbody>
                {selectedOrder?.items.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={
                          product.giayChiTietEntity?.giayEntity
                            ?.anhGiayEntities[0]?.tenUrl || "/placeholder.jpg"
                        }
                        alt={
                          product.giayChiTietEntity?.giayEntity?.ten ||
                          "Hình ảnh sản phẩm"
                        }
                        style={{ width: "50px", height: "50px" }}
                      />
                      {product.giayChiTietEntity?.giayEntity?.ten || "N/A"}
                    </td>
                    <td>
                      {product.giayChiTietEntity?.mauSacEntity?.ten || "N/A"}
                    </td>
                    <td>
                      {product.giayChiTietEntity?.kichCoEntity?.ten || "N/A"}
                    </td>
                    <td>
                      {product.giaBan?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || "N/A"}
                    </td>
                    <td>{product.soLuong}</td>
                    <td>
                      {(product.soLuong * product.giaBan)?.toLocaleString(
                        "vi-VN",
                        { style: "currency", currency: "VND" }
                      ) || "N/A"}
                    </td>
                    <td>
                      {selectedOrder?.trangThai === 2 &&
                        !reviewedProductIds.includes(product.id) && (
                          <Button
                            type="primary"
                            onClick={() => handleOpenReviewModal(product)}
                          >
                            Đánh giá
                          </Button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" style={{ textAlign: "right" }}>
                    <strong>Tổng cộng:</strong>
                  </td>
                  <td>
                    <strong>
                      {selectedOrder?.items
                        .reduce(
                          (total, product) =>
                            total + product.soLuong * product.giaBan,
                          0
                        )
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
            {/* Modal đánh giá */}
            <Modal
              title="Thêm đánh giá"
              visible={isReviewModalVisible}
              onOk={handleSubmitReview}
              onCancel={() => setIsReviewModalVisible(false)}
            >
              <div>
                <Rate onChange={setRating} value={rating} />
                <br />
                <br />
                <Input.TextArea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Nhập đánh giá của bạn"
                />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderDetailPopup;
