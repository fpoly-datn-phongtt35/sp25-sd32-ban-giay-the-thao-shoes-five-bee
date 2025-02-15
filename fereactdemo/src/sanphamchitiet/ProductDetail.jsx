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
  const [giayChiTietDetail, setGiayChiTietDetail] = useState({
    id: "",
    giaBan: 0,
    kichCo: [],
    mauSac: [],
    soLuongTon: 0,
    trangThai: 0,
  });
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
        setProduct(productResponse.data);
        setGiayChiTiet(detailResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    };

    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    if (selectedColor && selectedSize) {
      const matchedItem = giayChiTiet.find(
        (item) =>
          item.mauSac.id === selectedColor && item.kichCo.id === selectedSize
      );
      if (matchedItem) {
        setGiayChiTietDetail(matchedItem);
        setQuantity(1); // Reset quantity khi có sự thay đổi
      } else {
        setGiayChiTietDetail({ id: "", kichCo: [], mauSac: [], soLuongTon: 0 });
      }
    } else {
      setGiayChiTietDetail({ id: "", kichCo: [], mauSac: [], soLuongTon: 0 });
    }
  }, [selectedColor, selectedSize, giayChiTiet]);

  // Hàm xử lý khi chọn màu sắc
  const handleColorChange = (colorId) => {
    setSelectedColor(colorId);
    setSelectedSize(null); // Reset kích cỡ khi chọn màu mới
  };
  const handleAddToCart = () => {
    if (
      giayChiTietDetail.id &&
      selectedColor &&
      selectedSize &&
      giayChiTietDetail.soLuongTon > 0
    ) {
      addToCart({
        giayChiTietId: giayChiTietDetail.id,
        soLuong: quantity,
      });
      navigate("/cart");
    } else {
      alert("Vui lòng chọn màu sắc, kích cỡ và kiểm tra hàng tồn kho.");
    }
    console.log("số lượng", quantity);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < giayChiTietDetail.soLuongTon) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const uniqueColors = Array.from(
    new Set(giayChiTiet.map((item) => item.mauSac.id))
  ).map((id) => giayChiTiet.find((item) => item.mauSac.id === id));
  const uniqueSizes = Array.from(
    new Set(giayChiTiet.map((item) => item.kichCo.id))
  ).map((id) => giayChiTiet.find((item) => item.kichCo.id === id));

  if (!product) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="header1">
        <Header />
      </div>
      <div className="product-detail">
        <div className="detail_img">
          <img
            src={`http://localhost:5000/upload/${product.anhGiay.tenUrl}`}
            alt={product.ten}
          />
        </div>
        <div className="detail_content">
          <h2>{product.ten}</h2>
          <p>{product.moTa}</p>
          <p className="product_price1">
            Giá:{" "}
            {giayChiTietDetail.giaBan
              ? giayChiTietDetail.giaBan.toLocaleString()
              : "0"}{" "}
            VND
          </p>

          <div className="options">
            <div className="colors">
              <h3>Màu Sắc:</h3>
              <div className="option-buttons">
                {uniqueColors.map((item) => (
                  <button
                    key={item.mauSac.id}
                    className={`color-button ${
                      selectedColor === item.mauSac.id ? "selected" : ""
                    }`}
                    disabled={
                      !giayChiTiet.some(
                        (gt) =>
                          gt.mauSac.id === item.mauSac.id && gt.soLuongTon > 0
                      )
                    }
                    onClick={() => handleColorChange(item.mauSac.id)} // Sử dụng hàm handleColorChange
                  >
                    {item.mauSac.ten}
                  </button>
                ))}
              </div>
            </div>

            <div className="sizes">
              <h3>Kích Cỡ:</h3>
              <div className="option-buttons">
                {uniqueSizes.map((item) => {
                  // Kiểm tra xem có tồn kho cho size và màu sắc đã chọn không
                  const matchingItem = giayChiTiet.find(
                    (gt) =>
                      gt.kichCo.id === item.kichCo.id &&
                      gt.mauSac.id === selectedColor
                  );
                  const isAvailable = matchingItem
                    ? matchingItem.soLuongTon > 0
                    : false;

                  return (
                    <button
                      key={item.kichCo.id}
                      className={`size-button ${
                        selectedSize === item.kichCo.id ? "selected" : ""
                      }`}
                      disabled={!matchingItem || !isAvailable} // Disabled nếu không có matchingItem hoặc không có hàng
                      onClick={() => setSelectedSize(item.kichCo.id)}
                    >
                      {item.kichCo.ten}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="quantity-control">
            <h3>Số lượng:</h3>
            <button
              className="decrease-btn"
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button
              className="increase-btn"
              onClick={handleIncreaseQuantity}
              disabled={quantity >= giayChiTietDetail.soLuongTon}
            >
              +
            </button>
            <div className="soluongton">
              <p>{giayChiTietDetail.soLuongTon} sản phẩm có sẵn</p>
            </div>
          </div>
          <button
            className="add_to_cart_button"
            onClick={handleAddToCart}
            disabled={giayChiTietDetail.soLuongTon === 0}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      <div className="chitietsanpham">
        <h4>CHI TIẾT SẢN PHẨM</h4>
        <br />
        <div>
          <p>Xuất Xứ: {product.xuatXu.ten}</p>
          <p>Thương Hiệu: {product.thuongHieu.ten}</p>
          <p>Mô Tả: {product.moTa}</p>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;
