import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
  updateLoginMeta,
  upload,
  updateUserRoleOrPassword,
  updateUserRole,
} from "../controller/usercontroller.js";

import { auth, authorizeRoles } from "../Middleware/authMiddleware.js";
import User from "../models/UserModel.js";

const router = express.Router();

// =====================================================
// ✅ PUBLIC ROUTES (No authentication required)
// =====================================================

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Called from frontend after login success to record metadata
router.put("/meta/login", updateLoginMeta);

// =====================================================
// ✅ AUTHENTICATED USER ROUTES
// =====================================================

router.get("/checkAuth", auth, checkAuth);
router.get("/users/:userId", auth, getUserById);

router.put(
  "/profile/:userId",
  auth,
  upload.single("profilePhoto"),
  updateUserProfile
);

// =====================================================
// ✅ ADMIN-ONLY ROUTES
// =====================================================

// View all users (for dashboard)
router.get("/users", auth, authorizeRoles("admin"), getAllUsers);

// Delete user by ID
router.delete("/users/:userId", auth, authorizeRoles("admin"), deleteUser);

// Update user role or password (admin panel)
router.put(
  "/admin/update-user/:id",
  auth,
  authorizeRoles("admin"),
  updateUserRoleOrPassword
);

// Update only role (simpler endpoint)
router.put(
  "/admin/update-role/:id",
  auth,
  authorizeRoles("admin"),
  updateUserRole
);

// =====================================================
// ✅ ADMIN DASHBOARD ROUTES (Protected properly)
// =====================================================

// Admin welcome route
router.get("/admin", auth, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

// Shared dashboard view for users and admins
router.get(
  "/dashboard",
  auth,
  authorizeRoles("admin", "user", "manufacturer"),
  (req, res) => {
    res
      .status(200)
      .json({ message: `Welcome to the Dashboard, ${req.user.role}!` });
  }
);

// =====================================================
// ✅ ENHANCED ADMIN BULK ACTIONS (now protected)
// =====================================================

router.get("/all", auth, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.delete(
  "/delete/:id",
  auth,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Error deleting user" });
    }
  }
);

router.put(
  "/toggle-block/:id",
  auth,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.blocked = !user.blocked;
      await user.save();

      res.json({ success: true, blocked: user.blocked });
    } catch (err) {
      res.status(500).json({ message: "Error toggling block status" });
    }
  }
);

export default router;
