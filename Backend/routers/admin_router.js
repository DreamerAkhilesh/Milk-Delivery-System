import express from "express";
import { registerAdmin, loginAdmin, getDashboardStats } from "../controllers/admin_controller.js";
import { verifyAdmin } from "../middlewares/auth_middleware.js";
import { dispatchDeliveries } from "../controllers/admin_controller.js";

const router = express.Router();

router.post("/register", registerAdmin); // Register an admin
router.post("/login", loginAdmin); // Admin login
router.post("/dispatch", verifyAdmin, dispatchDeliveries); // Admin-only route
router.get("/dashboard-stats", getDashboardStats); // dashboard-stats

export default router;
