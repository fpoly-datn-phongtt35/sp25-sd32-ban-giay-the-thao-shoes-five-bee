import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGiayDetail } from "../service/GiayService";
import { detailGiayChiTiet1 } from "../service/GiayChiTietService";
import useCart from "../components/Cart";
import "./sanphamchitiet.css";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [giayChiTiet, setGiayChiTiet] = useState([]);
  const [giayChiTietDetail, setGiayChiTietDetail] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const [productResponse, detailResponse] = await Promise.all([
          getGiayDetail(id),
          detailGiayChiTiet1(id),
        ]);
        if (productResponse?.data) setProduct(productResponse.data);
        if (Array.isArray(detailResponse?.data)) setGiayChiTiet(detailResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    };
    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    if (selectedColor && selectedSize) {
      const matchedItem = giayChiTiet.find(
        (item) => item.mauSac?.id === selectedColor && item.kichCo?.id === selectedSize
      );
      setGiayChiTietDetail(matchedItem || null);
      setQuantity(1);
    }
  }, [selectedColor, selectedSize, giayChiTiet]);

  const handleColorChange = (colorId) => {
    setSelectedColor(colorId);
    setSelectedSize(null);
  };

  const handleAddToCart = () => {
    if (giayChiTietDetail && giayChiTietDetail.soLuongTon > 0) {
      addToCart({
        giayChiTietId: giayChiTietDetail.id,
        soLuong: quantity,
      });
      navigate("/cart");
    } else {
      alert("Vui lòng chọn màu sắc, kích cỡ và kiểm tra hàng tồn kho.");
    }
  };

  if (!product) return <div>Đang tải...</div>;

  const uniqueColors = [...new Map(giayChiTiet.map(item => [item.mauSac.id, item])).values()];
  const uniqueSizes = giayChiTiet.filter(item => item.mauSac.id === selectedColor);

  return (
    <div>
      <Header />
      <div className="product-detail">
        <div className="detail_img">
          <img src={`http://localhost:5000/upload/${product.anhGiay.tenUrl}`} alt={product.ten} />
        </div>
        <div className="detail_content">
          <h2>{product.ten}</h2>
          <p>{product.moTa}</p>
          <p className="product_price1">Giá: {giayChiTietDetail?.giaBan?.toLocaleString() || "0"} VND</p>
          <div className="options">
            <div className="colors">
              <h3>Màu Sắc:</h3>
              {uniqueColors.map((item) => (
                <button key={item.mauSac.id} className={selectedColor === item.mauSac.id ? "selected" : ""} onClick={() => handleColorChange(item.mauSac.id)}>
                  {item.mauSac.ten}
                </button>
              ))}
            </div>
            <div className="sizes">
              <h3>Kích Cỡ:</h3>
              {uniqueSizes.map((item) => (
                <button key={item.kichCo.id} className={selectedSize === item.kichCo.id ? "selected" : ""} onClick={() => setSelectedSize(item.kichCo.id)}>
                  {item.kichCo.ten}
                </button>
              ))}
            </div>
          </div>
          {giayChiTietDetail && (
            <div>
              <h3>Số lượng:</h3>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(quantity + 1, giayChiTietDetail.soLuongTon))}>+</button>
              <p>{giayChiTietDetail.soLuongTon} sản phẩm có sẵn</p>
            </div>
          )}
          <button onClick={handleAddToCart} disabled={!giayChiTietDetail || giayChiTietDetail.soLuongTon === 0}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
