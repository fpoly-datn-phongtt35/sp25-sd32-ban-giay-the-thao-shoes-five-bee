import { React, useState, useEffect } from "react";

import "./home.css";
import { Product } from "../product/Product";
import { Footer } from "../footer/Footer";

import { Header } from "../header/Header";
const images = ["/imgbanner.png", "/slide1.png", "/slide2.png"];
// ngovan dang code o day 
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const list_product = [
    {
      imgSrc: "../anhgiay/anh1.jpg",
      description: "Demo sản phẩm thuộc tính 1",
      price: "50.000",
      buttonText: "Thêm vào giỏ hàng",
      saleText: "Sale",
    },
    {
      imgSrc: "../anhgiay/anh2.jpg",
      altText: "Sản phẩm 2",
      description: "Demo sản phẩm thuộc tính 2",
      price: "500.000",
      buttonText: "Thêm vào giỏ hàng",
      saleText: "Sale",
    },
    {
      imgSrc: "../anhgiay/anh3.jpg",
      altText: "Sản phẩm 2",
      description: "Demo sản phẩm thuộc tính 2",
      price: "500.000",
      buttonText: "Thêm vào giỏ hàng",
      saleText: "Sale",
    },
    {
      imgSrc: "../anhgiay/anh4.jpg",
      altText: "Sản phẩm 2",
      description: "Demo sản phẩm thuộc tính 2",
      price: "500.000",
      buttonText: "Thêm vào giỏ hàng",
      saleText: "Sale",
    },
    {
      imgSrc: "../anhgiay/anh5.jpg",
      altText: "Sản phẩm 2",
      description: "Demo sản phẩm thuộc tính 2",
      price: "500.000",
      buttonText: "Thêm vào giỏ hàng",
      saleText: "Sale",
    },
  ];
  const feedbacks = [
    {
      imgSrc: "avatar1.jpg",
      name: "Nguyen A",
      title: "Nhân viên văn phòng",
      content:
        "Không chỉ tập trung vào việc cung cấp sản phẩm chất lượng, Dola Tool còn cam kết đảm bảo dịch vụ sau bán hàng tốt nhất. Đội ngũ nhân viên nhiệt tình và chuyên nghiệp luôn sẵn lòng giải đáp mọi thắc mắc và mong muốn của khách hàng. Tôi sẽ luôn ủng hộ.",
    },
    {
      imgSrc: "avatar1.jpg",
      name: "Tran B",
      title: "Nhân viên kinh doanh",
      content:
        "Sản phẩm rất tốt và dịch vụ hỗ trợ sau bán hàng cũng rất tuyệt vời. Tôi rất hài lòng và sẽ tiếp tục ủng hộ Dola Tool.",
    },
    {
      imgSrc: "avatar1.jpg",
      name: "Le C",
      title: "Kỹ sư phần mềm",
      content:
        "Chất lượng sản phẩm vượt trội, dịch vụ khách hàng nhanh chóng và hiệu quả. Tôi đã giới thiệu Dola Tool cho nhiều bạn bè và đồng nghiệp.",
    },
  ];
  const FeedbackCard = ({ imgSrc, name, title, content }) => (
    <div>
      <div className="feedback_content">
        <div className="feedback_avatar">
          <img src={imgSrc} alt="" />
          <div className="feedback_avatar_nd">
            <p style={{ color: "black", fontSize: "20px", marginLeft: "40px" }}>
              {name}
            </p>
            <p style={{ marginLeft: "100px" }}>{title}</p>
          </div>
        </div>
        <p>{content}</p>
      </div>
    </div>
  );
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 2000); // Chuyển ảnh tự động mỗi 3 giây
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  return (
    <div className="home_container">
      {/* header */}

      <div className="banner">
        <img src="/banner.jpg" alt="Banner" className="banner-img" />
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
      <div className="product_sale">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Độc quyền của chúng tôi</p>
          <p>GIÀY ADIDAS</p>
          <p>Giày là một sản phẩm không thể thiếu trong tủ của mỗi người</p>
          <p>Với sự đa dạng về kiểu dáng, chất liệu và công dụng</p>
        </div>

        <div className="imgContent">
          <img src="/blue_shoe-min.png" alt="" />
        </div>
        <div className="imgText">
          <img src="/blue_text-min.png" alt="" />
        </div>
      </div>


      
      {/* Sản Phẩm */}
      <h3
        style={{
          color: "black",
          textAlign: "center",
          fontWeight: "6008",
          marginTop: "35px",
        }}
      >
        DEAL CỰC HẤP DẪN
      </h3>

      <div className="product_deal">
        <div class="count-down">
          <span class="title-timer" style={{ textAlign: "center" }}>
            Thời gian chỉ còn
          </span>
          <div
            class="timer-view"
            data-countdown="countdown"
            data-date="2024-06-20-00-00-00"
          >
            <div class="lof-labelexpired">
              {" "}
              Chương trình đã kết thúc, hẹn gặp lại trong thời gian sớm nhất!
            </div>
          </div>
        </div>
        <div className="product_list">
          {list_product.map((product, index) => (
            <Product
              key={index}
              imgSrc={product.imgSrc}
              altText={product.altText}
              description={product.description}
              price={product.price}
              buttonText={product.buttonText}
              saleText={product.saleText}
            />
          ))}
        </div>
      </div>

      {/* san pham noi bat */}
      <div className="product_container">
        <h3>Sản Phẩm Nổi Bật</h3>
        <div className="product_list">
          {list_product.map((product, index) => (
            <Product
              key={index}
              imgSrc={product.imgSrc}
              altText={product.altText}
              description={product.description}
              price={product.price}
              buttonText={product.buttonText}
              saleText={product.saleText}
            />
          ))}
        </div>
      </div>
      {/* san pham ban chay */}
      <div className="product_container">
        <h3>Sản Phẩm Bán Chạy</h3>
        <div className="product_list">
          {list_product.map((product, index) => (
            <Product
              key={index}
              imgSrc={product.imgSrc}
              altText={product.altText}
              description={product.description}
              price={product.price}
              buttonText={product.buttonText}
              saleText={product.saleText}
            />
          ))}
        </div>
      </div>
      {/* feedback tu khach hang */}
      {/* <div className="feedback">
        {feedbacks.map((feedback, index) => (
          <FeedbackCard
            key={index}
            imgSrc={feedback.imgSrc}
            name={feedback.name}
            title={feedback.title}
            content={feedback.content}
          />
        ))}
      </div> */}
      {/* footer */}
     
     
    </div>
  );
}
