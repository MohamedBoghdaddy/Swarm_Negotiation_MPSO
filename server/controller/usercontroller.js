import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import User from "../models/UserModel.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Multer file upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  },
});
export const upload = multer({ storage });

// ✅ Token creation utility
const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

// ✅ Register
export const registerUser = async (req, res) => {
  const { username, email, password, firstName, lastName, gender } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const field = existingUser.username === username ? "username" : "email";
      return res
        .status(400)
        .json({ message: `User with this ${field} already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Role is never accepted from the client — all signups are plain "user"
    // accounts. Promotions can only happen via the admin-only role routes.
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
      role: "user",
    });

    const token = createToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username,
        email,
        role: user.role,
        gender,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.blocked)
      return res
        .status(403)
        .json({ message: "Your account is blocked by the admin." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ Logout
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Check auth status
export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update profile
// A user may only edit their own profile (unless they are an admin), and
// only a fixed allow-list of non-sensitive fields. role/password/blocked/_id/
// createdAt/emailVerified can never be changed through this endpoint.
const EDITABLE_PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "receiveNotifications",
];

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only update your own profile." });
    }

    const updates = {};
    for (const field of EDITABLE_PROFILE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (req.file) updates.profilePhoto = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Change own password (separate from profile update, always hashed)
export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only change your own password." });
    }

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword || "", user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Toggle block/unblock
export const toggleBlockStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    res.json({ success: true, blocked: user.blocked });
  } catch (err) {
    res.status(500).json({ message: "Error toggling block status" });
  }
};

// ✅ Login metadata (IP, timestamp)
export const updateLoginMeta = async (req, res) => {
  const { email } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: { lastLogin: new Date(), lastIP: ip },
        $push: { activityLog: { action: "Login", timestamp: new Date() } },
      },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating login metadata" });
  }
};

// ✅ Admin: Update user role or password
export const updateUserRoleOrPassword = async (req, res) => {
  const { id } = req.params;
  const { newRole, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (newRole && ["user", "admin", "manufacturer"].includes(newRole)) {
      user.role = newRole;
    }

    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

// ✅ Admin: Update role only
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { newRole } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!["user", "admin", "manufacturer"].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    user.role = newRole;
    await user.save();

    res.json({ success: true, message: "Role updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update role", error: err.message });
  }
};
