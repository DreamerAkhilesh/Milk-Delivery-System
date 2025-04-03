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


// /**
//  * Admin dispatches milk, deducts wallet balance
//  * @param {Request} req - Express request
//  * @param {Response} res - Express response
//  */
// /**
//  * Dispatch products and deduct balance from users' wallets.
//  */
// export const dispatchProducts = async (req, res) => {
//     try {
//       const { dispatchedUsers } = req.body; // Array of user IDs
  
//       if (!dispatchedUsers || !Array.isArray(dispatchedUsers)) {
//         return res.status(400).json({ message: "Invalid user list" });
//       }
  
//       let successful = [];
//       let failed = [];
  
//       for (let userId of dispatchedUsers) {
//         const user = await User.findById(userId);
//         if (!user || !user.subscription.isActive) {
//           failed.push({ userId, reason: "User not found or subscription inactive" });
//           continue;
//         }
  
//         const amountToDeduct = user.subscription.pricePerDay;
  
//         if (user.walletBalance >= amountToDeduct) {
//           user.walletBalance -= amountToDeduct;
//           await user.save();
//           successful.push({ userId, deducted: amountToDeduct });
//         } else {
//           failed.push({ userId, reason: "Insufficient balance" });
//         }
//       }
  
//       res.json({
//         message: "Dispatch processed",
//         successful,
//         failed,
//       });
  
//     } catch (error) {
//       console.error("Dispatch Error:", error);
//       res.status(500).json({ message: "Server error", error });
//     }
//   };

/**
 * Mark deliveries as dispatched & deduct charges from user wallets.
 * Automatically pauses subscriptions if the user's wallet balance is insufficient.
 */
export const dispatchDeliveries = async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userIds } = req.body; // List of user IDs whose deliveries need processing

    // Find active subscriptions for these users
    const subscriptions = await Subscription.find({
      userId: { $in: userIds },
      status: "active",
    }).session(session);

    for (let sub of subscriptions) {
      // Retrieve the user document in the current session
      const user = await User.findById(sub.userId).session(session);

      // Check if the user has enough wallet balance
      if (user.wallet.balance >= sub.pricePerDay) {
        // Deduct the daily price from the user's wallet
        user.wallet.balance -= sub.pricePerDay;

        // Record the wallet transaction
        user.wallet.transactions.push({
          amount: sub.pricePerDay,
          type: "debit",
          reason: `Milk delivery for ${sub.product}`,
          date: new Date(),
        });

        // Mark the delivery as delivered
        sub.lastDelivered = new Date();
        sub.deliveryHistory.push({ date: new Date(), status: "delivered" });

        // Optionally update nextDeliveryDate here if needed
        // sub.nextDeliveryDate = new Date(sub.nextDeliveryDate.setDate(sub.nextDeliveryDate.getDate() + 1));

        // Save changes for user and subscription within the transaction
        await user.save({ session });
        await sub.save({ session });
      } else {
        console.log(`User ${user.name} has insufficient balance. Pausing subscription.`);
        // Pause the subscription and record the reason
        sub.status = "paused";
        sub.pauseReason = "insufficient_balance";
        await sub.save({ session });

        // (Optional) Trigger a notification to the user for low balance
      }
    }

    // Commit the transaction if all updates are successful
    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Deliveries updated successfully" });
  } catch (error) {
    // Roll back changes if any error occurs
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Error updating deliveries", error });
  }
};


/**
 * Pause subscriptions for users with insufficient wallet balance.
 * This endpoint checks each active subscription to see if the user’s
 * wallet balance is less than the price per day. If so, the subscription
 * status is updated to "paused" and (optionally) a notification can be sent.
 */
export const pauseInsufficientBalanceSubscriptions = async (req, res) => {
  try {
    // Fetch all active subscriptions
    const activeSubscriptions = await Subscription.find({ status: "active" });

    // Process each subscription to check for sufficient balance
    for (const sub of activeSubscriptions) {
      // Fetch the associated user document
      const user = await User.findById(sub.userId);

      // Skip if user not found (shouldn't happen in a consistent DB)
      if (!user) continue;

      // If the wallet balance is less than the daily subscription cost, pause the subscription
      if (user.wallet.balance < sub.pricePerDay) {
        sub.status = "paused";
        await sub.save();

        // Optional: Trigger a notification to the user to recharge their wallet.
        // For example, you could integrate an email or SMS service here.
        console.log(`Subscription for user ${user.name} has been paused due to insufficient balance.`);
      }
    }

    res.json({ message: "Checked and paused subscriptions with insufficient balance." });
  } catch (error) {
    res.status(500).json({ message: "Error pausing subscriptions", error });
  }
};

import User from "../models/user_model.js";
import Subscription from "../models/subscription_model.js";

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Count active subscriptions
    const activeUsers = await Subscription.countDocuments({ status: "active" });

    // Count paused subscriptions (voluntary + insufficient balance)
    const pausedVoluntary = await Subscription.countDocuments({ status: "paused", reason: "voluntary" });
    const pausedInsufficient = await Subscription.countDocuments({ status: "paused", reason: "insufficient_balance" });
    const totalPaused = pausedVoluntary + pausedInsufficient;

    // Total wallet transactions today
    const transactions = await User.aggregate([
      { $unwind: "$wallet.transactions" },
      {
        $match: {
          "wallet.transactions.date": {
            $gte: new Date(today),
            $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCredited: {
            $sum: {
              $cond: [{ $eq: ["$wallet.transactions.type", "credit"] }, "$wallet.transactions.amount", 0],
            },
          },
          totalDebited: {
            $sum: {
              $cond: [{ $eq: ["$wallet.transactions.type", "debit"] }, "$wallet.transactions.amount", 0],
            },
          },
        },
      },
    ]);

    const walletSummary = transactions.length > 0 ? transactions[0] : { totalCredited: 0, totalDebited: 0 };

    // Deliveries completed today
    const deliveriesCompleted = await Subscription.countDocuments({
      "deliveryHistory.date": new Date(today),
      "deliveryHistory.status": "delivered",
    });

    // Failed deliveries (low balance)
    const failedDeliveries = await Subscription.countDocuments({
      "deliveryHistory.date": new Date(today),
      "deliveryHistory.status": "missed",
    });

    res.json({
      totalActiveUsers: activeUsers,
      pausedSubscriptions: { voluntary: pausedVoluntary, insufficientBalance: pausedInsufficient, total: totalPaused },
      walletTransactions: walletSummary,
      deliveriesCompleted,
      failedDeliveries,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};


