

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../pages/login.css";

const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Enter password"
        className="auth-input"
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="eye-icon"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

export default PasswordInput;
