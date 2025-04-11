import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getGiayChitietDetail,
  getAllGiayChiTiet,
  getGiayChitietDetail1,
  getListGoiYSanPham,
  detailGiayChiTiet2,
} from "../service/GiayChiTietService";
import { getGiayDetail } from "../service/GiayService";
import "./sanphamchitiet.css";
import { addToCart, getByKhachHangId } from "../service/GioHangChiTietService";
import { Avatar, Button, Divider, message, Pagination, Rate } from "antd";
import { getProductDanhGiaById } from "../service/DanhGiaService";
import { LeftOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
const ProductDetailSPTT = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productGiay, setProductGiay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bienTheList, setBienTheList] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(productGiay?.giaBan || 0);
  const [selectedVariantDetails, setSelectedVariantDetails] = useState(null);
  const [sizeList, setSizeList] = useState([]);

  const [anhCHiTiet, setanhCHiTiet] = useState([]);
  const [soLuongChitiet, setSoLuongChiTiet] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [selectedSimilarProduct, setSelectedSimilarProduct] = useState(null);

  // State cho phần đánh giá - chỉ hiển thị
  const [danhGiaList, setDanhGiaList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ref cho carousel sản phẩm tương tự
  const carouselRef = useRef(null);
  // State cho phần đánh giá - chỉ hiển thị

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentReviews = danhGiaList.slice(startIndex, endIndex);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      console.log(`🔍 Đang lấy dữ liệu sản phẩm với ID: ${id}`);

      const giayChiTietResponse = await detailGiayChiTiet2(id);
      const item = giayChiTietResponse.data;

      console.log("✅ Thông tin giày chi tiết:", item);

      const giayChitiet = {
        id: item.id,
        tenGiay: item.giayEntity?.ten,
        tenMauSac: item.mauSacEntity?.ten,
        giaBan: item.giaBan,
        giaKhiGiam: item.giaKhiGiam,
        tenKichCo: item.kichCoEntity?.ten,
        soLuong: item.soLuongTon,
        anh: item.danhSachAnh?.[0]?.tenUrl,
      };
      console.log("✅ Thông tin giày chi tiếtaaa:", giayChitiet);
      setSelectedSize(item.kichCoEntity?.ten);
      setSelectedColor(item.mauSacEntity?.ten);
      setProductGiay(giayChitiet);
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", error);
    }
  };

  const handleAddToCart = async () => {
    

    // ✅ Log thông tin biến thể được thêm vào giỏ hàng
    console.log("Thông tin giày gửi lên giỏ hàng:", {
      idGiayChiTiet: productGiay.id,
      tenMauSac: selectedSize,
      tenKichCo: selectedSize,
      soLuong: quantity,
      giaBan: productGiay.giaBan,
      giaKhiGiam: productGiay.giaKhiGiam ?? null,
    });

    try {
      const response = await addToCart(productGiay.id, quantity);
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
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="product-detail">
      <div className="left">
        <div className="product-images">
          {productGiay && productGiay.anh ? (
            <img
              src={productGiay.anh}
              alt={productGiay.tenGiay || "Ảnh sản phẩm"}
              style={{ width: "600px", height: "600px", margin: "5px" }}
            />
          ) : (
            <p>Không có hình ảnh.</p>
          )}
        </div>
      </div>

      <div className="right">
        <div className="product-info">
          <p className="product-title">{productGiay?.tenGiay}</p>
          <div className="product-price">
            {productGiay?.giaKhiGiam ? (
              <>
                <span className="original-price">
                  {Number(productGiay.giaBan ?? 0).toLocaleString()}₫
                </span>
                <span className="discounted-price">
                  {Number(productGiay.giaKhiGiam ?? 0).toLocaleString()}₫
                </span>
              </>
            ) : (
              <span className="discounted-price">
                {Number(currentPrice ?? 0).toLocaleString()}₫
              </span>
            )}
          </div>
        </div>

        <div className="product-options">
          <div>
            <p>
              <strong>Kích cỡ:</strong> {productGiay?.tenKichCo}
            </p>
          </div>

          {/* Màu sắc */}
          <div>
            <p>
              <strong>Màu sắc:</strong> {productGiay?.tenMauSac}
            </p>
          </div>
          <div>
            <p>
              <strong>Số lượng:</strong> {productGiay?.soLuong}
            </p>
          </div>

          {/* Số lượng */}
          <div className="quantity">
            <div>
              <strong>Số lượng:</strong>
              <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </Button>
              <span>{quantity}</span>
              <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
            </div>
            {(selectedSize ? soLuongChitiet : totalQuantity) > 0 && (
              <p style={{ color: "red", fontSize: "10px" }}>
                ( Số Lượng: {selectedSize ? soLuongChitiet : totalQuantity} )
              </p>
            )}
          </div>

          {/* Nút Mua ngay */}
          <div
            className="buy-button"
            onClick={handleAddToCart}
            style={{ borderRadius: "15px" }}
          >
            MUA NGAY VỚI GIÁ{" "}
            {productGiay?.giaKhiGiam
              ? productGiay.giaKhiGiam.toLocaleString()
              : productGiay?.giaBan?.toLocaleString() || "0"}
            ₫
          </div>
        </div>

        {/* Chính sách */}
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
      {/* <div className="product-reviews">
        <Divider orientation="left">
          <h2>Đánh giá từ khách hàng</h2>
        </Divider>

       
        <div className="review-summary">
          <div className="rating-overview">
            <div className="rating-score">
              <div className="average-rating">{averageRating}</div>
              <Rate disabled value={parseFloat(averageRating)} allowHalf />
              <div className="total-reviews">{totalReviews} đánh giá</div>
            </div>
          </div>
        </div>

     
        <div className="review-list">
          {danhGiaList.length > 0 ? (
            <>
            
              {danhGiaList
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((review, index) => (
                  <div key={review.id || index} className="review-item">
                    <div className="review-header">
                      <Avatar icon={<UserOutlined />} />
                      <div className="reviewer-info">
                        <div className="reviewer-name">
                          {review.userFullName || "Khách hàng"}
                        </div>
                        <div className="review-date">
                          {formatDate(review.ngayNhanXet)}
                        </div>
                      </div>
                    </div>
                    <div className="review-rating">
                      <Rate disabled value={review.saoDanhGia} />
                    </div>
                    <div className="review-content">{review.nhanXet}</div>
                    <Divider />
                  </div>
                ))}

            
              <div
                className="pagination-container"
                style={{ textAlign: "center", margin: "20px 0" }}
              >
                <Pagination
                  current={currentPage}
                  total={danhGiaList.length}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <div className="no-reviews">
              <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
          )}
        </div>

      </div> */}
    </div>
  );
};

export default ProductDetailSPTT;
