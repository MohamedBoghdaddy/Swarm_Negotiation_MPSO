import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ManufacturerForm.css";
import { useAuthContext } from "../../context/AuthContext";

const ManufacturerProductForm = () => {
  const { state } = useAuthContext();
  const token = state?.user?.token || localStorage.getItem("token");

  const [form, setForm] = useState({
    manufacturerName: "",
    fabricType: "",
    qualities: [],
    minPrice: "",
    minDelivery: "",
    initialOffer: {
      price: "",
      quality: "Standard",
      delivery: "",
    },
  });

  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("initialOffer.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        initialOffer: { ...prev.initialOffer, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQualitiesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, qualities: selected }));
  };

  const resetForm = () => {
    setForm({
      manufacturerName: "",
      fabricType: "",
      qualities: [],
      minPrice: "",
      minDelivery: "",
      initialOffer: {
        price: "",
        quality: "Standard",
        delivery: "",
      },
    });
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/manufacturer/products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(
        "❌ Failed to fetch products:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      manufacturerName: form.manufacturerName,
      fabricType: form.fabricType,
      qualities: form.qualities,
      minPrice: Number(form.minPrice),
      minDelivery: Number(form.minDelivery),
      initialOffer: {
        price: Number(form.initialOffer.price),
        delivery: Number(form.initialOffer.delivery),
        quality: form.initialOffer.quality,
      },
    };

    try {
      await axios.post(
        "http://localhost:4000/api/manufacturer/product",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Manufacturer & Product submitted successfully!");
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(
        "❌ Submission error:",
        error.response?.data || error.message
      );
      alert("Submission failed. Check your data and try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Manufacturer Product Submission</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Manufacturer Name:</label>
          <input
            name="manufacturerName"
            placeholder="e.g. Global Textiles"
            value={form.manufacturerName}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-field">
          <label>Fabric Type:</label>
          <input
            name="fabricType"
            placeholder="e.g. Cotton"
            value={form.fabricType}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-field">
          <label>Available Qualities:</label>
          <select
            multiple
            name="qualities"
            onChange={handleQualitiesChange}
            className="input-field"
            value={form.qualities}
          >
            <option value="Economy">Economy</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <div className="form-field">
          <label>Minimum Price ($):</label>
          <input
            name="minPrice"
            type="number"
            min="0"
            placeholder="e.g. 100"
            value={form.minPrice}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-field">
          <label>Minimum Delivery Time (days):</label>
          <input
            name="minDelivery"
            type="number"
            min="1"
            placeholder="e.g. 5"
            value={form.minDelivery}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <h3>Initial Offer</h3>

        <div className="form-field">
          <label>Initial Price ($):</label>
          <input
            name="initialOffer.price"
            type="number"
            min="0"
            placeholder="e.g. 120"
            value={form.initialOffer.price}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-field">
          <label>Initial Quality:</label>
          <select
            name="initialOffer.quality"
            onChange={handleChange}
            className="input-field"
            value={form.initialOffer.quality}
            required
          >
            <option value="Economy">Economy</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <div className="form-field">
          <label>Initial Delivery Time (days):</label>
          <input
            name="initialOffer.delivery"
            type="number"
            min="1"
            placeholder="e.g. 7"
            value={form.initialOffer.delivery}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      {/* ✅ Table of Submitted Products */}
      <h3>Submitted Products</h3>
      {products.length > 0 ? (
        <table className="product-table">
          <thead>
            <tr>
              <th>Fabric</th>
              <th>Qualities</th>
              <th>Min Price</th>
              <th>Min Delivery</th>
              <th>Initial Price</th>
              <th>Initial Quality</th>
              <th>Initial Delivery</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i}>
                <td>{p.fabricType}</td>
                <td>{p.qualities.join(", ")}</td>
                <td>${p.minPrice}</td>
                <td>{p.minDelivery} days</td>
                <td>${p.initialOffer.price}</td>
                <td>{p.initialOffer.quality}</td>
                <td>{p.initialOffer.delivery} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products submitted yet.</p>
      )}
    </div>
  );
};

export default ManufacturerProductForm;
