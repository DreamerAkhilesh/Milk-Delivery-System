import User from "../models/user_model.js";

/**
 * Send recharge notifications for users with low wallet balance.
 *
 * This endpoint finds users whose wallet balance is below a defined threshold
 * and sends them a notification to recharge their wallet.
 *
 * In a production setup, you would replace the console logs with integration
 * to an email or SMS notification service.
 */


export const sendRechargeNotifications = async (req, res) => {
  try {
    // Define a low wallet balance threshold (adjust this value as needed)
    const lowBalanceThreshold = 50; // For example, 50 currency units

    // Query users whose wallet balance is below the threshold
    const usersToNotify = await User.find({ "wallet.balance": { $lt: lowBalanceThreshold } });

    // Loop through each user and send a notification
    for (const user of usersToNotify) {
      // Simulate sending a notification (replace with actual notification logic)
      console.log(`Notification sent to ${user.name} (${user.email}): Please recharge your wallet. Your current balance is ${user.wallet.balance}.`);
      
      // Optionally, you can update a notifications field in the user document if needed
      // e.g., user.notifications.push({ message: "Please recharge your wallet", date: new Date() });
      // await user.save();
    }

    res.json({ message: `Notifications sent to ${usersToNotify.length} user(s) with low wallet balance.` });
  } catch (error) {
    res.status(500).json({ message: "Error sending recharge notifications", error });
  }
};
