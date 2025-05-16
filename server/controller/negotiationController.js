// server/controllers/negotiationController.js
const axios = require("axios");
const NegotiationSession = require("../models/NegotiationSession");

exports.startNegotiation = async (req, res) => {
  try {
    const {
      userID,
      fabricType,
      quantity,
      priceRange,
      qualityPreference,
      deliveryTimeline,
      manufacturers,
    } = req.body;

    const userPrefs = {
      priceRange,
      qualityPreference,
      deliveryTime: deliveryTimeline,
    };

    const pythonPayload = {
      user: userPrefs,
      manufacturers,
    };

    // Call the Python MPSO microservice
    const response = await axios.post(
      "http://localhost:8000/optimize",
      pythonPayload
    );

    const result = response.data;

    // Save to MongoDB
    const session = new NegotiationSession({
      userID,
      timestamp: new Date(),
      status: "finalized",
      finalManufacturerID: result.recommended.manufacturerID,
      negotiationRounds: [
        {
          roundNumber: 1,
          userOffer: {
            price: priceRange[0],
            quality: qualityPreference,
            delivery: deliveryTimeline,
          },
          manufacturerResponses: manufacturers.map((m) => ({
            manufacturerID: m.id,
            price: m.initialOffer.price,
            quality: m.initialOffer.quality,
            delivery: m.initialOffer.delivery,
          })),
          optimizedOffers: [result.recommended, ...result.rejected],
        },
      ],
    });

    await session.save();

    res.status(200).json({
      message: "Negotiation completed successfully",
      result,
    });
  } catch (error) {
    console.error("Negotiation Error:", error);
    res.status(500).json({ error: "Negotiation failed" });
  }
};
export const optimize = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/optimize",
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};