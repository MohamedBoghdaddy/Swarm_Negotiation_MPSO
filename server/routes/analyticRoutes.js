import express from "express";
import {
  getUserStatistics,
  getManufacturerStats,
  getNegotiationHistory,
  getRecentLogins,
} from "../controller/analyticsController.js";

const router = express.Router();

router.get("/statistics", getUserStatistics);
router.get("/manufacturer-stats", getManufacturerStats);
router.get("/negotiations", getNegotiationHistory);
router.get("/recent-logins", getRecentLogins);

export default router;
