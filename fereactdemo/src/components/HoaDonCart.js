import React, { useEffect, useState } from "react";
import "./HoaDonCart.css";
import { getGioHangChiTietCheckOut } from "../service/GioHangChiTietService"
import useCart from "./Cart";
import { useLocation } from "react-router-dom";
const Cart = ({ customerId, onSetTongTienHang }) => {
  const { cart, increment, decrement, removeProduct } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartt, setCart] = useState([]);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const selectedProducts = location.state?.selectedProducts || [];

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedProducts.length > 0) {
        const data = await getGioHangChiTietCheckOut(selectedProducts);
        setProducts(data);
        setCart(data);
        var arr = [];
        for (var i = 0; i < data.length; i++) {
          arr.push(data[i].id)
        }
        localStorage.setItem("idGioHangChiTiet",arr);
      }
    };
    fetchProducts();
  }, [selectedProducts]);

  useEffect(() => {
    onSetTongTienHang(totalAmount)
  }, [cartt]);

  const totalAmount = cartt.reduce(
    (total, product) => total + (product.giaBan || 0) * (product.soLuong || 1),
    0
  );
  if (products.length === 0) return <p>Không có sản phẩm nào để thanh toán!</p>;

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container_cart">
      <div className="cart">
        <div className="cart_content">
          <p>Thông tin sản phẩm</p>
          <p>Đơn giá</p>
          <p>Số lượng</p>
          <p>Thành tiền</p>
        </div>
        {cartt.map((product, index) => (
          <div className="prouduct_cart" key={index}>
            <div className="prouduct_cart_name">
              <img
                src={product.anhGiayUrl || '/placeholder.jpg'}
                alt={product.tenGiay || 'Hình ảnh sản phẩm'}
              />
              <div style={{ marginTop: "20px" }}>
                <p>{product.tenGiay || 'Sản phẩm không xác định'}</p>
              </div>
            </div>

            <div className="prouduct_cart_price">
              <p>{(product.giaBan || 0).toLocaleString()}đ</p>
            </div>
            <div className="prouduct_cart_count">
              <div className="prouduct_cart_count_count">
                <p>{product.soLuong}</p>
              </div>
            </div>
            <div className="prouduct_cart_discount">
              <p>
                {(
                  (product.giaBan || 0) * (product.soLuong || 1)
                ).toLocaleString()}
                đ
              </p>
            </div>
          </div>
        ))}
        <div className="total">
          <div className="total_value">
            <div className="total_value_total">
              Tổng số tiền : <p>{totalAmount.toLocaleString()}đ </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
