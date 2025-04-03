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
  const [selectedVariantDetails, setSelectedVariantDetails] = useState(null);
  const [sizeList, setSizeList] = useState([]);
  const [anhCHiTiet, setanhCHiTiet] = useState([]);
  const [soLuongChitiet, setSoLuongChiTiet] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0); // Thêm dòng này để khai báo totalQuantity

  console.log("anh chi tiet", anhCHiTiet);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      console.log(`🔍 Đang lấy dữ liệu sản phẩm với ID: ${id}`);
      const giayDto = { id };
      const giayResponse = await getGiayDetail(giayDto);
      const giayChiTietResponse = await getGiayChitietDetail1(id); // Lấy danh sách chi tiết giày

      // console.log("Kết quả từ getGiayDetail:", giayResponse.data);
      console.log("Kết quả từ getAllGiayChiTiet:", giayChiTietResponse.data);

      if (
        Array.isArray(giayChiTietResponse.data) &&
        giayChiTietResponse.data.length > 0
      ) {
        const bienTheSanPham = giayChiTietResponse.data.map((item) => ({
          idMauSac: item.mauSacEntity?.id, // ID màu sắc
          tenMauSac: item.mauSacEntity?.ten, // Tên màu sắc
          idGiayChiTiet: item.id,
          giaBan: item.giaBan,
          idKichCo: item.kichCoEntity?.id,
          tenKichCo: item.kichCoEntity?.ten,
          soLuong: item.soLuongTon,
          anh: item.danhSachAnh,
        }));

        console.log("Danh sách biến thể sản phẩm:", bienTheSanPham);
        setBienTheList(bienTheSanPham);
      } else {
        setBienTheList([]);
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

    const variantsWithSameColor = bienTheList.filter(
      (item) => item.tenMauSac === color
    );
    console.log("aaa", variantsWithSameColor);

    if (variantsWithSameColor.length > 0) {
      const sizeList = variantsWithSameColor.map(
        (variant) => variant.tenKichCo
      );
      setSizeList(sizeList);
      setCurrentPrice(variantsWithSameColor[0].giaBan);

      // Lấy danh sách URL ảnh từ tất cả biến thể có cùng màu
      const imageList = variantsWithSameColor.flatMap((variant) =>
        variant.anh ? variant.anh.map((img) => img.tenUrl) : []
      );
      setanhCHiTiet(imageList);

      // Lấy danh sách số lượng từ các biến thể có cùng màu và kích cỡ
      const quantityList = variantsWithSameColor.map(
        (variant) => variant.soLuong
      );
      setSoLuongChiTiet(quantityList); // Lưu danh sách số lượng vào state

      // Tính tổng số lượng khi chưa chọn kích cỡ
      const totalQuantity = quantityList.reduce((acc, qty) => acc + qty, 0);
      setTotalQuantity(totalQuantity); // Cập nhật tổng số lượng vào state

      // Lưu danh sách kích cỡ, ảnh và số lượng
      setSelectedVariantDetails({
        tenMauSac: color,
        sizes: sizeList,
        images: imageList, // Thêm danh sách ảnh
        quantities: quantityList, // Thêm danh sách số lượng
      });

      console.log("Danh sách kích cỡ:", sizeList);
      console.log("Danh sách ảnh:", imageList);
      console.log("Danh sách số lượng:", quantityList); // Kiểm tra số lượng
      console.log("Tổng số lượng:", totalQuantity); // Kiểm tra tổng số lượng
    } else {
      console.log("Không tìm thấy biến thể nào có màu sắc được chọn");
    }
  };

  // Hàm xử lý khi chọn kích cỡ
  const handleSizeSelect = (size) => {
    // Tìm số lượng tương ứng với kích cỡ đã chọn
    const selectedVariant = bienTheList.find(
      (variant) =>
        variant.tenMauSac === selectedColor && variant.tenKichCo === size
    );

    if (selectedVariant) {
      setSoLuongChiTiet(selectedVariant.soLuong); // Lưu số lượng tương ứng với kích cỡ đã chọn
      console.log("Số lượng của kích cỡ đã chọn:", selectedVariant.soLuong);
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
          {anhCHiTiet.length > 0 ? (
            anhCHiTiet.map((url, index) => (
              <img
                key={index}
                src={url || "default_image.jpg"} // Nếu URL không có thì dùng ảnh mặc định
                alt={productGiay.ten}
                style={{ width: "600px", height: "600px", margin: "5px" }}
              />
            ))
          ) : productGiay.anhGiayEntities?.length > 0 ? (
            productGiay.anhGiayEntities.map((anh, index) => (
              <img
                key={anh.id || index}
                src={anh.tenUrl || "default_image.jpg"} // Nếu URL không có thì dùng ảnh mặc định
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
              {sizeList.map((size) => (
                <div
                  key={size}
                  className={`size-box ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedSize(size); // Cập nhật kích cỡ đã chọn
                    handleSizeSelect(size); // Gọi hàm xử lý khi chọn kích cỡ
                  }}
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
