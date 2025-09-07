
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./home.css";

const vegetables = [
  { id: 1, name: "Tomatoes", price: 40, image: "/images/tomatos.jpg" },
  { id: 2, name: "Potatoes", price: 30, image: "/images/potatos.jpg" },
  { id: 3, name: "Carrots", price: 50, image: "/images/carrots.jpg" },
  { id: 4, name: "Onions", price: 35, image: "/images/onions.jpg" },
  { id: 5, name: "Bell Peppers", price: 60, image: "/images/bellpepper.jpeg" },
];

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  
  const [addedItems, setAddedItems] = useState([]);

 
  const handleAddToCart = (item) => {
    if (!user) {
      toast.error("Please login to place an order.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    addToCart(item);

    toast.success(`${item.name} added to cart`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };


  const handleButtonClick = (veg) => {
    
    handleAddToCart(veg);

   
    setAddedItems((prev) => (prev.includes(veg.id) ? prev : [...prev, veg.id]));
  };

  return (
    <div className="home-container">
      {vegetables.map((veg) => (
        <div className="veg-card" key={veg.id}>
          <img src={veg.image} alt={veg.name} />
          <h3>{veg.name}</h3>
          <p>Price: ₹{veg.price}</p>

          <button
            onClick={() => handleButtonClick(veg)}
            className={`cart-btn ${addedItems.includes(veg.id) ? "added" : ""}`}
          >
            {addedItems.includes(veg.id) ? "Added" : "Add to Cart"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;


