import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  fabricType: {
    type: String,
    required: true,
    trim: true,
  },
  qualities: {
    type: [String],
    enum: ["Economy", "Standard", "Premium"],
    required: true,
  },
  minPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  minDelivery: {
    type: Number,
    required: true,
    min: 1,
  },
  initialOffer: {
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    delivery: {
      type: Number,
      required: true,
      min: 1,
    },
    quality: {
      type: String,
      enum: ["Economy", "Standard", "Premium"],
      required: true,
    },
  },
});

const ManufacturerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    manufacturerName: {
      type: String,
      required: true,
      trim: true,
    },
    products: [ProductSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Manufacturer", ManufacturerSchema);
