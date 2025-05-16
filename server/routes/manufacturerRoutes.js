// ✅ manufacturerRoutes.js
import express from "express";
import {
  addProduct,
  getManufacturerProducts,
} from "../controller/manufacturerController.js";
import {
  auth,
  verifyManufacturer,
  authorizeRoles,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ Test route to confirm this file is mounted
router.get("/test", (req, res) => {
  console.log("🔥 /api/manufacturer/test hit");
  res.json({ message: "✅ Test route is working." });
});

// ✅ All protected routes use auth
router.use(auth);

router.post("/product", verifyManufacturer, addProduct);

// Add logger before actual logic to verify route is reached
router.get(
  "/products",
  (req, res, next) => {
    console.log("🔥 /api/manufacturer/products hit");
    next();
  },
  authorizeRoles("admin", "user", "manufacturer"),
  getManufacturerProducts
);

export default router;
