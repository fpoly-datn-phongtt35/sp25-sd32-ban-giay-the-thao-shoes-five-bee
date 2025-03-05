import React, { useEffect, useState } from "react";
import "./HoaDonCart.css";
import { getByKhachHangId } from "../service/GioHangChiTietService"
import useCart from "./Cart";

const Cart = ({ customerId, onSetTongTienHang }) => {
  const { cart, increment, decrement, removeProduct } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartt, setCart] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (customerId) {
      const fetchCard = async () => {
        try {
          const response = await getByKhachHangId(customerId);
          console.log("data" + response.data);
          const data = Array.isArray(response.data) ? response.data : [response.data];
          setCart(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCard();
    }
  }, [customerId]);

  useEffect(() => {
    onSetTongTienHang(totalAmount)
  }, [cart]);

  const totalAmount = cart.reduce(
    (total, product) => total + (product.giaBan || 0) * (product.soLuong || 1),
    0
  );

  if (loading) return <p>Loading...</p>;
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
        {cart.map((product, index) => (
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
