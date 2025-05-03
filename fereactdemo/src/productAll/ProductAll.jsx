import React, { useState, useEffect, useContext } from "react";
import { Header } from "../header/Header";
import { getGiay } from "../service/GiayService";
import "./productall.css";
// import { CartContext } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";
import { getAllGiayChiTiet } from "../service/GiayChiTietService";
import useCart from "../components/Cart";

export const ProductAll = () => {
  const [giay, setGiay] = useState([]);
  const [giayChiTiet, setGiayChiTiet] = useState([]);
  const [filteredGiay, setFilteredGiay] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  // const { addToCart } = useContext(CartContext);
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedPriceGroup, setSelectedPriceGroup] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ["/imgbanner.png", "/slide1.png", "/slide2.png"];

  const [sortOption, setSortOption] = useState("");

  const sortOptionLabel = (value) => {
    switch (value) {
      case "az":
        return "Tên A-Z";
      case "za":
        return "Tên Z-A";
      case "priceAsc":
        return "Giá tăng dần";
      case "priceDesc":
        return "Giá giảm dần";
      default:
        return "Mặc định";
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(nextSlide, 2000); // Chuyển ảnh tự động mỗi 3 giây
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const resultGiay = await getGiay();
    const resultGiayChiTiet = await getAllGiayChiTiet();
    // console.log("giay san pham", resultGiay);

    const dataGiay = resultGiay.data.map((item) => ({
      ID: item.id,
      MA: item.ma,
      TEN: item.ten,
      MOTA: item.moTa,
      GIANHAP: item.giaNhap,
      GIABAN: item.giaBan,
      GIASAUKHUYENMAI: item.giaSauKhuyenMai,
      ANH_GIAY:
        item.anhGiayEntities?.length > 0
          ? item.anhGiayEntities[0].tenUrl
          : null,

      // Gán giá trị mặc định cho soLuongTon
      soLuongTon: 0,
    }));

    const dataGiayChiTiet = resultGiayChiTiet.data;

    // Kết hợp dữ liệu giữa giay và giayChiTiet
    const combinedData = dataGiay.map((giayItem) => {
      const matchingGiayChiTiet = dataGiayChiTiet.find(
        (chiTietItem) => chiTietItem.giay && chiTietItem.giay.id === giayItem.ID
      );
      return {
        ...giayItem,
        soLuongTon: matchingGiayChiTiet ? matchingGiayChiTiet.soLuongTon : 0,
      };
    });

    setGiay(combinedData);
    setFilteredGiay(combinedData); // Khởi tạo filteredGiay với dữ liệu đã kết hợp
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGiay.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredGiay.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`page-number ${number === currentPage ? "active" : ""}`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };
  useEffect(() => {
    if (!sortOption) return;

    const sortedItems = [...filteredGiay];

    if (sortOption === "az") {
      sortedItems.sort((a, b) => a.TEN.localeCompare(b.TEN));
    } else if (sortOption === "za") {
      sortedItems.sort((a, b) => b.TEN.localeCompare(a.TEN));
    } else if (sortOption === "priceAsc") {
      sortedItems.sort((a, b) => (a.GIABAN || 0) - (b.GIABAN || 0));
    } else if (sortOption === "priceDesc") {
      sortedItems.sort((a, b) => (b.GIABAN || 0) - (a.GIABAN || 0));
    }

    setFilteredGiay(sortedItems); // <--- Sửa filteredGiay
  }, [sortOption]);

  return (
    <div className="productAll_container">
      {/* <div className="banner_productAll">
        <img src="banner_3.jpg" alt="" />
      </div> */}
      <div className="banner">
        <img
          src="/banner.jpg"
          alt="Banner"
          className="banner-img"
          style={{ marginTop: 20 }}
        />
        <div className="slider">
          <div className="imgBanner">
            {images.map((img, index) => {
              // Tính toán chỉ số các ảnh bên trái và bên phải
              const leftIndex =
                (currentIndex - 1 + images.length) % images.length;
              const rightIndex = (currentIndex + 1) % images.length;
              return (
                <img
                  key={index}
                  src={img}
                  alt="Banner"
                  className={`slide-item ${
                    index === currentIndex ? "active" : ""
                  } 
                            ${index === leftIndex ? "left" : ""} 
                            ${index === rightIndex ? "right" : ""}`}
                  style={{
                    transform:
                      index === currentIndex ? "scale(1.2)" : "scale(0.9)",
                    opacity: index === currentIndex ? 1 : 0.6,
                    zIndex: index === currentIndex ? 2 : 1,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="background">
          <p>Sắp xếp: </p>
        </div>

        <div className="options">
          {[
            { value: "az", label: "Tên A-Z" },
            { value: "za", label: "Tên Z-A" },
            { value: "priceAsc", label: "Giá tăng dần" },
            { value: "priceDesc", label: "Giá giảm dần" },
          ].map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="sort"
                value={option.value}
                style={{ marginRight: "5px" }}
                checked={sortOption === option.value}
                onChange={(e) => setSortOption(e.target.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <a
        href="https://chat.zalo.me/?phone=0335572988" // Thay "123456789" bằng số điện thoại Zalo bạn muốn liên hệ
        target="_blank"
        rel="noopener noreferrer"
        className="zalo-icon"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
          alt="Zalo Chat"
        />
      </a>

      <div className="aside_container">
        <div className="aside_right">
          <div className="all_products">
            <div className="products_container">
              {currentItems.map((item, index) => (
                <div
                  className="product"
                  key={index}
                  onClick={() => navigate(`/product-detail/${item.ID}`)} //}
                >
                  <img
                    src={item.ANH_GIAY || "default_image.jpg"}
                    alt="product"
                    className="product_image"
                  />

                  <h3 className="product_name">{item.TEN}</h3>
                  <div className="product_info">
                    <div className="product_left">
                      <p className="product_price">
                        {item.GIABAN?.toLocaleString() || "0"} <sup>đ</sup>
                      </p>
                      <div className="product_rating">⭐⭐⭐⭐✰</div>
                    </div>

                    <button
                      className="add_to_cart_button"
                      onClick={() => navigate(`/product-detail/${item.ID}`)}
                    >
                      Chi Tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* {renderPagination()} */}
          </div>
        </div>
      </div>

      <section className="section">
        <p style={{ textAlign: "center" }}>
          <span style={{ fontSize: "26px" }}>
            <strong>BountySneakers</strong>
          </span>
        </p>

        <p>
          <strong>
            Giày Sneaker là gì? Tại sao giày sneaker bao gồm giày Addidas, Nike
          </strong>
        </p>
        <p>
          Sneaker còn được gọi là giày thể thao, dùng để chỉ các loại giày phục
          vụ cho vận động thể thao.
        </p>

        <p>
          Cùng với sự phát triển mạnh mẽ của xu hướng sporty ngày nay, sneakers
          là một phụ kiện không thể thiếu trong bộ sưu tập của tín đồ thời
          trang. Cùng với vẻ ngoài khỏe khoắn, thời thượng, sneakers đảm bảo sự
          dễ chịu, thoải mái nhất cho người sử dụng.
        </p>

        <p>
          <strong>Tại sao chọn mua Sneaker tại Bounty Sneakers?</strong>
        </p>
        <ul>
          <li>
            Tất cả các sản phẩm tại Bounty Sneakers 100% là hàng chính hãng nhập
            từ cửa hàng Adidas, Nike các nước Anh, Mỹ, Nhật với chất lượng được
            kiểm duyệt.
          </li>
          <li>
            Mẫu mã mới và đa dạng, luôn luôn mang đến các sản phẩm mới nhất và
            hot nhất đến người tiêu dùng: Adidas NMD, Ultra Boost, AlphaBounce,
            Nike Air Max, Nike Air Force 1…
          </li>
          <li>
            Nhiều lựa chọn thú vị với các mức giá ưu đãi. Ship ngay trong nội
            thành Hà Nội, giao hàng các tỉnh khác 2-5 ngày.
          </li>
          <li>
            Chính sách bảo hành sản phẩm chính hãng 3 tháng, cam kết 100% chính
            hãng.
          </li>
        </ul>

        <p>
          <strong>Những sản phẩm Giày sneaker mà bạn nên biết tới</strong>
        </p>

        <table cellpadding="10" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>
                <strong>Giày Adidas Chính Hãng</strong>
                <br />
                Vào những năm gần đây, đặc biệt là 2017 và 2018, Adidas Việt Nam
                được biết đến rất nhiều với những đôi giày thể thao training hợp
                thời trang: Adidas Alphabounce, NMD, UltraBoost, EQT. Không chỉ
                dừng lại ở riêng dòng Stansmith và Super Star, các dòng Adidas
                Boost đang được người tiêu dùng săn đón vì phục vụ được cả nhu
                cầu tập luyện và đi chơi.
              </td>
              <td style={{ width: "50%" }}>
                <strong>Giày Nike Chính Hãng</strong>

                <p>
                  Ông lớn Nike Việt Nam từ lâu đã rất nổi tiếng với những sản
                  phẩm giày được các vận động viên thể thao: tennis, đá bóng,
                  gym tin dùng. Vào những năm gần đây, Nike cho ra mắt rất nhiều
                  những sản phẩm sneaker hấp dẫn với những công nghệ tạo nên tên
                  tuổi của mình: Air Max, Air Zoom, Pegasus…
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section-service">
        <div className="container">
          <div className="row">
            <div className="service-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <div className="service-wrap">
                <div className="service-icon">
                  <img
                    src="//bizweb.dktcdn.net/100/347/092/themes/708609/assets/srv_1.png?1741742011852"
                    alt="Vận chuyển siêu tốc"
                  />
                </div>
                <div className="service-content">
                  <p className="service-title">VẬN CHUYỂN SIÊU TỐC</p>
                  <span className="service-desc">
                    Vận chuyển nội thành HN trong 2 tiếng!
                  </span>
                </div>
              </div>
            </div>

            <div className="service-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <div className="service-wrap">
                <div className="service-icon">
                  <img
                    src="//bizweb.dktcdn.net/100/347/092/themes/708609/assets/srv_2.png?1741742011852"
                    alt="Đổi hàng"
                  />
                </div>
                <div className="service-content">
                  <p className="service-title">Đổi hàng</p>
                  <span className="service-desc">
                    Đổi hàng trong 7 ngày miễn phí!
                  </span>
                </div>
              </div>
            </div>

            <div className="service-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <div className="service-wrap">
                <div className="service-icon">
                  <img
                    src="//bizweb.dktcdn.net/100/347/092/themes/708609/assets/srv_3.png?1741742011852"
                    alt="Tiết kiệm thời gian"
                  />
                </div>
                <div className="service-content">
                  <p className="service-title">Tiết kiệm thời gian</p>
                  <span className="service-desc">
                    Mua sắm dễ hơn khi online
                  </span>
                </div>
              </div>
            </div>

            <div className="service-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <div className="service-wrap">
                <div className="service-icon">
                  <img
                    src="//bizweb.dktcdn.net/100/347/092/themes/708609/assets/srv_4.png?1741742011852"
                    alt="Địa chỉ cửa hàng"
                  />
                </div>
                <div className="service-content">
                  <p className="service-title">ĐỊA CHỈ CỬA HÀNG</p>
                  <span className="service-desc">
                    Số 2 Nguyễn Hoàng, Nam Từ Liêm, Hà Nội
                    <br />
                    Sđt: 0977179889
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
