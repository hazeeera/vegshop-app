
import React, { useContext } from "react";
import "./cart.css";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import  { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import  {API_URL } from "../config"


const Cart = () => {
  const [loading, setLoading] = useState(false);

  const { cart, incrementQty, decrementQty, removeFromCart, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);

  const grandTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const placeOrder = async () => {
    setLoading(true);
  
    if (!user) {
      toast.error("Please login to place an order.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const orderData = {
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      })),
      grandTotal,
      orderDate: new Date(),
    };

    try {
      console.log(" Current user:", user);
      console.log(" Token from context:", token);
      console.log(" Sending headers:", {
        Authorization: `Bearer ${token}`,
      });

      const res = await axios.post(
        `${API_URL}/api/order/place-order`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message || "Order placed successfully!", {
        position: "top-center", // center horizontally at top
        autoClose: 3000,        // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      clearCart();
    } catch (err) {
      console.error(" Order failed:", err.response?.data || err.message);
      toast.error("Order failed: " + (err.response?.data?.error || err.message), {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Add some vegetables!</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
              
              <div className="quantity-control">
  <button className="qty-btn" onClick={() => decrementQty(item.id)}>-</button>
  <span className="qty-number">{item.quantity}kg</span>
  <button className="qty-btn" onClick={() => incrementQty(item.id)}>+</button>
</div>

              <span>Total: ₹{item.price * item.quantity}</span>
              <button  className="delete-btn" onClick={() => removeFromCart(item.id)}>  <FaTrash /> </button>
            </div>
          ))}
          <h2>Grand Total: ₹{grandTotal}</h2>
          <button className="place-order-btn" onClick={placeOrder} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
            

            
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;





