import express from "express";
import { sendOTP, registerUser, loginUser } from "../controllers/user_controller.js";

const router = express.Router();

router.post("/send-otp", sendOTP); // Send OTP
router.post("/register", registerUser); // Verify OTP & Register
router.post("/login", loginUser) // Login User
export default router;


