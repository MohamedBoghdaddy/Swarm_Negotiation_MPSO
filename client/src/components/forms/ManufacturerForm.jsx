import React, { useState } from "react";
import axios from "axios";
import "../../styles/ManufacturerForm.css"; // Import external CSS for styling

function ManufacturerForm() {
  const [form, setForm] = useState({
    manufacturerName: "",
    initialOffer: {
      price: "",
      quality: "Standard",
      delivery: "",
    },
    minPrice: "",
    qualities: ["Economy", "Standard", "Premium"],
    minDelivery: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("initialOffer")) {
      const updatedOffer = {
        ...form.initialOffer,
        [name.split(".")[1]]: value,
      };
      setForm({ ...form, initialOffer: updatedOffer });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/manufacturer",
        form
      );
      alert("Manufacturer details submitted successfully!");
    } catch (error) {
      alert("There was an error submitting the form.");
    }
  };

  return (
    <div className="form-container">
      <h1>Manufacturer Offer Details</h1>
      <div className="form-field">
        <label>Manufacturer Name:</label>
        <input
          name="manufacturerName"
          onChange={handleChange}
          className="input-field"
        />
      </div>
      <div className="form-field">
        <label>Initial Price Offer:</label>
        <input
          name="initialOffer.price"
          onChange={handleChange}
          type="number"
          className="input-field"
        />
      </div>
      <div className="form-field">
        <label>Initial Quality Offer:</label>
        <select
          name="initialOffer.quality"
          onChange={handleChange}
          className="input-field"
        >
          {form.qualities.map((quality, index) => (
            <option key={index} value={quality}>
              {quality}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label>Initial Delivery Time (days):</label>
        <input
          name="initialOffer.delivery"
          onChange={handleChange}
          type="number"
          className="input-field"
        />
      </div>
      <div className="form-field">
        <label>Minimum Price:</label>
        <input
          name="minPrice"
          onChange={handleChange}
          type="number"
          className="input-field"
        />
      </div>
      <div className="form-field">
        <label>Minimum Delivery Time (days):</label>
        <input
          name="minDelivery"
          onChange={handleChange}
          type="number"
          className="input-field"
        />
      </div>
      <button onClick={handleSubmit} className="submit-btn">
        Submit Offer
      </button>
    </div>
  );
}

export default ManufacturerForm;
