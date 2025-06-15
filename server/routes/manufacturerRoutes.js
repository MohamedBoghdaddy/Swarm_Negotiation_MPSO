import express from "express";
import {
  addProduct,
  getAllManufacturerProducts,
  getMyManufacturerProducts,
} from "../controller/manufacturerController.js";
import { auth, verifyManufacturer } from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ Public: Customers see all manufacturer products
router.get("/products", getAllManufacturerProducts);

// ✅ Auth required from here on
router.use(auth);

// ✅ Manufacturer adds product
router.post("/product", verifyManufacturer, addProduct);

// ✅ Manufacturer sees their own products
router.get("/my-products", verifyManufacturer, getMyManufacturerProducts);

export default router;
