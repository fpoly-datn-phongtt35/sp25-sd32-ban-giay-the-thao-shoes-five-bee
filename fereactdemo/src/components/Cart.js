import { useState, useEffect } from "react";
import { fetchCustomerId } from '../service/LoginService.js';
import { getByKhachHangId, addToCart, updateGioHangChiTiet, deleteGioHangChiTiet } from '../service/GioHangChiTietService.js';
import { message } from "antd";

const useCart = () => {
  const [khachHangId, setKhachHangId] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCustomerId = async () => {
      try {
        const id = await fetchCustomerId();
        if (id) {
          setKhachHangId(id);
        } else {
          alert("Không thể lấy ID khách hàng. Vui lòng thử lại.");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    getCustomerId();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!khachHangId) {
        return;
      }
      setLoading(true);
      try {
        console.log("Đang lấy giỏ hàng cho ID khách hàng:", khachHangId);
        const response = await getByKhachHangId(khachHangId);
        console.log("Phản hồi giỏ hàng:", response);

        let cartItems = [];
        if (response && response.data) {
          if (Array.isArray(response.data.gioHangChiTietResponses)) {
            cartItems = response.data.gioHangChiTietResponses;
          } else {
            cartItems = [response.data.gioHangChiTietResponses];
          }
        }
        localStorage.setItem("idGioHang", response.data.idGioHang); 

        const validItems = cartItems.filter(item =>
          item &&
          item.giayChiTietId &&
          item.tenGiay &&
          item.giaBan &&
          item.soLuong &&
          item.anhGiayUrl
        );
        console.log("Các mục giỏ hàng hợp lệ:", validItems);

        if (validItems.length === 0) {
          console.log("Không tìm thấy mục hợp lệ trong phản hồi giỏ hàng");
        }

        setCart(validItems);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [khachHangId]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increment = async (id, currentQuantity) => {
    try {
      const soLuong = currentQuantity + 1;
      console.log(soLuong);
      await updateGioHangChiTiet(id, true);
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, soLuong: soLuong } : item
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update product quantity:", error);
    }
  };

  const decrement = async (id, currentQuantity) => {
    try {
      const soLuong = currentQuantity - 1;

      if (soLuong < 1) {
        message.error("Số lượng không thể nhỏ hơn 1");
        return;
      }

      await updateGioHangChiTiet(id, false);
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, soLuong: soLuong } : item
      );
      const newCart = updatedCart.filter((item) => item.soLuong > 0);
      setCart(newCart);
    } catch (error) {
      console.error("Failed to update product quantity:", error);
    }
  };

  const removeProduct = async (id) => {
    try {
      await deleteGioHangChiTiet(id);
      const newCart = cart.filter((item) => item.id !== id);
      setCart(newCart);
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.count, 0);
  };
  return { cart, addToCart, increment, decrement, removeProduct, getTotalItems };
};

export default useCart;
