import express from "express";
import { optimize } from "../controllers/negotiationController.js";
import { auth, verifyUser } from "../Middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/negotiation
 * @desc    Perform MPSO-based negotiation optimization
 * @access  Private (user only)
 */
router.post("/", auth, verifyUser, optimize);

export default router;
