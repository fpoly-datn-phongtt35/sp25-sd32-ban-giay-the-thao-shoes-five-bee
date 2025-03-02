import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when the component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, count: 1 }]);
  };

  const increment = (id) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, count: item.count + 1 } : item
    );
    setCart(newCart);
  };


  const decrement = (id) => {
    const newCart = cart.map((item) =>
      item.id === id && item.count > 1 ? { ...item, count: item.count - 1 } : item
    );
    setCart(newCart);
  };

  const removeProduct = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increment, decrement, removeProduct }}
    >
      {children}
    </CartContext.Provider>
  );
};
