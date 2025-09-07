

import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (veg) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === veg.id);
      if (existing) {
        return prev.map((item) =>
          item.id === veg.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...veg, quantity: 1 }];
      }
    });
  };

  const incrementQty = (id) =>
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );

  const decrementQty = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, incrementQty, decrementQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
