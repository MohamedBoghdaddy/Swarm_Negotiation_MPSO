import Manufacturer from "../models/Manufacturer.js";

/**
 * @route   POST /api/manufacturer/product
 * @desc    Add a new product (for logged-in manufacturers)
 */
export const addProduct = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      manufacturerName,
      fabricType,
      qualities,
      minPrice,
      minDelivery,
      initialOffer,
    } = req.body;

    if (
      !fabricType ||
      !Array.isArray(qualities) ||
      !qualities.length ||
      minPrice == null ||
      minDelivery == null ||
      !initialOffer?.price ||
      !initialOffer?.delivery ||
      !initialOffer?.quality
    ) {
      return res
        .status(400)
        .json({ error: "Missing required product fields." });
    }

    const productData = {
      fabricType,
      qualities,
      minPrice: Number(minPrice),
      minDelivery: Number(minDelivery),
      initialOffer: {
        price: Number(initialOffer.price),
        delivery: Number(initialOffer.delivery),
        quality: initialOffer.quality,
      },
    };

    let manufacturer = await Manufacturer.findOne({ userId });

    if (manufacturer) {
      manufacturer.products.push(productData);
      if (manufacturerName) manufacturer.manufacturerName = manufacturerName;
      await manufacturer.save();
    } else {
      manufacturer = await Manufacturer.create({
        userId,
        manufacturerName: manufacturerName || "Unnamed Manufacturer",
        products: [productData],
      });
    }

    return res.status(200).json({
      message: "✅ Product saved.",
      product: productData,
      totalProducts: manufacturer.products.length,
    });
  } catch (err) {
    console.error("❌ addProduct error:", err.message);
    return res.status(500).json({ error: "Failed to save product." });
  }
};

/**
 * @route   GET /api/manufacturer/products
 * @desc    Get all products for logged-in manufacturer
 */
export const getManufacturerProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    const manufacturer = await Manufacturer.findOne({ userId });
    if (!manufacturer)
      return res.status(404).json({ error: "Manufacturer not found." });

    res.status(200).json({ products: manufacturer.products });
  } catch (err) {
    console.error("❌ getManufacturerProducts error:", err.message);
    res.status(500).json({ error: "Failed to fetch products." });
  }
};
