import User from "../models/UserModel.js";
import Negotiation from "../models/NegotiationModel.js";
import Manufacturer from "../models/Manufacturer.js";

// ✅ Negotiation History Analytics per Manufacturer
export const getManufacturerStats = async (req, res) => {
  try {
    const negotiations = await Negotiation.find();

    const countMap = {};
    negotiations.forEach((n) => {
      const id = n.recommended?.manufacturerID;
      if (id) countMap[id] = (countMap[id] || 0) + 1;
    });

    const allManufacturers = await Manufacturer.find({});
    const stats = allManufacturers.flatMap((m) =>
      m.products.map((p, i) => ({
        manufacturerName: p.manufacturerName,
        fabricType: p.fabricType,
        count: countMap[i + 1] || 0,
      }))
    );

    res.status(200).json(stats);
  } catch (err) {
    console.error("❌ getManufacturerStats error:", err);
    res.status(500).json({ message: "Failed to load manufacturer stats" });
  }
};

// ✅ General System Statistics (User Roles)
export const getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalManufacturers = await User.countDocuments({
      role: "manufacturer",
    });
    const totalRegularUsers = await User.countDocuments({ role: "user" });

    res.json({
      totalUsers,
      totalAdmins,
      totalManufacturers,
      totalRegularUsers,
    });
  } catch (err) {
    console.error("Error in getUserStatistics:", err.message);
    res.status(500).json({ error: "Failed to load statistics" });
  }
};

// ✅ Recent Logins
export const getRecentLogins = async (req, res) => {
  try {
    const recent = await User.find({ lastLogin: { $exists: true } })
      .sort({ lastLogin: -1 })
      .limit(5)
      .select("username email role lastLogin profilePhoto");

    res.status(200).json(recent);
  } catch (err) {
    console.error("❌ getRecentLogins error:", err.message);
    res.status(500).json({ error: "Failed to load recent logins" });
  }
};

// ✅ Negotiation History for Admin Dashboard
export const getNegotiationHistory = async (req, res) => {
  try {
    const negotiations = await Negotiation.find().sort({ date: -1 });
    res.status(200).json(negotiations);
  } catch (err) {
    console.error("❌ getNegotiationHistory error:", err.message);
    res.status(500).json({ message: "Failed to load negotiation history" });
  }
};
