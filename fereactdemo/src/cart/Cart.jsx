import "./cart.css";
import { Header } from "../header/Header";
import { Link } from "react-router-dom";
import useCart from "../components/Cart";

export const Cart = () => {
  const { cart, increment, decrement, removeProduct } = useCart();

  const totalAmount = cart.reduce(
    (total, product) => total + (product.giayChiTiet.giay.giaBan || 0) * (product.soLuong || 1),
    0
  );

  return (
    <div>
      <Header />
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
                <img src={product.giayChiTiet.giay.anhGiay.tenUrl} alt={product.giayChiTiet.giay.ten} />
                <div style={{ marginTop: "20px" }}>
                  <p>{product.giayChiTiet.giay.ten}</p>
                  <button onClick={() => removeProduct(product.id)}>Xóa</button>
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
                  <button onClick={() => decrement(product.id,product.soLuong)}>-</button>
                  <p>{product.soLuong}</p>
                  <button onClick={() => increment(product.id,product.soLuong)}>+</button>
                </div>
              </div>
              <div className="prouduct_cart_discount">
                <p>
                  {(
                    (product.giayChiTiet.giay.giaBan || 0) * (product.soLuong || 1)
                  ).toLocaleString()}
                  đ
                </p>
              </div>
            </div>
          ))}
          <div className="total">
            <div className="total_value">
              <div className="total_value_total">
                Tổng tiền : <p>{totalAmount.toLocaleString()}đ </p>
              </div>

              <button>
                <Link to={"/bill"}>Thanh toán</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
