import mongoose from "mongoose";

const NegotiationSchema = new mongoose.Schema({
  username: String,
  date: { type: Date, default: Date.now },
  recommended: {
    optimizedOffer: {
      price: Number,
      quality: String,
      delivery: Number,
    },
    fitness: Number,
    manufacturerID: Number,
  },
});

export default mongoose.model("Negotiation", NegotiationSchema);
