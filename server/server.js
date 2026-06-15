// ✅ Core Imports
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import connectMongoDBSession from "connect-mongodb-session";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import cron from "node-cron";
import nodemailer from "nodemailer";

// ✅ Models
import Negotiation from "./models/NegotiationModel.js";

// ✅ Route Imports
import userRoutes from "./routes/userroutes.js";
import analyticsRoutes from "./routes/analyticRoutes.js";
import manufacturerRoutes from "./routes/manufacturerRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import negotiationRoutes from "./routes/negotiationRoutes.js";

// ✅ Constants & Configs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const upload = multer({ dest: "uploads/" });
const MongoDBStore = connectMongoDBSession(session);

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
const FLASK_API_BASE_URL =
  process.env.FLASK_API_BASE_URL || "http://127.0.0.1:8000";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// ✅ MongoDB Connection
if (!MONGO_URL) {
  console.error("❌ MongoDB connection string missing.");
  process.exit(1);
}
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB failed:", err);
    setTimeout(() => mongoose.connect(MONGO_URL), 5000);
  });

// ✅ MongoDB Session Store
const store = new MongoDBStore({ uri: MONGO_URL, collection: "sessions" });
store.on("error", (error) => console.error("❌ Session store error:", error));

// ✅ Middleware
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Test Route to Confirm /api/manufacturer is reachable
app.get("/api/manufacturer/test", (req, res) => {
  console.log("✅ /api/manufacturer/test reached");
  res.status(200).json({ message: "Manufacturer route working!" });
});

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/manufacturer", manufacturerRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/negotiation", negotiationRoutes);

// ✅ Serve frontend — must come AFTER API routes
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/build/index.html"))
);

// ✅ Cron Job: Daily Summary + Email to Admin
cron.schedule("59 23 * * *", async () => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const negotiations = await Negotiation.find({
      createdAt: { $gte: start, $lte: end },
    });

    const count = negotiations.length;
    const fitnessValues = negotiations.flatMap((n) =>
      (n.results || [])
        .map((r) => r?.winningOffer?.fitness)
        .filter((f) => typeof f === "number")
    );
    const avgFitness = (
      fitnessValues.reduce((sum, f) => sum + f, 0) /
      (fitnessValues.length || 1)
    ).toFixed(2);

    const summary = `
      📅 Date: ${new Date().toLocaleDateString()}
      📦 Negotiations Today: ${count}
      📊 Average Fitness: ${avgFitness}
    `;

    console.log(`[DAILY SUMMARY] ${summary}`);

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Swarm Negotiation" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: "📈 Daily Negotiation Summary",
      text: summary,
    });

    console.log("✅ Summary email sent to admin.");
  } catch (err) {
    console.error("❌ Cron job/email failed:", err.message);
  }
});

// ✅ Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
