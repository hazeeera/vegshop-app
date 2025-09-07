
import React from "react";
import "./fotter.css"; 

const Fotter = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h1>VegShop</h1>
        </div>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/cart">Cart</a>
          <a href="/contactus">Contact Us</a>
          <a href="/register">Register</a>
        </div>
        <div className="footer-contact">
          <p>mailto: <a href="mailto:hazitupakula@gmail.com">vegshop@gmail.com</a></p>
          <p>tel: <a href="tel:+9391449196">+91 12345 67890</a></p>
        </div>
        <div className="footer-copy">
          <p>&copy; 2025 VegShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Fotter;
