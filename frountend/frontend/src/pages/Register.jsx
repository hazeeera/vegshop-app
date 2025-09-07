
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordInput from "../components/PasswordInput";
import axios from "axios";
import  {API_URL } from "../config"
import "./login.css";



const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      const message = res.data.msg;

      if (message === "Registered successfully") {
        toast.success(message, { position: "top-right", autoClose: 3000 });

        
        setTimeout(() => navigate("/login"), 1500);
      } else {

        toast.error(message || "Registration failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.msg || err.response?.data?.error || "Something went wrong!",
        { position: "top-right", autoClose: 3000 }
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;


