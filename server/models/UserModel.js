import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "manufacturer"],
      default: "user",
    },
    profilePhoto: {
      type: String, // URL or path
    },
    receiveNotifications: {
      type: Boolean,
      default: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    lastIP: {
      type: String,
    },
    activityLog: [ActivityLogSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
