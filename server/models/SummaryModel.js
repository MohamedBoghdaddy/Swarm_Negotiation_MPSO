import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    totalNegotiations: {
      type: Number,
      required: true,
    },
    averageFitness: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Summary", SummarySchema);
