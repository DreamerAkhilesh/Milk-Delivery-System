import express from "express";
import { 
  createSubscription, 
  getUserSubscriptions, 
  getSubscriptionById, 
  updateSubscriptionStatus,
  completeSubscriptionPayment,
  getUserAddress,
  updateUserAddress,
  getWalletBalance
} from "../controllers/subscription_controller.js";
import { verifyUser } from "../middlewares/auth_middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyUser);

// Subscription management routes
router.post("/", createSubscription);
router.get("/", getUserSubscriptions);
router.get("/:id", getSubscriptionById);
router.patch("/:id/status", updateSubscriptionStatus);
router.post("/:id/payment", completeSubscriptionPayment);

// User address routes
router.get("/address", getUserAddress);
router.post("/address", updateUserAddress);

// Wallet routes
router.get("/wallet/balance", getWalletBalance);

export default router; 