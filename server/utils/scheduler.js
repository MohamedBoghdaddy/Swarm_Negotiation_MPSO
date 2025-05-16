// ✅ Enhancements: Save summaries to DB, CC admins, Weekly Report
import cron from "node-cron";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Negotiation from "./models/NegotiationModel.js";
import Summary from "./models/SummaryModel.js";
import User from "./models/UserModel.js";

// Helper: send email
const sendEmail = async (subject, text, ccEmails = []) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `Swarm MPSO <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    cc: ccEmails,
    subject,
    text,
  });
};

// 📅 Daily Summary at 23:59
cron.schedule("59 23 * * *", async () => {
  try {
    const now = new Date();
    const start = new Date(now.setHours(0, 0, 0, 0));
    const end = new Date(now.setHours(23, 59, 59, 999));

    const negotiations = await Negotiation.find({
      date: { $gte: start, $lte: end },
    });
    const count = negotiations.length;
    const avgFitness = (
      negotiations.reduce((acc, n) => acc + (n.recommended?.fitness || 0), 0) /
      (count || 1)
    ).toFixed(2);

    const summary = new Summary({
      date: new Date(),
      totalNegotiations: count,
      averageFitness: avgFitness,
    });
    await summary.save();

    const text = `📅 ${summary.date.toDateString()}
Negotiations: ${count}
Average Fitness: ${avgFitness}`;

    const adminList = await User.find({ role: "admin" }).select("email");
    const ccEmails = adminList.map((a) => a.email);

    await sendEmail("📈 Daily Negotiation Summary", text, ccEmails);
    console.log("✅ Daily summary saved and emailed.");
  } catch (err) {
    console.error("❌ Daily summary cron failed:", err);
  }
});

// 📊 Weekly Summary every Sunday at 23:50
cron.schedule("50 23 * * 0", async () => {
  try {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 7);

    const negotiations = await Negotiation.find({
      date: { $gte: start, $lte: end },
    });

    const total = negotiations.length;
    const avgFitness = (
      negotiations.reduce((acc, n) => acc + (n.recommended?.fitness || 0), 0) /
      (total || 1)
    ).toFixed(2);

    const text = `📊 Weekly Negotiation Summary
Range: ${start.toDateString()} - ${end.toDateString()}
Total Negotiations: ${total}
Average Fitness: ${avgFitness}`;

    const admins = await User.find({ role: "admin" }).select("email");
    const ccEmails = admins.map((a) => a.email);

    await sendEmail("📊 Weekly Report - MPSO Negotiations", text, ccEmails);
    console.log("✅ Weekly summary sent to admins.");
  } catch (err) {
    console.error("❌ Weekly report cron failed:", err);
  }
});
