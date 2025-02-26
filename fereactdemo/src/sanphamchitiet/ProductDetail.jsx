import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getGiayChitietDetail,
  getAllGiayChiTiet,
} from "../service/GiayChiTietService";
import { getGiayDetail } from "../service/GiayService";
import "./sanphamchitiet.css";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productGiay, setProductGiay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      console.log(`🔍 Đang lấy dữ liệu sản phẩm với ID: ${id}`);
      const giayDto = { id };
      const giayResponse = await getGiayDetail(giayDto);
      const giayChiTietResponse = await getAllGiayChiTiet(id); // Lấy danh sách chi tiết giày

      console.log("Kết quả từ getGiayDetail:", giayResponse.data);
      console.log("Kết quả từ getAllGiayChiTiet:", giayChiTietResponse.data);

      // Kiểm tra nếu giayChiTietResponse.data là mảng
      if (
        Array.isArray(giayChiTietResponse.data) &&
        giayChiTietResponse.data.length > 0
      ) {
        setProduct(giayChiTietResponse.data[0]); // Lấy sản phẩm đầu tiên
      } else {
        setProduct(null);
      }

      setProductGiay(giayResponse.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>; // Hiển thị khi đang tải
  if (!product || !productGiay) return <p>Không tìm thấy sản phẩm.</p>; // Kiểm tra dữ liệu

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
                style={{ width: "150px", height: "150px", margin: "5px" }}
              />
            ))
          ) : (
            <p>Không có hình ảnh.</p>
          )}
        </div>
      </div>
      <div className="right">
        <div className="product-info">
          <p className="product-title">{productGiay.ten}</p>
          <p className="product-price">{product.giaBan.toLocaleString()}₫</p>
        </div>

        <div className="product-options">
          <div>
            <strong>Kích thước:</strong>
            <div className="size-options">
              {[38, 39, 40, 41, 42, 43, 44, 45].map((size) => (
                <div
                  key={size}
                  className={`size-box ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Màu sắc */}
          <div>
            <strong>Màu sắc:</strong>
            <div className="color-options">
              {["BLACK", "BROWN", "L-BROWN"].map((color) => (
                <div
                  key={color}
                  className={`color-box ${
                    selectedColor === color ? "active" : ""
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </div>
              ))}
            </div>
          </div>

          {/* Số lượng */}
          <div className="quantity">
            <strong>Số lượng:</strong>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          {/* Nút Mua ngay */}
          <div className="buy-button">
            MUA NGAY VỚI GIÁ {product.giaBan.toLocaleString()}₫
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
    </div>
  );
};

export default ProductDetail;
