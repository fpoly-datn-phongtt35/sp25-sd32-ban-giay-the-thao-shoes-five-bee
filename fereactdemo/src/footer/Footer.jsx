import React from "react";
import "./footer.css";

export const Footer = () => {
  const list = [
    {
      imgSrc: "giaohang.webp",
      description: "GIAO HÀNG MIỄN PHÍ",
      price: "Nội thành Hồ Chí Minh",
    },
    {
      imgSrc: "baohanh.webp",
      description: "BẢO HÀNH",
      price: "Bảo hành lên đến 6 tháng",
    },
    {
      imgSrc: "goi.webp",
      description: "Gọi 19006565",
      price: "Để hỗ trợ ngay",
    },
    {
      imgSrc: "doitra.webp",
      description: "ĐỔI TRẢ",
      price: "Đổi trả dễ dàng",
    },
  ];

  return (
    <div className="container_footer">
      {/* footer content */}
      <div className="footer_content background">
        <p
          style={{
            marginTop: "8px",
            marginLeft: "50px",
            fontSize: "25px",
            fontWeight: "700",
          }}
        >
          Chính Sách:{" "}
        </p>
        {list.map((item, index) => (
          <div className="footer_content_choice" key={index}>
            <img src={item.imgSrc} alt={item.description} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>{item.description}</p>
              <p>{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      {/*  noi dung footer */}
      <div className="footer_nd">
        <div className="footer_nd_left">
          <img src="/home/fivestar.png" alt="" />
          <p style={{ color: "white" }}>
            Dola Tool là một cửa hàng chuyên cung cấp dụng cụ cơ khí chất lượng
            cao và độ bền vượt trội. Với cam kết mang đến sự hài lòng tuyệt đối
            cho khách hàng, chúng tôi tự hào là địa chỉ tin cậy mà bạn có thể
            dựa vào khi cần sử dụng các sản phẩm cơ khí.
          </p>
        </div>
        <div className="footer_nd_center">
          <div className="footer_nd_center_nd">
            <h5 style={{ color: "#FFB700" }}>CHÍNH SÁCH</h5>
            <p>Chính sách thành viên</p>
            <p>Chính sách thanh toán</p>
            <p>Chính sách bảo hành và bảo trì</p>
            <p>Chính sách vận chuyển vào giao nhận </p>
            <p>Bảo mật thông tin cá nhân</p>
          </div>
          <div className="footer_nd_center_nd">
            <h5 style={{ color: "#FFB700" }}>HƯỚNG DẪN</h5>
            <p>Hướng dẫn mua hàng</p>
            <p>Hướng dẫn thanh toán</p>
            <p>Hướng dẫn giao nhận</p>
            <p>Điều khoản dịch vụ </p>
            <p>Câu hỏi thường gặp</p>
          </div>
          <div className="footer_nd_center_nd">
            <h5 style={{ color: "#FFB700" }}>DANH MỤC NỔI BẬT</h5>
            <p>Chính sách thành viên</p>
            <p>Chính sách thanh toán</p>
            <p>Chính sách bảo hành và bảo trì</p>
            <p>Chính sách vận chuyển vào giao nhận </p>
            <p>Bảo mật thông tin cá nhân</p>
          </div>
          <div className="footer_nd_center_nd">
            <h5 style={{ color: "#FFB700" }}>LIÊN HỆ</h5>
            <p>MUA ONLINE (08:30 - 20:30)Chính sách thành viên</p>
            <p style={{ color: "#FFB700", fontSize:"24px",fontWeight:"500" }}>19006565</p>
            <p>GÓP Ý & KHIẾU NẠI (08:30 - 20:30)</p>
         
          </div>
        </div>
      </div>
    </div>
  );
};
