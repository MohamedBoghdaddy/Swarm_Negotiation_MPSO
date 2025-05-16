import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/UserModel.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in .env");
  process.exit(1);
}

/**
 * ✅ Middleware: Authenticate user using token (from header or cookie)
 */
export const auth = async (req, res, next) => {
  try {
    let token = null;

    // 🔐 Check for Bearer token in headers
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 🔐 Fallback to cookie token
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // ❌ No token found
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // ✅ Verify token and attach user to request
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid user token." });
    }

    req.user = user;

    console.log(`✅ Authenticated: ${user.username} (${user.role})`);
    next();
  } catch (error) {
    console.error("❌ Auth Error:", error);

    const message =
      error.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Unauthorized access. Invalid token.";

    return res.status(401).json({ message });
  }
};

/**
 * ✅ Middleware: Role-based access control
 * @param  {...string} roles - Allowed roles (e.g., "admin", "user")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Access denied. User not authenticated." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires role: [${roles.join(
          ", "
        )}], but your role is '${req.user.role}'.`,
      });
    }

    console.log(`✅ Role Authorized: ${req.user.username} → ${req.user.role}`);
    next();
  };
};

// ✅ Shorthand middlewares for specific roles
export const verifyAdmin = authorizeRoles("admin");
export const verifyManufacturer = authorizeRoles("manufacturer");
export const verifyUser = authorizeRoles("user");
export const verifyAdminOrUser = authorizeRoles("admin", "user");
export const verifyAdminOrManufacturer = authorizeRoles(
  "admin",
  "manufacturer"
);
