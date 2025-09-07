import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Pages
import Home from "./pages/Home";
import Contactus from "./pages/Contactus"
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Components
import Navbar from "./components/Navbar";
import Fotter from "./components/Fotter";
import "./components/fotter.css"

// Context
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>


          <Navbar /> 
          <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/contactus" element={<Contactus />} />     
            
                
            <Route path="/cart" element={<Cart />} />     
            <Route path="/login" element={<Login />} />     
            <Route path="/register" element={<Register />} /> 
            
          </Routes>
          </div>

          <Fotter />
          <ToastContainer position="top-right" autoClose={3000} />
          
        </Router>
       </CartProvider>
    </AuthProvider> 
  );
}

export default App;

