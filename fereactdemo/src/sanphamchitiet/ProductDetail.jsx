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
import { Button, message } from "antd";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productGiay, setProductGiay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bienTheList, setBienTheList] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(productGiay?.giaBan || 0);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      console.log(`🔍 Đang lấy dữ liệu sản phẩm với ID: ${id}`);
      const giayDto = { id };
      const giayResponse = await getGiayDetail(giayDto);
      const giayChiTietResponse = await getGiayChitietDetail1(id); // Lấy danh sách chi tiết giày

      console.log("Kết quả từ getGiayDetail:", giayResponse.data);
      console.log("Kết quả từ getAllGiayChiTiet:", giayChiTietResponse.data);

      if (
        Array.isArray(giayChiTietResponse.data) &&
        giayChiTietResponse.data.length > 0
      ) {
        // Trích xuất màu sắc, kích cỡ và thông tin liên quan
        const bienTheSanPham = giayChiTietResponse.data.map((item) => ({
          idMauSac: item.mauSacEntity?.id, // ID màu sắc
          tenMauSac: item.mauSacEntity?.ten, // Tên màu sắc
          idGiayChiTiet: item.id, // ID giày chi tiết
          giaBan: item.giaBan, // Giá bán
          idKichCo: item.kichCoEntity?.id, // ID kích cỡ
          tenKichCo: item.kichCoEntity?.ten, // Tên kích cỡ
        }));

        console.log("Danh sách biến thể sản phẩm:", bienTheSanPham);
        setBienTheList(bienTheSanPham); // Cập nhật state
      } else {
        setBienTheList([]); // Nếu không có dữ liệu, gán mảng rỗng
      }

      setProductGiay(giayResponse.data);
      setProduct(giayChiTietResponse.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleColorSelect = (color) => {
    setSelectedColor(color);

    // Tìm biến thể đầu tiên có màu sắc được chọn
    const selectedVariant = bienTheList.find(
      (item) => item.tenMauSac === color
    );

    if (selectedVariant) {
      setCurrentPrice(selectedVariant.giaBan); // Cập nhật giá
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

  if (loading) return <p>Đang tải dữ liệu...</p>; // Hiển thị khi đang tải

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

          {/* Màu sắc */}
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

          {/* Số lượng */}
          <div className="quantity">
            <strong>Số lượng:</strong>
            <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </Button>
            <span>{quantity}</span>
            <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
          </div>

          {/* Nút Mua ngay */}
          <div className="buy-button" onClick={handleAddToCart} style={{borderRadius: "15px"}}> 
            MUA NGAY VỚI GIÁ {""}
            {selectedColor
              ? currentPrice.toLocaleString()
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
    </div>
  );
};

export default ProductDetail;
