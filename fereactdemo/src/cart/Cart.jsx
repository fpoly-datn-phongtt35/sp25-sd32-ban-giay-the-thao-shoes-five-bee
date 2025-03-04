import "./cart.css";
import { Header } from "../header/Header";
import { Link } from "react-router-dom";
import useCart from "../components/Cart";
import { useEffect, useState } from "react";
import { message } from "antd";

export const Cart = () => {
  const { cart,loading, error,  increment, decrement, removeProduct } = useCart();
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  useEffect(() => {
    console.log("product duoc chọn :", selectedProducts);
  }, [selectedProducts]);

  const handleCheckboxChangeProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  if (loading) return <p>Đang tải giỏ hàng...</p>;

  if (error) return <p>Lỗi: {error}</p>;

  if (!cart || cart.length === 0) {
    return (
      <div className="container_cart">
        <p>Giỏ hàng của bạn đang trống.</p>
        <Link to="/productAll">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  const totalAmount = cart.reduce((sum, item) => {
    if (selectedProducts.includes(item.id)) {
      const giaBan = item?.giaBan || 0;
      const soLuong = item?.soLuong || 0;
      return sum + giaBan * soLuong;
    }
    return sum;
  }, 0);

  // kiem tra phải chọn 1 sản phẩm để vào /check-out
  const handleCheckoutClick = (e) => {
    console.log(selectedProducts)
    if (selectedProducts.length === 0) {
      e.preventDefault();
      message.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
    }
  };

  return (
    <div>
      <div className="container_cart">
        <div className="cart">
          <div className="cart_content">
            <p>Thông tin sản phẩm</p>
            <p>Màu Sắc</p>
            <p>Size</p>
            <p>Đơn giá</p>
            <p>Số lượng</p>
            <p>Thành tiền</p>
          </div>
          {cart.map((product, index) => {
            if (!product || !product.giayChiTietId || !product.tenGiay) {
              console.error("Dữ liệu sản phẩm không hợp lệ:", product);
              return null;
            }
            return (
              <div className="prouduct_cart" key={index}>
                <div className="checkbox_container">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChangeProduct(product.id)}
                  />
                </div>
                <div className="prouduct_cart_name">
                  <img
                    src={product.anhGiayUrl || "/placeholder.jpg"}
                    alt={product.tenGiay || "Hình ảnh sản phẩm"}
                  />
                  <div style={{ marginTop: "20px" }}>
                    <p>{product.tenGiay || "Sản phẩm không xác định"}</p>
                    <button onClick={() => removeProduct(product.id)}>Xóa</button>
                  </div>
                </div>
                <div className="prouduct_cart_classify">
                  <p>{product.mauSac || "N/A"}</p>
                </div>
                <div className="prouduct_cart_classify">
                  <p>{product.kichCo || "N/A"}</p>
                </div>
                <div className="prouduct_cart_price">
                  <p>{(product.giaBan || 0).toLocaleString()}đ</p>
                </div>
                <div className="prouduct_cart_count">
                  <div className="prouduct_cart_count_count">
                    <button onClick={() => decrement(product.id, product.soLuong)}>-</button>
                    <p>{product.soLuong || 1}</p>
                    <button onClick={() => increment(product.id, product.soLuong)}>+</button>
                  </div>
                </div>
                <div className="prouduct_cart_discount">
                  <p>{(product.giaBan * product.soLuong).toLocaleString()}đ</p>
                </div>
              </div>
            );
          })}
          <div className="total">
            <div className="total_value">
              <div className="total_value_total">
                Tổng tiền : <p>{totalAmount.toLocaleString()}đ </p>
              </div>
              <button onClick={handleCheckoutClick}>
                <Link to={"/check-out"}>Thanh toán</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
