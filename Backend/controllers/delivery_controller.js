import Subscription from "../models/subscription_model.js";
import User from "../models/user_model.js";

/**
 * Get all users with scheduled deliveries today
 */
export const getTodaysDeliveries = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Find subscriptions active today
    const subscriptions = await Subscription.find({ nextDeliveryDate: today });

    // Fetch user details
    const usersWithDeliveries = await Promise.all(
      subscriptions.map(async (sub) => {
        const user = await User.findById(sub.userId).select(
          "name address walletBalance"
        );
        return {
          userId: user._id,
          name: user.name,
          address: user.address,
          subscriptionType: sub.product,
          walletBalance: user.walletBalance,
        };
      })
    );

    res.json(usersWithDeliveries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deliveries", error });
  }
};

/**
 * Mark users as dispatched & deduct charges from wallets
 */
export const dispatchDeliveries = async (req, res) => {
  try {
    const { userIds } = req.body;

    const subscriptions = await Subscription.find({ userId: { $in: userIds } });

    for (let sub of subscriptions) {
      const user = await User.findById(sub.userId);

      // Deduct balance if sufficient
      if (user.walletBalance >= sub.pricePerDay) {
        user.walletBalance -= sub.pricePerDay;
        await user.save();

        sub.lastDelivered = new Date();
        await sub.save();
      } else {
        console.log(`User ${user.name} has insufficient balance`);
      }
    }

    res.json({ message: "Deliveries updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating deliveries", error });
  }
};
