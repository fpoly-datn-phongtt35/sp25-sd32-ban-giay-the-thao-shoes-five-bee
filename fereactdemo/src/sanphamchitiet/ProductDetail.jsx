import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getGiayChitietDetail,
  getAllGiayChiTiet,
  getGiayChitietDetail1,
} from "../service/GiayChiTietService";
import { getGiayDetail } from "../service/GiayService";
import "./sanphamchitiet.css";
import { addToCart } from "../service/GioHangChiTietService";
import { Button, message, Rate, Avatar, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { getProductDanhGiaById } from "../service/DanhGiaService";


const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productGiay, setProductGiay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bienTheList, setBienTheList] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  
  // State cho phần đánh giá - chỉ hiển thị
  const [danhGiaList, setDanhGiaList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchProductDetail();
    fetchProductReviews();
  }, [id]);

  // Lấy chi tiết sản phẩm
  const fetchProductDetail = async () => {
    try {
      console.log(`🔍 Đang lấy dữ liệu sản phẩm với ID: ${id}`);
      const giayDto = { id };
      const giayResponse = await getGiayDetail(giayDto);
      const giayChiTietResponse = await getGiayChitietDetail1(id);

      console.log("Kết quả từ getGiayDetail:", giayResponse.data);
      console.log("Kết quả từ getAllGiayChiTiet:", giayChiTietResponse.data);

      if (
        Array.isArray(giayChiTietResponse.data) &&
        giayChiTietResponse.data.length > 0
      ) {
        const bienTheSanPham = giayChiTietResponse.data.map((item) => ({
          idMauSac: item.mauSacEntity?.id,
          tenMauSac: item.mauSacEntity?.ten,
          idGiayChiTiet: item.id,
          giaBan: item.giaBan,
          idKichCo: item.kichCoEntity?.id,
          tenKichCo: item.kichCoEntity?.ten,
        }));

        console.log("Danh sách biến thể sản phẩm:", bienTheSanPham);
        setBienTheList(bienTheSanPham);
      } else {
        setBienTheList([]);
      }

      setProductGiay(giayResponse.data);
      setProduct(giayChiTietResponse.data);
      setCurrentPrice(giayResponse.data?.giaBan || 0);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách đánh giá
  const fetchProductReviews = async () => {
    try {
      console.log("🔍 Gọi API đánh giá với ID Giày:", id); 
      const response = await getProductDanhGiaById(id);
      console.log("📌 Kết quả API đánh giá:", response.data);
  
      if (Array.isArray(response.data)) {
        setDanhGiaList(response.data);
        setTotalReviews(response.data.length);
  
        if (response.data.length > 0) {
          const totalRating = response.data.reduce((sum, item) => sum + item.saoDanhGia, 0);
          setAverageRating((totalRating / response.data.length).toFixed(1));
        }
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy đánh giá:", error);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const selectedVariant = bienTheList.find(
      (item) => item.tenMauSac === color
    );

    if (selectedVariant) {
      setCurrentPrice(selectedVariant.giaBan);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      message.warning("Vui lòng chọn kích thước và màu sắc!");
      return;
    }
    const selectedVariant = bienTheList.find(
      (item) =>
        item.tenMauSac === selectedColor && item.tenKichCo === selectedSize
    );
    if (!selectedVariant) {
      message.error("Không tìm thấy sản phẩm với lựa chọn này!");
      return;
    }
    try {
      const response = await addToCart(selectedVariant.idGiayChiTiet, quantity);
      if (response.status === 200) {
        message.success("Đã thêm vào giỏ hàng thành công!");
      } else {
        message.error("Thêm vào giỏ hàng thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  // Format date từ chuỗi ISO
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="product-detail">
      <div className="left">
        <div className="product-images">
          {productGiay.anhGiayEntities?.length > 0 ? (
            productGiay.anhGiayEntities.map((anh, index) => (
              <img
                key={anh.id || index}
                src={anh.tenUrl || "default_image.jpg"}
                alt={productGiay.ten}
                style={{ width: "600px", height: "600px", margin: "5px" }}
              />
            ))
          ) : (
            <p>Không có hình ảnh.</p>
          )}
        </div>
      </div>
      <div className="right">
        <div className="product-info">
          <p className="product-title">{productGiay?.ten}</p>
          <p className="product-price">
            {selectedColor
              ? Number(currentPrice).toLocaleString()
              : Number(productGiay?.giaBan ?? 0).toLocaleString()}
            ₫
          </p>
        </div>

        <div className="product-options">
          <div>
            <strong>Kích thước:</strong>
            <div className="size-options">
              {[...new Set(bienTheList.map((item) => item.tenKichCo))].map(
                (size) => (
                  <div
                    key={size}
                    className={`size-box ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <strong>Màu sắc:</strong>
            <div className="color-options">
              {[...new Set(bienTheList.map((item) => item.tenMauSac))].map(
                (color) => (
                  <div
                    key={color}
                    className={`color-box ${
                      selectedColor === color ? "active" : ""
                    }`}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="quantity">
            <strong>Số lượng:</strong>
            <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </Button>
            <span>{quantity}</span>
            <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
          </div>

          <div className="buy-button" onClick={handleAddToCart} style={{borderRadius: "15px"}}> 
            MUA NGAY VỚI GIÁ {""}
            {selectedColor
              ? currentPrice.toLocaleString()
              : productGiay?.giaBan?.toLocaleString() || "0"}
            ₫
          </div>
        </div>

        <div className="policy">
          <p>
            ✅ KIỂM TRA HÀNG VÀ THANH TOÁN KHI <strong>NHẬN HÀNG</strong>
          </p>
          <p>
            🚛 GIAO HÀNG <strong>TOÀN QUỐC</strong>
          </p>
          <p>
            🛠️ SẢN PHẨM GIÀY TÂY: BẢO HÀNH <strong>3 NĂM</strong>
          </p>
          <p>
            🔄 ĐỔI HÀNG TRONG VÒNG <strong>33 NGÀY</strong>
          </p>
        </div>
      </div>

      {/* Phần đánh giá sản phẩm - chỉ hiển thị */}
      <div className="product-reviews">
        <Divider orientation="left">
          <h2>Đánh giá từ khách hàng</h2>
        </Divider>
        
        {/* Tổng quan đánh giá */}
        <div className="review-summary">
          <div className="rating-overview">
            <div className="rating-score">
              <div className="average-rating">{averageRating}</div>
              <Rate disabled value={parseFloat(averageRating)} allowHalf />
              <div className="total-reviews">{totalReviews} đánh giá</div>
            </div>
          </div>
        </div>

        {/* Danh sách đánh giá */}
        <div className="review-list">
      {danhGiaList.length > 0 ? (
      danhGiaList.map((review, index) => (
      <div key={review.id || index} className="review-item">
        <div className="review-header">
          <Avatar icon={<UserOutlined />} />
          <div className="reviewer-info">
            <div className="reviewer-name">{review.userEntity?.hoTen || "Khách hàng"}</div>
            <div className="review-date">{formatDate(review.ngayNhanXet)}</div>
          </div>
        </div>
        <div className="review-rating">
          <Rate disabled value={review.saoDanhGia} />
        </div>
        <div className="review-content">{review.nhanXet}</div>
        <Divider />
      </div>
    ))
    ) : (
    <div className="no-reviews">
      <p>Chưa có đánh giá nào cho sản phẩm này.</p>
    </div>
    )}
  </div>
      </div>
    </div>
  );
};

export default ProductDetail;