import { useState, useEffect } from "react";
import { fetchCustomerId } from '../service/LoginService.js';
import { getByKhachHangId, addByKhachHangId, updateGioHangChiTiet, deleteGioHangChiTiet } from '../service/GioHangChiTietService.js';

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
    if (khachHangId) {
      const fetchCart = async () => {
        try {
          const response = await getByKhachHangId(khachHangId);
          const data = Array.isArray(response.data) ? response.data : [response.data];
          setCart(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCart();
    }
  }, [khachHangId]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (item) => {
    try {
      if (khachHangId) {
        const response = await addByKhachHangId(khachHangId, item);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        console.log(data);
        setCart([...cart, { ...item, count: 1 }]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const increment = async (id, currentQuantity) => {
    try {
      const soLuong = currentQuantity + 1;
      console.log(soLuong);
      // Gọi API để cập nhật số lượng sản phẩm theo ID
      await updateGioHangChiTiet(id, soLuong);
      // Sau khi cập nhật thành công, cập nhật lại giỏ hàng
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
        console.error("Quantity cannot be less than 1");
        return;
      }

      // Gọi API để cập nhật số lượng sản phẩm theo ID
      await updateGioHangChiTiet(id, soLuong);

      // Sau khi cập nhật thành công, cập nhật lại giỏ hàng
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, soLuong: soLuong } : item
      );

      // Nếu số lượng mới là 0, loại bỏ sản phẩm khỏi giỏ hàng
      const newCart = updatedCart.filter((item) => item.soLuong > 0);
      setCart(newCart);
    } catch (error) {
      console.error("Failed to update product quantity:", error);
    }
  };

  const removeProduct = async (id) => {
    try {
      // Gọi API để xóa sản phẩm theo ID
      await deleteGioHangChiTiet(id);

      // Sau khi xóa thành công, cập nhật lại giỏ hàng
      const newCart = cart.filter((item) => item.id !== id);
      setCart(newCart);
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };
  // if (loading) return <p>Đang tải...</p>;
  // if (error) return <p>Lỗi: {error}</p>;
  return { cart, addToCart, increment, decrement, removeProduct };
};

export default useCart;
