import jwt from "jsonwebtoken";
import Admin from "../models/admin_model.js";
import User from "../models/user_model.js"; // Import the User model

export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(403).json({ message: "Access Denied" });

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Invalid token format" });

    console.log('Verifying admin token:', token.substring(0, 10) + '...');

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(403).json({ message: "Invalid Token" });

    console.log('Token verified, admin ID:', verified.id);

    const admin = await Admin.findById(verified.id);
    if (!admin) return res.status(403).json({ message: "Admin not found" });

    console.log('Admin found:', admin.email);

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Invalid Token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Token Expired" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(403).json({ message: "Access Denied" });

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Invalid token format" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(403).json({ message: "Invalid Token" });

    // Use userId from token instead of id
    const userId = verified.userId || verified.id;
    if (!userId) return res.status(403).json({ message: "Invalid token: missing user ID" });

    const user = await User.findById(userId);
    if (!user) return res.status(403).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error('User verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Invalid Token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Token Expired" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};