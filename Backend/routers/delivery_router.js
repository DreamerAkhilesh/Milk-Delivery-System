import express from "express";
import { getTodaysDeliveries, dispatchDeliveries } from "../controllers/delivery_controller.js";
import { verifyAdmin } from "../middleware/auth.js"; // Ensure admin access

const router = express.Router();

router.get("/deliveries/today", verifyAdmin, getTodaysDeliveries);
router.post("/deliveries/dispatch", verifyAdmin, dispatchDeliveries);

export default router;
