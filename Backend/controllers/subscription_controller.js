import Subscription from "../models/subscription_model.js";
import User from "../models/user_model.js";
import Product from "../models/product_model.js";

/**
 * Create a new subscription
 */
export const createSubscription = async (req, res) => {
  try {
    const { 
      productId, 
      quantity, 
      deliveryFrequency, 
      address, 
      paymentMethod,
      subscriptionPlan 
    } = req.body;

    // Get user ID from authenticated request
    const userId = req.user._id;

    // Validate required fields
    if (!productId || !quantity || !deliveryFrequency || !subscriptionPlan) {
      return res.status(400).json({ 
        message: "Product ID, quantity, delivery frequency, and subscription plan are required" 
      });
    }

    // Fetch the product to get price information
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check product availability
    if (!product.availability || product.quantity < quantity) {
      return res.status(400).json({ message: "Product is not available in requested quantity" });
    }

    // Calculate frequency multiplier
    let frequencyMultiplier = 1;
    switch (deliveryFrequency) {
      case "daily":
        frequencyMultiplier = 1;
        break;
      case "alternate":
        frequencyMultiplier = 0.5;
        break;
      case "weekly":
        frequencyMultiplier = 0.25;
        break;
      default:
        frequencyMultiplier = 1;
    }

    // Calculate subscription duration in days
    let durationDays = 15; // Default for 15 days plan
    switch (subscriptionPlan) {
      case "15_days":
        durationDays = 15;
        break;
      case "1_month":
        durationDays = 30;
        break;
      case "2_months":
        durationDays = 60;
        break;
      case "3_months":
        durationDays = 90;
        break;
      case "6_months":
        durationDays = 180;
        break;
      case "1_year":
        durationDays = 365;
        break;
    }

    // Calculate total cost
    const dailyCost = product.pricePerDay * quantity;
    const totalDeliveries = Math.ceil(durationDays * frequencyMultiplier);
    const totalCost = dailyCost * totalDeliveries;

    // Set start date as tomorrow
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);

    // Set next delivery date (same as start date for first delivery)
    const nextDeliveryDate = new Date(startDate);

    // Get user address or use provided one
    const user = await User.findById(userId);
    const deliveryAddress = address || user.profile.address;

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    // Create new subscription
    const newSubscription = new Subscription({
      userId,
      productId,
      quantity,
      product: product.name,
      pricePerDay: product.pricePerDay,
      startDate,
      nextDeliveryDate,
      deliveryFrequency,
      subscriptionPlan,
      durationDays,
      totalCost,
      address: deliveryAddress,
      paymentMethod: paymentMethod || "online",
      endDate: new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000),
      status: "pending_payment"
    });

    // Process payment based on method
    if (paymentMethod === "wallet") {
      // Check wallet balance
      if (user.wallet.balance < totalCost) {
        return res.status(400).json({ 
          message: "Insufficient wallet balance", 
          requiredAmount: totalCost,
          currentBalance: user.wallet.balance
        });
      }

      // Deduct from wallet
      user.wallet.balance -= totalCost;
      user.wallet.transactions.push({
        amount: totalCost,
        type: "debit",
        description: `Subscription payment for ${product.name}`
      });

      // Update subscription status
      newSubscription.status = "active";
      newSubscription.lastPaymentDate = new Date();

      // Save user and subscription
      await user.save();
      await newSubscription.save();

      return res.status(201).json({
        message: "Subscription created and paid from wallet",
        data: {
          subscription: newSubscription,
          remainingBalance: user.wallet.balance
        }
      });
    } else {
      // Save subscription with pending payment status
      await newSubscription.save();

      // For online payment, return subscription ID for frontend to initiate payment
      return res.status(201).json({
        message: "Subscription created, waiting for payment",
        data: {
          subscription: newSubscription,
          paymentRequired: true,
          amount: totalCost
        }
      });
    }
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ 
      message: "Failed to create subscription", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get user's subscriptions
 */
export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Subscriptions retrieved successfully",
      data: {
        subscriptions,
        count: subscriptions.length
      }
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ 
      message: "Failed to fetch subscriptions", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get subscription by ID
 */
export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Ensure user can only access their own subscriptions
    if (subscription.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to subscription" });
    }

    res.status(200).json({
      message: "Subscription retrieved successfully",
      data: {
        subscription
      }
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ 
      message: "Failed to fetch subscription", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Update subscription status
 */
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pauseReason } = req.body;
    const userId = req.user._id;

    // Validate status
    const validStatuses = ["active", "paused", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Ensure user can only update their own subscriptions
    if (subscription.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to subscription" });
    }

    // Update subscription status
    subscription.status = status;
    
    if (status === "paused" && pauseReason) {
      subscription.pauseReason = pauseReason;
    }

    await subscription.save();

    res.status(200).json({
      message: "Subscription status updated successfully",
      data: {
        subscription
      }
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ 
      message: "Failed to update subscription", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Complete online payment for subscription
 */
export const completeSubscriptionPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId, paymentMethod } = req.body;
    const userId = req.user._id;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Ensure user can only pay for their own subscriptions
    if (subscription.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to subscription" });
    }

    // Validate subscription is in pending payment status
    if (subscription.status !== "pending_payment") {
      return res.status(400).json({ 
        message: "Subscription is not in pending payment status" 
      });
    }

    // Update subscription with payment details
    subscription.status = "active";
    subscription.lastPaymentDate = new Date();
    subscription.paymentMethod = paymentMethod || "online";
    subscription.paymentId = paymentId;

    await subscription.save();

    res.status(200).json({
      message: "Subscription payment completed successfully",
      data: {
        subscription
      }
    });
  } catch (error) {
    console.error("Error completing payment:", error);
    res.status(500).json({ 
      message: "Failed to complete payment", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get user's address for subscription
 */
export const getUserAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User address retrieved successfully",
      data: {
        address: user.profile.address,
        hasAddress: !!user.profile.address
      }
    });
  } catch (error) {
    console.error("Error fetching user address:", error);
    res.status(500).json({ 
      message: "Failed to fetch user address", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Update user's address
 */
export const updateUserAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's profile address
    user.profile.address = address;
    await user.save();

    res.status(200).json({
      message: "Address updated successfully",
      data: {
        address: user.profile.address
      }
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ 
      message: "Failed to update address", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get wallet balance
 */
export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Wallet balance retrieved successfully",
      data: {
        balance: user.wallet.balance,
        transactions: user.wallet.transactions
      }
    });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.status(500).json({ 
      message: "Failed to fetch wallet balance", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}; 