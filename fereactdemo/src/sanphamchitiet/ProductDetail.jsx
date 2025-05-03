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
import { subscribeToProduct } from "../service/QuanTamService";
import { Avatar, Button, Divider, message, Pagination, Rate } from "antd";
import { getProductDanhGiaById } from "../service/DanhGiaService";
import { LeftOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
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
    fetchProductReviews();
  }, [id]);

  useEffect(() => {
    const fetchReviewsWithUserInfo = async () => {
      try {
        const response = await getProductDanhGiaById(id);

        if (Array.isArray(response.data)) {
          // Lấy thông tin người dùng cho mỗi đánh giá
          const reviewsWithUserInfo = await Promise.all(
            response.data.map(async (review) => {
              try {
                const userResponse = await getByKhachHangId(review.userId);
                return {
                  ...review,
                  userInfo: userResponse.data,
                };
              } catch (error) {
                console.error("❌ Lỗi khi lấy thông tin người dùng:", error);
                return review;
              }
            })
          );

          setDanhGiaList(reviewsWithUserInfo);
          setTotalReviews(reviewsWithUserInfo.length);

          if (reviewsWithUserInfo.length > 0) {
            const totalRating = reviewsWithUserInfo.reduce(
              (sum, item) => sum + item.saoDanhGia,
              0
            );
            setAverageRating(
              (totalRating / reviewsWithUserInfo.length).toFixed(1)
            );
          }
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy đánh giá:", error);
      }
    };

    fetchReviewsWithUserInfo();
  }, [id]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchSimilarProducts = async () => {
    if (!id) return;

    try {
      if (productGiay && productGiay.id) {
        const response = await getListGoiYSanPham(id);
        // console.log("Sản phẩm tương tự:", response.data);

        // Lọc ra những sản phẩm có ít nhất 1 ảnh trong danhSachAnh
        const productsWithImages = (response.data || []).filter(
          (product) => product.danhSachAnh && product.danhSachAnh.length > 0
        );

        setSimilarProducts(productsWithImages);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm tương tự:", error);
      setSimilarProducts([]);
    }
  };
  const handleSelectSimilarProduct = async (id) => {
    try {
      const response = await detailGiayChiTiet2(id);
      console.log("Chi tiết sản phẩm tương tự:", response.data);

      setProductGiay(response.data); // Cập nhật lại sản phẩm chính
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm tương tự:", error);
    }
  };

  const scrollCarouselLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollCarouselRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Gọi API sản phẩm tương tự sau khi đã có dữ liệu sản phẩm chính
  useEffect(() => {
    if (productGiay && !loading) {
      fetchSimilarProducts();
    }
  }, [productGiay, loading]);

  // Lấy danh sách đánh giá
  const fetchProductReviews = async () => {
    try {
      const response = await getProductDanhGiaById(id);

      if (Array.isArray(response.data)) {
        setDanhGiaList(response.data);
        setTotalReviews(response.data.length);

        if (response.data.length > 0) {
          const totalRating = response.data.reduce(
            (sum, item) => sum + item.saoDanhGia,
            0
          );
          setAverageRating((totalRating / response.data.length).toFixed(1));
        }
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy đánh giá:", error);
    }
  };
  const handleSubscribe = async (giayChiTietId) => {
    try {
      const res = await subscribeToProduct(giayChiTietId);
      message.success("Bạn đã đăng ký theo dõi sản phẩm này thành công!");
    } catch (err) {
      console.error("❌ Lỗi đăng ký theo dõi:", err);
      message.error("Đăng ký theo dõi thất bại. Vui lòng thử lại.");
    }
  };

  const selectedVariant = bienTheList.find(
    (item) =>
      item.tenMauSac === selectedColor && item.tenKichCo === selectedSize
  );

  const fetchProductDetail = async () => {
    try {
      console.log(`🔍 Đang lấy dữ liệu sản phẩm với ID: ${id}`);
      const giayDto = { id };
      const giayResponse = await getGiayDetail(giayDto);
      const giayChiTietResponse = await getGiayChitietDetail1(id); // Lấy danh sách chi tiết giày

      // console.log("Kết quả từ getGiayDetail:", giayResponse.data);

      if (
        Array.isArray(giayChiTietResponse.data) &&
        giayChiTietResponse.data.length > 0
      ) {
        const bienTheSanPham = giayChiTietResponse.data.map((item) => ({
          idMauSac: item.mauSacEntity?.id, // ID màu sắc
          tenMauSac: item.mauSacEntity?.ten, // Tên màu sắc
          idGiayChiTiet: item.id,
          giaBan: item.giaBan,
          giaKhiGiam: item.giaKhiGiam,
          idKichCo: item.kichCoEntity?.id,
          tenKichCo: item.kichCoEntity?.ten,
          soLuong: item.soLuongTon,
          anh: item.danhSachAnh,
        }));

        setBienTheList(bienTheSanPham);
      } else {
        setBienTheList([]);
      }
      console.log(giayChiTietResponse.data);

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

    if (variantsWithSameColor.length > 0) {
      // Lấy danh sách size
      const sizeList = [
        ...new Set(variantsWithSameColor.map((v) => v.tenKichCo)),
      ];

      setSizeList(sizeList);

      // Ưu tiên tìm biến thể có giá khi giảm
      const variantWithDiscount =
        variantsWithSameColor.find((variant) => variant.giaKhiGiam != null) ??
        variantsWithSameColor[0]; // Nếu không có thì lấy phần tử đầu tiên

      const giaKhiGiam = variantWithDiscount?.giaKhiGiam;
      const giaBan = variantWithDiscount?.giaBan;
      const finalPrice = giaKhiGiam || giaBan || 0;

      setCurrentPrice(finalPrice);

      // Lấy danh sách ảnh
      const imageList = variantsWithSameColor.flatMap((variant) =>
        variant.anh ? variant.anh.map((img) => img.tenUrl) : []
      );
      setanhCHiTiet(imageList);

      // Lấy số lượng
      const quantityList = variantsWithSameColor.map(
        (variant) => variant.soLuong
      );
      setSoLuongChiTiet(quantityList);

      // Tính tổng số lượng
      const totalQuantity = quantityList.reduce((acc, qty) => acc + qty, 0);
      setTotalQuantity(totalQuantity);

      // Lưu thông tin biến thể đã chọn
      const selectedDetails = {
        tenMauSac: color,
        sizes: sizeList,
        images: imageList,
        quantities: quantityList,
        giaBan,
        giaKhiGiam,
        tongSoLuong: totalQuantity,
      };

      setSelectedVariantDetails(selectedDetails);

      console.log("Thông tin giày đã chọn:", selectedDetails);
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
      // console.log("Số lượng của kích cỡ đã chọn:", selectedVariant.soLuong);
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

    // ✅ Log thông tin biến thể được thêm vào giỏ hàng
    console.log("Thông tin giày gửi lên giỏ hàng:", {
      idGiayChiTiet: selectedVariant.idGiayChiTiet,
      tenMauSac: selectedVariant.tenMauSac,
      tenKichCo: selectedVariant.tenKichCo,
      soLuong: quantity,
      giaBan: selectedVariant.giaBan,
      giaKhiGiam: selectedVariant.giaKhiGiam ?? null,
    });

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
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) return <p>Đang tải dữ liệu...</p>; // Hiển thị khi đang tải

  return (
    <div className="product-detail">
      <div className="left">
        <div className="product-images">
          {anhCHiTiet.length > 0 ? (
            <img
              src={anhCHiTiet[0] || "default_image.jpg"}
              alt={productGiay.ten}
              style={{ width: "600px", height: "600px", margin: "5px" }}
            />
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
          {selectedVariantDetails?.giaBan > 0 || currentPrice > 0 ? (
            <div className="product-price">
              {selectedVariantDetails ? (
                selectedVariantDetails.giaKhiGiam &&
                selectedVariantDetails.giaKhiGiam !==
                  selectedVariantDetails.giaBan ? (
                  <>
                    <span className="original-price">
                      {Number(selectedVariantDetails.giaBan).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫
                    </span>
                    <span className="discounted-price">
                      {Number(selectedVariantDetails.giaKhiGiam).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫
                    </span>
                  </>
                ) : (
                  <span className="discounted-price">
                    {Number(selectedVariantDetails.giaBan).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    ₫
                  </span>
                )
              ) : (
                <span className="discounted-price">
                  {Number(currentPrice ?? 0).toLocaleString("vi-VN")} ₫
                </span>
              )}
            </div>
          ) : null}
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
              ? Number(currentPrice ?? 0).toLocaleString("vi-VN")
              : Number(productGiay?.giaBan ?? 0).toLocaleString("vi-VN")}
            ₫
          </div>
          {selectedColor && selectedSize && selectedVariant && (
            <Button
              type="primary"
              onClick={() => handleSubscribe(selectedVariant.idGiayChiTiet)}
              style={{
                marginTop: "10px",
                backgroundColor: "#1890ff",
                color: "white",
              }}
            >
              Theo dõi sản phẩm khi có thêm hàng
            </Button>
          )}
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
            <>
              {/* Hiển thị danh sách đánh giá đã phân trang */}
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

              {/* Thêm phân trang */}
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

        {/* Phần sản phẩm tương tự */}
        <div className="similar-products-section">
          <Divider orientation="left">
            <h2>Sản phẩm tương tự</h2>
          </Divider>

          {similarProducts.length > 0 ? (
            <div className="similar-products-carousel-container">
              <button
                className="carousel-control prev"
                onClick={scrollCarouselLeft}
              >
                <LeftOutlined />
              </button>

              <div className="similar-products-carousel" ref={carouselRef}>
                {similarProducts.map((product) => (
                  <div
                    key={product.id}
                    className="similar-product-card"
                    onClick={() =>
                      (window.location.href = `/product-detailSPTT/${product.id}`)
                    }
                  >
                    {/* <div className="similar-product-image">
                      <img
                        src={
                          product.anhUrl ||
                          (product.giayEntity?.anhGiayEntities &&
                          product.giayEntity.anhGiayEntities.length > 0
                            ? product.giayEntity.anhGiayEntities[0].tenUrl
                            : "/default-product.jpg")
                        }
                        alt={product.giayEntity?.ten || "Giày sản phẩm"}
                      />
                    </div> */}
                    <div className="similar-product-image">
                      <img
                        src={
                          product.danhSachAnh && product.danhSachAnh.length > 0
                            ? product.danhSachAnh[0].tenUrl
                            : "/default-product.jpg"
                        }
                        alt={product.giayEntity?.ten || "Giày sản phẩm"}
                      />
                    </div>

                    <div className="similar-product-info">
                      <h3 className="similar-product-name">
                        {product.giayEntity?.ten || "Tên sản phẩm"}
                      </h3>
                      <p className="similar-product-price">
                        {Number(product.giaBan).toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-control next"
                onClick={scrollCarouselRight}
              >
                <RightOutlined />
              </button>
            </div>
          ) : (
            <p>Không có sản phẩm tương tự.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
