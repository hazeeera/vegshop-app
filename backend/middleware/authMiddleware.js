
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET || "prabhas@8"); 
    // // req.user = decoded; // contains { id: ... }
    // req.user = { id: user._id, email: user.email };
    // next();
    console.log("Token received:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "prabhas@8");
     // contains { id: ... }
     console.log("Decoded JWT:", decoded);

    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = { id: user._id, email: user.email }; 
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = { protect };

