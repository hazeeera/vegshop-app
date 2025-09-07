
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

 
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setToken(storedToken);
      console.log("🔑 Token restored from localStorage:", storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }, []);

  
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      //  rename destructured token to avoid shadowing state
      const { token: serverToken, user: userFromRes, msg } = res.data;

      if (!serverToken || !userFromRes) {
        return { success: false, msg: "Invalid server response" };
      }

      
      axios.defaults.headers.common["Authorization"] = `Bearer ${serverToken}`;

      // persist in localStorage
      localStorage.setItem("token", serverToken);
      localStorage.setItem("user", JSON.stringify(userFromRes));
    

      // update context state
      setUser(userFromRes);
      setToken(serverToken);
      console.log(" Login successful");
      console.log(" Token stored:", serverToken);
      console.log(" User stored:", userFromRes);
      

      return { success: true, msg };
    } catch (err) {
      console.error("Login failed:", err);
      return {
        success: false,
        msg: err.response?.data?.msg || err.message || "Login failed",
      };
    }
  };

  const logout = () => {
   
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};





