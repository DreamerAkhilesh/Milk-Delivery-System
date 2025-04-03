import mongoose from "mongoose";
import Subscription from "../models/subscription_model.js";
import User from "../models/user_model.js";

/**
 * Get all users with scheduled deliveries for today.
 */
export const getTodaysDeliveries = async (req, res) => {
  try {
    // Set today to start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Set tomorrow to start of the next day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Use aggregation to join subscriptions with user data
    const subscriptions = await Subscription.aggregate([
      {
        $match: {
          nextDeliveryDate: { $gte: today, $lt: tomorrow },
          status: "active", // Only active subscriptions
        },
      },
      {
        $lookup: {
          from: "users", // Name of the collection
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }, // Flatten the user array
      {
        $project: {
          userId: "$user._id",
          name: "$user.name",
          address: "$user.profile.address",
          walletBalance: "$user.wallet.balance",
          subscriptionType: "$product",
        },
      },
    ]);

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deliveries", error });
  }
};


// has already been mentioned in the admin controllers.

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
 * Get all paused subscriptions due to insufficient wallet balance.
 * This API fetches subscriptions that have been automatically paused
 * (when users have insufficient balance), joins user data, and returns key details.
 */
export const getPausedSubscriptions = async (req, res) => {
  try {
    // Use aggregation to join Subscription data with corresponding User details
    const pausedSubscriptions = await Subscription.aggregate([
      {
        // Match subscriptions where the status is "paused"
        $match: { status: "paused" },
      },
      {
        // Join with the 'users' collection using the userId field
        $lookup: {
          from: "users", // Ensure this matches your actual MongoDB collection name for users
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { 
        // Flatten the joined user array to simplify the output
        $unwind: "$user" 
      },
      {
        // Project the required fields for the admin dashboard
        $project: {
          userId: "$user._id",
          name: "$user.name",
          address: "$user.profile.address",
          walletBalance: "$user.wallet.balance",
          subscriptionType: "$product",
          nextDeliveryDate: 1,
          status: 1,
        },
      },
    ]);

    // Return the list of paused subscriptions
    res.json(pausedSubscriptions);
  } catch (error) {
    // Handle errors gracefully
    res.status(500).json({ message: "Error fetching paused subscriptions", error });
  }
};


/**
 * Get subscriptions that are automatically paused due to insufficient wallet balance.
 */
export const getInsufficientBalancePausedSubscriptions = async (req, res) => {
  try {
    // Use aggregation to join Subscription with User data
    const subscriptions = await Subscription.aggregate([
      {
        $match: {
          status: "paused",
          pauseReason: "insufficient_balance",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$user._id",
          name: "$user.name",
          address: "$user.profile.address",
          walletBalance: "$user.wallet.balance",
          subscriptionType: "$product",
          nextDeliveryDate: 1,
          pauseReason: 1,
        },
      },
    ]);

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching insufficient balance paused subscriptions", error });
  }
};


/**
 * Get subscriptions that have been voluntarily paused by the user.
 */
export const getUserPausedSubscriptions = async (req, res) => {
  try {
    // Use aggregation to join Subscription with User data
    const subscriptions = await Subscription.aggregate([
      {
        $match: {
          status: "paused",
          pauseReason: "user_paused",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$user._id",
          name: "$user.name",
          address: "$user.profile.address",
          walletBalance: "$user.wallet.balance",
          subscriptionType: "$product",
          nextDeliveryDate: 1,
          pauseReason: 1,
        },
      },
    ]);

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user paused subscriptions", error });
  }
};

