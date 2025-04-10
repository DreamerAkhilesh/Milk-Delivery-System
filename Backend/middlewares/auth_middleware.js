import jwt from "jsonwebtoken";
import Admin from "../models/admin_model.js";
import User from "../models/user_model.js"; // Import the User model

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ message: "Access Denied" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(403).json({ message: "Invalid Token" });

    const admin = await Admin.findById(verified.id);
    if (!admin) return res.status(403).json({ message: "Admin not found" });

    req.admin = admin;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ message: "Access Denied" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(403).json({ message: "Invalid Token" });

    const user = await User.findById(verified.id);
    if (!user) return res.status(403).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};