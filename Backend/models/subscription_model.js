import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  nextDeliveryDate: {
    type: Date,
    required: true,
  },
  deliveryHistory: [
    {
      date: Date,
      status: {
        type: String,
        enum: ["delivered", "missed"],
        default: "delivered",
      },
    },
  ],
  status: {
    type: String,
    enum: ["active", "paused", "expired"],
    default: "active",
  },
  // New field to indicate why the subscription was paused
  pauseReason: {
    type: String,
    enum: ["insufficient_balance", "user_paused", "none"],
    default: "none",
  },
});

export default mongoose.model("Subscription", SubscriptionSchema);
