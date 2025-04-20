import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  totalCost: {
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
    enum: ["active", "paused", "cancelled", "pending_payment", "expired"],
    default: "pending_payment",
  },
  pauseReason: {
    type: String,
    enum: ["insufficient_balance", "user_paused", "none"],
    default: "none",
  },
  deliveryFrequency: {
    type: String,
    enum: ["daily", "alternate", "weekly", "one-time"],
    default: "daily",
  },
  subscriptionPlan: {
    type: String,
    enum: ["15_days", "1_month", "2_months", "3_months", "6_months", "1_year"],
    default: "15_days",
  },
  durationDays: {
    type: Number,
    required: true,
    default: 15,
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
    enum: ["wallet", "online", "cod"],
    default: "online",
  },
  paymentId: {
    type: String,
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
