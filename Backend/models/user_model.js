import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
  },
  wallet: {
    balance: { type: Number, default: 0 }, 
    transactions: [
      {
        amount: Number,
        type: { type: String, enum: ["credit", "debit"] },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },
});

const User = mongoose.model("User", userSchema);
export default User;


// Next Steps
// API to Add Money to Wallet
// API to Deduct Money on Delivery
// Allow Users to Update Address

