import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user_model.js";

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


import User from "../models/user_model.js";

/**
 * Get wallet transactions for all users.
 *
 * This endpoint aggregates wallet transactions by:
 * - Unwinding the 'wallet.transactions' array so each transaction becomes a separate document.
 * - Projecting the userId, name, and transaction details.
 * - Sorting transactions by date in descending order.
 */
export const getAllWalletTransactions = async (req, res) => {
  try {
    const walletTransactions = await User.aggregate([
      {
        // Unwind the transactions array to list each transaction separately
        $unwind: "$wallet.transactions",
      },
      {
        // Project only the required fields
        $project: {
          userId: "$_id",
          name: "$name",
          transaction: "$wallet.transactions",
        },
      },
      {
        // Sort transactions by date in descending order
        $sort: { "transaction.date": -1 },
      },
    ]);

    res.json(walletTransactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet transactions", error });
  }
};


import mongoose from "mongoose";
import User from "../models/user_model.js";

/**
 * Get wallet transactions for a specific user.
 *
 * This endpoint accepts a 'userId' parameter in the URL and aggregates the wallet transactions
 * for that user by:
 * - Matching the specific user document.
 * - Unwinding the 'wallet.transactions' array.
 * - Projecting the userId, name, and transaction details.
 * - Sorting transactions by date in descending order.
 */
export const getWalletTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate the provided user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const walletTransactions = await User.aggregate([
      {
        // Match the user by _id
        $match: { _id: mongoose.Types.ObjectId(userId) },
      },
      {
        // Unwind the transactions array to get individual transactions
        $unwind: "$wallet.transactions",
      },
      {
        // Project required fields
        $project: {
          userId: "$_id",
          name: "$name",
          transaction: "$wallet.transactions",
        },
      },
      {
        // Sort transactions by date in descending order
        $sort: { "transaction.date": -1 },
      },
    ]);

    res.json(walletTransactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet transactions", error });
  }
};

