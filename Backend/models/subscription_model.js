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
});

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);