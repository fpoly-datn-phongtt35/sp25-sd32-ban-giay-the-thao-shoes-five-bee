import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Rate, Input, message } from 'antd'; // Import Modal, Rate, Input, message từ Ant Design
import { addDanhGia } from '../service/DanhGiaService';

const DanhGiaComponent = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [searchParams] = useSearchParams();
  const hoaDonChiTietId = searchParams.get('hoaDonChiTietId');
  const userId = searchParams.get('userId');
  const currentDate = new Date().toISOString().split('T')[0];

  // Hàm xử lý khi submit đánh giá
  const handleSubmitReview = async () => {
    try {
      const response = await addDanhGia({
        hoaDonChiTietId,
        userId,
        saoDanhGia: rating,
        nhanXet: reviewText,
        ngayNhanXet: currentDate
      });
      message.success('Đánh giá thành công');
      setIsReviewModalVisible(false);
    } catch (error) {
      setMessageContent('Có lỗi xảy ra. Vui lòng thử lại sau.');
      message.error('Đánh giá không thành công');
    }
  };

  useEffect(() => {
    if (!hoaDonChiTietId) {
      setMessageContent('ID hóa đơn chi tiết không hợp lệ.');
      message.error('ID không hợp lệ');
    }
  }, [hoaDonChiTietId]);

  return (
    <div>
      {/* Hiển thị Modal khi người dùng muốn đánh giá */}
      <button onClick={() => setIsReviewModalVisible(true)}>Đánh giá sản phẩm</button>

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

      {/* Hiển thị thông báo lỗi hoặc thành công */}
      {messageContent && <p>{messageContent}</p>}
    </div>
  );
};

export default DanhGiaComponent;