import express from "express";
import { startNegotiation, optimize } from "../controller/negotiationController.js";
import { auth, verifyUser } from "../Middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/negotiation/start
 * @desc    Run PSO/MPSO + ABC + GA comparison and persist the session
 * @access  Private (user only)
 */
router.post("/start", auth, verifyUser, startNegotiation);

/**
 * @route   POST /api/negotiation
 * @desc    Proxy negotiation optimization to the Python service
 * @access  Private (user only)
 */
router.post("/", auth, verifyUser, optimize);

export default router;
