import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/admin_controller.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import { dispatchProducts } from "../controllers/admin_controller.js";

const router = express.Router();

router.post("/admin/register", registerAdmin); // Register an admin
router.post("/admin/login", loginAdmin); // Admin login
router.post("/admin/dispatch", verifyAdmin, dispatchProducts); // Admin-only route

export default router;





