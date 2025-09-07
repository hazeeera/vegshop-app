
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

import "./navbar.css"; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      
      <div className="logo">
        <Link to="/">VegShop</Link>
      </div>

   
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/contactus">Contact us</Link>
        </li>
      
        <li>
  <Link to="/cart" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <FaShoppingCart /> Cart
  </Link>
 </li>

        {user ? (
          <>
             <li>
             
           
              <div className="navbar-user">
      <FaUserCircle size={24} style={{ marginRight: "8px" }} />
      <span className="user-greeting">Hi, {user.name}!</span>
      
    </div>
  </li> 

            <li>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;


