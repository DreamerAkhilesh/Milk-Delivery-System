import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate Order for Razorpay
export const createOrder = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_rcptid_${userId}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

// Verify Razorpay Payment & Add Money to Wallet
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Payment is valid, update wallet balance
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.walletBalance += amount;
      await user.save();

      res.status(200).json({ message: "Payment successful, wallet updated!" });
    } else {
      res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error });
  }
};
