import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "../../styles/UserForm.css";

function UserForm() {
  const [form, setForm] = useState({
    fabricType: "",
    quantity: 1,
    priceRange: 100,
    qualityPreference: "Standard",
    deliveryTimeline: 7,
  });

  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [sortKey, setSortKey] = useState("fitness");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterQuality, setFilterQuality] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("optimizationHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/manufacturer/products"
        );
        const transformed = res.data.products.map((prod, idx) => ({
          id: idx + 1,
          initialOffer: prod.initialOffer,
          minPrice: prod.minPrice,
          minDelivery: prod.minDelivery,
          qualities: prod.qualities,
        }));
        setManufacturers(transformed);
      } catch (err) {
        console.error("Failed to fetch manufacturer products:", err);
      }
    };
    fetchManufacturers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["quantity", "priceRange", "deliveryTimeline"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.fabricType || !form.qualityPreference) {
      alert("Please complete all form fields.");
      return;
    }

    if (manufacturers.length === 0) {
      alert("No manufacturer products loaded. Please try again later.");
      return;
    }

    const requestData = {
      user: { ...form },
      manufacturers: manufacturers.map((m) => ({
        id: m.id,
        minPrice: m.minPrice,
        minDelivery: m.minDelivery,
        qualities: m.qualities,
      })),
      weights: {
        price: 0.4,
        quality: 0.4,
        delivery: 0.2,
      },
    };

    console.log("🟡 Submitting payload to optimizer:", requestData);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/optimize",
        requestData
      );
      const resultData = response.data;
      setResult(resultData);

      const newEntry = {
        date: new Date().toISOString(),
        form,
        recommended: resultData.recommended,
      };

      const updatedHistory = [newEntry, ...history.slice(0, 4)];
      setHistory(updatedHistory);
      localStorage.setItem(
        "optimizationHistory",
        JSON.stringify(updatedHistory)
      );
    } catch (err) {
      console.error(
        "❌ Optimization error:",
        err.response?.data || err.message
      );
      alert(
        "❌ Failed to optimize: " +
          (err.response?.data?.error || "Server error")
      );
    } finally {
      setLoading(false);
    }
  };

  const getSortedFilteredResults = () => {
    if (!result?.rejected) return [];
    return [...result.rejected]
      .filter(
        (r) => !filterQuality || r.optimizedOffer.quality === filterQuality
      )
      .sort((a, b) =>
        sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
      );
  };

  return (
    <div className="form-container">
      <h1>Fabric Offer Optimization</h1>

      <div className="form-field">
        <label>Fabric Type:</label>
        <select
          name="fabricType"
          onChange={handleChange}
          value={form.fabricType}
        >
          <option value="">Select Fabric Type</option>
          <option value="Cotton">Cotton</option>
          <option value="Silk">Silk</option>
          <option value="Wool">Wool</option>
          <option value="Polyester">Polyester</option>
        </select>
      </div>

      <div className="form-field">
        <label>Quantity (m): {form.quantity}</label>
        <input
          name="quantity"
          type="range"
          min="1"
          max="1000"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label>Price Range (EGP): {form.priceRange}</label>
        <input
          name="priceRange"
          type="range"
          min="100"
          max="10000"
          step="100"
          value={form.priceRange}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label>Quality Preference:</label>
        <select
          name="qualityPreference"
          onChange={handleChange}
          value={form.qualityPreference}
        >
          <option value="Economy">Economy</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      <div className="form-field">
        <label>Delivery Timeline: {form.deliveryTimeline} days</label>
        <input
          name="deliveryTimeline"
          type="range"
          min="1"
          max="30"
          value={form.deliveryTimeline}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading} className="submit-btn">
        {loading ? <ClipLoader size={20} color="#fff" /> : "Submit Offer"}
      </button>

      {result && (
        <div className="result-box">
          <h3>🏆 Recommended Offer</h3>
          <p>
            <strong>Price:</strong> {result.recommended.optimizedOffer.price}{" "}
            EGP
          </p>
          <p>
            <strong>Quality:</strong>{" "}
            {result.recommended.optimizedOffer.quality}
          </p>
          <p>
            <strong>Delivery:</strong>{" "}
            {result.recommended.optimizedOffer.delivery} days
          </p>

          <h4>Other Offers</h4>
          <div className="filters">
            <label>Filter by Quality: </label>
            <select
              onChange={(e) => setFilterQuality(e.target.value)}
              value={filterQuality}
            >
              <option value="">All</option>
              <option value="Economy">Economy</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>

            <label>Sort by: </label>
            <select
              onChange={(e) => setSortKey(e.target.value)}
              value={sortKey}
            >
              <option value="fitness">Fitness</option>
              <option value="price">Price</option>
              <option value="delivery">Delivery</option>
            </select>

            <select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Price</th>
                <th>Quality</th>
                <th>Delivery</th>
                <th>Fitness</th>
              </tr>
            </thead>
            <tbody>
              {getSortedFilteredResults().map((item, i) => (
                <tr key={i}>
                  <td>{item.manufacturerID}</td>
                  <td>{item.optimizedOffer.price}</td>
                  <td>{item.optimizedOffer.quality}</td>
                  <td>{item.optimizedOffer.delivery}</td>
                  <td>{item.fitness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {history.length > 0 && (
        <div className="result-box">
          <h3>📜 Optimization History</h3>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                {new Date(entry.date).toLocaleString()} - Recommended:{" "}
                {entry.recommended.optimizedOffer.price} EGP,{" "}
                {entry.recommended.optimizedOffer.quality}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserForm;
