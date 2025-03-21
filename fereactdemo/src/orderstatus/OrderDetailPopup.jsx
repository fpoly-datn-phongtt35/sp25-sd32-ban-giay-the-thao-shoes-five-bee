import { Button, message, Modal, Select } from 'antd'; 
import './OrderDetailPopup.css';
import { useEffect, useState } from 'react';
import { fetchCustomerId } from '../service/LoginService';
import { getDiaChiByKhachHangId } from '../service/DiaChiService';
import { updateOrderAddress } from '../service/HoaDonService';

const OrderDetailPopup = ({ selectedOrder, isPopupVisible, togglePopup, handlePrint }) => {
  const [khachHangId, setKhachHangId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState(selectedOrder);

  useEffect(() => {
    if (selectedOrder) {
      setUpdatedOrder(selectedOrder);
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

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
      message.error("Không tìm thấy địa chỉ");
      return;
    }

    try {
      await updateOrderAddress(updatedOrder.id, selectedAddressId);
      setUpdatedOrder(prevOrder => ({
        ...prevOrder,
        diaChi: selectedAddress.tenDiaChi || '',
        xa: selectedAddress.xa || '',
        huyen: selectedAddress.huyen || '',
        tinh: selectedAddress.tinh || ''
      }));
      selectedOrder.hoTen = selectedAddress.hoTen || '';
      selectedOrder.soDienThoai = selectedAddress.soDienThoai || '';
      selectedOrder.diaChi = selectedAddress.tenDiaChi || '';
      selectedOrder.xa = selectedAddress.xa || '';
      selectedOrder.huyen = selectedAddress.huyen || '';
      selectedOrder.tinh = selectedAddress.tinh || '';

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

  return (
    isPopupVisible && (
      <div className="popup-overlay" onClick={togglePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="HoaDonChiTiet">
            <h1>Chi tiết hóa đơn</h1>
          </div>
          <Button style={{ float: 'right' }} onClick={togglePopup}>Back</Button>
          <Button style={{ float: 'right', marginRight: '10px' }} type="primary" onClick={handlePrint}>
            Print
          </Button>
          <div className="thongtinhoadon">
            <div className="trai">
              <h4>Chi Tiết Đơn Hàng </h4>
              <h6>Mã Hóa Đơn: {selectedOrder?.ma || 'N/A'}</h6>
              <h6>Ngày Mua: {selectedOrder?.ngayTao.split('T')[0] || 'N/A'}</h6>
              <h6>Hình Thức Mua: {selectedOrder?.hinhThucMua === 2 ? "Online" : selectedOrder?.hinhThucMua === 1 ? "Online" : 'N/A'}</h6>
              <h6>Hình Thức Thanh Toán: {selectedOrder?.hinhThucThanhToan === 1 ? "VNpay" : selectedOrder?.hinhThucThanhToan === 2 ? "Thu hộ (COD)" : 'N/A'}</h6>
              <h6>Tổng Tiền: {selectedOrder?.tongTien?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}</h6>
            </div>
            <div className="phai">
              <h4>Thông tin khách hàng</h4>
              <h6>Tên Khách Hàng: {selectedOrder?.tenNguoiNhan || 'N/A'}</h6>
              <h6>Số Điện Thoại: {selectedOrder?.sdtNguoiNhan || 'N/A'}</h6>
              <h6>Địa Chỉ: 
              {selectedOrder?.diaChi 
              ? `${selectedOrder.diaChi || ''}, ${selectedOrder.xa || ''}, ${selectedOrder.huyen || ''}, ${selectedOrder.tinh || ''}` 
              : 'N/A'}
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
                  style={{ width: '100%' }}
                  onChange={setSelectedAddressId}
                  value={selectedAddressId}
                  placeholder="Chọn địa chỉ mới"
                >
                  {addresses.map(addr => (
                    <Select.Option 
                      key={addr.id} 
                      value={addr.id}
                    >
                      {`${addr.tenDiaChi}, ${addr.xa}, ${addr.huyen}, ${addr.thanhPho}`}
                    </Select.Option>
                  ))}
                </Select>
              </Modal>       
            </div>
          </div>
          <div>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Màu sắc</th>
                  <th>Kích cỡ</th>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder?.items.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={product.giayChiTietEntity?.giayEntity?.anhGiayEntities[0]?.tenUrl || '/placeholder.jpg'}
                        alt={product.giayChiTietEntity?.giayEntity?.ten || 'Hình ảnh sản phẩm'}
                        style={{ width: '50px', height: '50px' }}
                      />
                      {product.giayChiTietEntity?.giayEntity?.ten || 'N/A'}
                    </td>
                    <td>{product.giayChiTietEntity?.mauSacEntity?.ten || 'N/A'}</td>
                    <td>{product.giayChiTietEntity?.kichCoEntity?.ten || 'N/A'}</td>
                    <td>{product.giaBan?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}</td>
                    <td>{product.soLuong}</td>
                    <td>
                      {(product.soLuong * product.giaBan)?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" style={{ textAlign: 'right' }}><strong>Tổng cộng:</strong></td>
                  <td>
                    <strong>
                      {selectedOrder?.items.reduce((total, product) => total + (product.soLuong * product.giaBan), 0)
                        .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderDetailPopup;