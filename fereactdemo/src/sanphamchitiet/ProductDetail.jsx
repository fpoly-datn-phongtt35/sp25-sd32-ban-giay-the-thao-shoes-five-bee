import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getGiayChitietDetail,
  getAllGiayChiTiet,
} from "../service/GiayChiTietService";
import { getGiayDetail } from "../service/GiayService";

const ProductDetail = () => {
  const { id } = useParams(); // 🔥 Lấy ID sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [productGiay, setProductGiay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      console.log(`🔍 Đang lấy dữ liệu sản phẩm với ID: ${id}`);
      const giayDto = { id };
      const giayResponse = await getGiayDetail(giayDto); // Lấy chi tiết giày
      const giayChiTietResponse = await getAllGiayChiTiet(id); // Lấy danh sách chi tiết giày
  
      console.log("Kết quả từ getGiayDetail:", giayResponse.data);
      console.log("Kết quả từ getAllGiayChiTiet:", giayChiTietResponse.data);
  
      // Kiểm tra nếu giayChiTietResponse.data là mảng
      if (Array.isArray(giayChiTietResponse.data) && giayChiTietResponse.data.length > 0) {
        setProduct(giayChiTietResponse.data[0]); // Lấy sản phẩm đầu tiên
      } else {
        setProduct(null);
      }
  
      setProductGiay(giayResponse.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) return <p>Đang tải dữ liệu...</p>; // Hiển thị khi đang tải
  if (!product || !productGiay) return <p>Không tìm thấy sản phẩm.</p>; // Kiểm tra dữ liệu

  return (
    <div className="product-detail">
      <h2>{productGiay.ten}</h2>

      {/* Hiển thị danh sách ảnh của sản phẩm */}
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

      <p>
        <strong>Giá:</strong>{" "}
        {product?.giaBan ? `${product.giaBan.toLocaleString()} VND` : "Không có thông tin giá"}
      </p>

      <p>
        <strong>Số lượng tồn:</strong>{" "}
        {product?.soLuongTon ?? "Không có dữ liệu"}
      </p>
    </div>
  );
};

export default ProductDetail;
