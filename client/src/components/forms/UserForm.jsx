import React, { useState } from "react";
import axios from "axios";
import "../../styles/UserForm.css"; // Import external CSS for styling

function UserForm() {
  const [form, setForm] = useState({
    fabricType: "",
    quantity: 0, // Initial value for quantity
    priceRange: 0, // Initial value for price range
    qualityPreference: "",
    deliveryTimeline: 0, // Initial value for delivery timeline
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const user = {
      fabricType: form.fabricType,
      quantity: form.quantity,
      priceRange: form.priceRange,
      qualityPreference: form.qualityPreference,
      deliveryTimeline: form.deliveryTimeline,
    };

    const requestData = {
      user: user, // Wrap form data in a 'user' key
      manufacturers: [], // Add actual manufacturers' data here
      weights: {
        price: 0.4,
        quality: 0.4,
        delivery: 0.2,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/optimize",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(
        "Offer submitted! Recommended offer: " +
          JSON.stringify(response.data.recommended)
      );
    } catch (error) {
      console.error("Error submitting offer:", error);
      alert("There was an error submitting your offer!");
    }
  };

  return (
    <div className="form-container">
      <h1>Optimize Your Offer</h1>

      {/* Fabric Type Dropdown */}
      <div className="form-field">
        <label>Fabric Type:</label>
        <select
          name="fabricType"
          onChange={handleChange}
          value={form.fabricType}
          className="input-field"
        >
          <option value="">Select Fabric Type</option>
          <option value="Cotton">Cotton</option>
          <option value="Silk">Silk</option>
          <option value="Wool">Wool</option>
          <option value="Polyester">Polyester</option>
        </select>
      </div>

      {/* Quantity Slider (in meters) */}
      <div className="form-field">
        <label>Quantity (in meters): {form.quantity}m</label>
        <input
          name="quantity"
          type="range"
          min="1"
          max="100"
          step="1"
          onChange={handleChange}
          value={form.quantity}
          className="input-field"
        />
      </div>

      {/* Price Range Slider (EGP) */}
      <div className="form-field">
        <label>Price Range (EGP): {form.priceRange} EGP</label>
        <input
          name="priceRange"
          type="range"
          min="0"
          max="10000"
          step="100"
          onChange={handleChange}
          value={form.priceRange}
          className="input-field"
        />
      </div>

      {/* Quality Preference Dropdown */}
      <div className="form-field">
        <label>Quality Preference:</label>
        <select
          name="qualityPreference"
          onChange={handleChange}
          value={form.qualityPreference}
          className="input-field"
        >
          <option value="Economy">Economy</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      {/* Delivery Timeline Slider (in days) */}
      <div className="form-field">
        <label>Delivery Timeline (days): {form.deliveryTimeline} days</label>
        <input
          name="deliveryTimeline"
          type="range"
          min="1"
          max="30"
          step="1"
          onChange={handleChange}
          value={form.deliveryTimeline}
          className="input-field"
        />
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} className="submit-btn">
        Submit Offer
      </button>
    </div>
  );
}

export default UserForm;
