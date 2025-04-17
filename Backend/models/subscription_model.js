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
    enum: ["active", "paused", "cancelled"],
    default: "active",
  },
  pauseReason: {
    type: String,
    enum: ["insufficient_balance", "user_paused", "none"],
    default: "none",
  },
  deliveryFrequency: {
    type: String,
    enum: ["daily", "alternate", "weekly"],
    default: "daily",
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    landmark: String,
  },
  paymentMethod: {
    type: String,
    enum: ["online", "cod"],
    default: "online",
  },
  lastPaymentDate: {
    type: Date,
  },
  nextPaymentDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Subscription", SubscriptionSchema);
