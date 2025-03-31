import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is in the allowed admin list
    const adminEmails = process.env.ADMIN_EMAILS.split(",");
    if (!adminEmails.includes(email)) {
      return res.status(403).json({ message: "Unauthorized admin email" });
    }

    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
  }
};


// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Admin logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in admin", error });
  }
};


/**
 * Admin dispatches milk, deducts wallet balance
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
/**
 * Dispatch products and deduct balance from users' wallets.
 */
export const dispatchProducts = async (req, res) => {
    try {
      const { dispatchedUsers } = req.body; // Array of user IDs
  
      if (!dispatchedUsers || !Array.isArray(dispatchedUsers)) {
        return res.status(400).json({ message: "Invalid user list" });
      }
  
      let successful = [];
      let failed = [];
  
      for (let userId of dispatchedUsers) {
        const user = await User.findById(userId);
        if (!user || !user.subscription.isActive) {
          failed.push({ userId, reason: "User not found or subscription inactive" });
          continue;
        }
  
        const amountToDeduct = user.subscription.pricePerDay;
  
        if (user.walletBalance >= amountToDeduct) {
          user.walletBalance -= amountToDeduct;
          await user.save();
          successful.push({ userId, deducted: amountToDeduct });
        } else {
          failed.push({ userId, reason: "Insufficient balance" });
        }
      }
  
      res.json({
        message: "Dispatch processed",
        successful,
        failed,
      });
  
    } catch (error) {
      console.error("Dispatch Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };