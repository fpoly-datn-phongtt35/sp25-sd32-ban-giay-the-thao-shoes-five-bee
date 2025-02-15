import React, { useEffect, useState } from "react";
import "./HoaDonCart.css";
import { getByKhachHangId } from "../service/GioHangChiTietService"

const Cart = ({ customerId, onSetTongTienHang }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("customerId:", customerId);
    if (customerId) {
      const fetchCard = async () => {
        try {
          const response = await getByKhachHangId(customerId);
          console.log(response.data);
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
    (total, product) => total + (product.giayChiTiet.giaBan || 0) * (product.soLuong || 1),
    0
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container_cart">
      <div className="cart">
        <div className="cart_content">
          <p>Thông tin sản phẩm</p>
          <p>Phân loại hàng</p>
          <p>Đơn giá</p>
          <p>Số lượng</p>
          <p>Thành tiền</p>
        </div>
        {cart.map((product, index) => (
          <div className="prouduct_cart" key={index}>
            <div className="prouduct_cart_name">
              <img src={product.giayChiTiet.giay.anhGiay.tenUrl} alt={product.name} />
              <div style={{ marginTop: "20px" }}>
                <p>{product.giayChiTiet.giay.ten}</p>
                {/* <button onClick={() => removeProduct(index)}>Xóa</button> */}
              </div>
            </div>
            <div className="prouduct_cart_classify">
              <p>{product.giayChiTiet.mauSac.ten}</p>
              <p>{product.giayChiTiet.kichCo.ten}</p>
            </div>
            <div className="prouduct_cart_price">
              <p>{(product.giayChiTiet.giaBan || 0).toLocaleString()}đ</p>
            </div>
            <div className="prouduct_cart_count">
              <div className="prouduct_cart_count_count">
                {/* <button onClick={() => decrement(index)}>-</button> */}
                <p>{product.soLuong}</p>
                {/* <button onClick={() => increment(index)}>+</button> */}
              </div>
            </div>
            <div className="prouduct_cart_discount">
              <p>
                {(
                  (product.giayChiTiet.giaBan || 0) * (product.soLuong || 1)
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
