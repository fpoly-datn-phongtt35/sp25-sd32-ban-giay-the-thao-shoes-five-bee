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
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortGiay();
  }, [priceRange, giay, sortOrder]);

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

  const handlePriceRangeChange = (event) => {
    const value = event.target.value;
    setPriceRange((prevRanges) =>
      prevRanges.includes(value)
        ? prevRanges.filter((range) => range !== value)
        : [...prevRanges, value]
    );
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const filterAndSortGiay = () => {
    let filtered = giay;

    if (priceRange.length > 0) {
      filtered = filtered.filter((item) => {
        const price = item.GIABAN;
        return priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return price >= min && price <= max;
        });
      });
    }

    filtered = filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.GIABAN - b.GIABAN;
      } else {
        return b.GIABAN - a.GIABAN;
      }
    });

    setFilteredGiay(filtered);
  };

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

  return (
    <div className="productAll_container">
      <Header />
      {/* <div className="banner_productAll">
        <img src="banner_3.jpg" alt="" />
      </div> */}
      <div className="aside_container">
        <div className="aside_left">
          {/* Danh mục sản phẩm */}
          <div className="product-portfolio">
            <div
              className="background"
              style={{
                color: "black",
                fontSize: "25px",
                fontWeight: "500",
                paddingLeft: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  marginTop: "10px",
                }}
              >
                Danh mục sản phẩm
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "27px",
                marginLeft: "20px",
                marginTop: "20px",
              }}
            >
              <div>
                <p>Giày Thể Thao</p>
              </div>
              <div>
                <p>Giày Công Sở</p>
              </div>
              <div>
                <p>Giày Tập Luyện</p>
              </div>
              <div>
                <p>Giày Chạy Bộ</p>
              </div>
              <div>
                <p>Giày FPT</p>
              </div>
              <div>
                <p>giày thể thao</p>
              </div>
            </div>
          </div>
          {/* Bộ lọc sản phẩm */}
          <div className="product-portfolio" style={{ marginTop: "30px" }}>
            <div
              className="background"
              style={{
                color: "black",
                fontSize: "25px",
                fontWeight: "500",
                paddingLeft: "20px",
              }}
            >
              <p>Bộ lọc sản phẩm</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "27px",
                marginLeft: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  marginTop: "10px",
                }}
              >
                Chọn mức giá
              </p>

              <div>
                <input
                  type="checkbox"
                  value="100000-200000"
                  onChange={handlePriceRangeChange}
                />
                Từ 100k - 200k
              </div>
              <div>
                <input
                  type="checkbox"
                  value="300000-500000"
                  onChange={handlePriceRangeChange}
                />
                Từ 300k - 500k
              </div>
              <div>
                <input
                  type="checkbox"
                  value="500000-1000000"
                  onChange={handlePriceRangeChange}
                />
                Từ 500k - 1 triệu
              </div>
              <div>
                <input
                  type="checkbox"
                  value="1000000-2000000"
                  onChange={handlePriceRangeChange}
                />
                Từ 1 triệu - 2 triệu
              </div>
              <div>
                <input
                  type="checkbox"
                  value="1500000-3000000"
                  onChange={handlePriceRangeChange}
                />
                Từ 1,5 triệu - 3 triệu
              </div>
              <div>
                <input
                  type="checkbox"
                  value="3000000-4000000"
                  onChange={handlePriceRangeChange}
                />
                Từ 3 triệu - 4 triệu
              </div>
            </div>
          </div>
        </div>

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
                  <p className="product_price">
                    {item.GIABAN.toLocaleString()} VND
                  </p>
                  <h3 className="product_name">{item.TEN}</h3>

                  <button
                    className="add_to_cart_button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({ ...item, giayId: item.ID });
                    }}
                  >
                    Thêm
                  </button>
                </div>
              ))}
            </div>
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};
