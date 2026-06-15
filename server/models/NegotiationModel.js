import mongoose from "mongoose";

const OptimizedOfferSchema = new mongoose.Schema(
  {
    price: Number,
    delivery: Number,
    quality: String,
  },
  { _id: false }
);

const AlgorithmResultSchema = new mongoose.Schema(
  {
    manufacturerID: Number,
    optimizedOffer: OptimizedOfferSchema,
    fitness: Number,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const ManufacturerResultSchema = new mongoose.Schema(
  {
    manufacturerId: Number,
    algorithms: { type: Map, of: AlgorithmResultSchema },
    winner: String,
    winningOffer: AlgorithmResultSchema,
    comparisonMetrics: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const NegotiationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "accepted", "rejected"],
      default: "completed",
    },
    userRequest: { type: mongoose.Schema.Types.Mixed, required: true },
    manufacturers: { type: mongoose.Schema.Types.Mixed, required: true },
    results: [ManufacturerResultSchema],
    rounds: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Negotiation", NegotiationSchema);
