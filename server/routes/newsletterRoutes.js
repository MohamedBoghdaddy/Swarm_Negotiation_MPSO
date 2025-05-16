// routes/newsletterRoutes.js
import express from "express";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  try {
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: "Already subscribed." });
    }

    await NewsletterSubscriber.create({ email });
    res.status(201).json({ message: "Successfully subscribed." });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    res.status(500).json({ message: "Subscription failed." });
  }
});

export default router;
