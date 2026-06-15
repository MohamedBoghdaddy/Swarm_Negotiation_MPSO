import axios from "axios";
import Negotiation from "../models/NegotiationModel.js";

const PYTHON_API_BASE_URL =
  process.env.PYTHON_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * @route   POST /api/negotiation/start
 * @desc    Run the MPSO/ABC/GA comparison for a user negotiation request
 *          and persist the result.
 * @access  Private (user only)
 */
export const startNegotiation = async (req, res) => {
  try {
    const {
      fabricType,
      quantity,
      priceRange,
      qualityPreference,
      deliveryTimeline,
      manufacturers,
      weights,
    } = req.body;

    if (!Array.isArray(manufacturers) || !manufacturers.length) {
      return res
        .status(400)
        .json({ error: "manufacturers must be a non-empty array" });
    }

    const payload = {
      user: {
        fabricType,
        quantity,
        priceRange,
        qualityPreference,
        deliveryTimeline,
      },
      manufacturers,
      weights: weights || { user: 0.5, manufacturer: 0.5 },
    };

    const response = await axios.post(
      `${PYTHON_API_BASE_URL}/compare-algorithms`,
      payload
    );

    const results = response.data;

    const session = await Negotiation.create({
      userId: req.user._id,
      userRequest: payload.user,
      manufacturers,
      results: results.map((r) => ({
        manufacturerId: r.manufacturer_id,
        algorithms: r.algorithms,
        winner: r.winner,
        winningOffer: r.winning_offer,
        comparisonMetrics: r.comparison_metrics,
      })),
    });

    res.status(200).json({
      message: "Negotiation completed successfully",
      negotiationId: session._id,
      results,
    });
  } catch (error) {
    console.error("Negotiation Error:", error.message);
    res.status(500).json({ error: "Negotiation failed" });
  }
};

/**
 * @route   POST /api/negotiation
 * @desc    Pass-through proxy to the Python comparison endpoint.
 * @access  Private (user only)
 */
export const optimize = async (req, res) => {
  try {
    const response = await axios.post(
      `${PYTHON_API_BASE_URL}/compare-algorithms`,
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
