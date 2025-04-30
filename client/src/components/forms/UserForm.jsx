import React, { useState } from "react";
import axios from "axios";

function UserForm() {
  const [form, setForm] = useState({
    fabricType: "",
    quantity: "",
    priceRange: "",
    qualityPreference: "",
    deliveryTimeline: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post("/api/negotiation/start", form);
    alert("Offer submitted!");
  };

  return (
    <div>
      <input name="fabricType" onChange={handleChange} />
      <input name="quantity" onChange={handleChange} />
      <input name="priceRange" onChange={handleChange} />
      <select name="qualityPreference" onChange={handleChange}>
        <option>Economy</option>
        <option>Standard</option>
        <option>Premium</option>
      </select>
      <input name="deliveryTimeline" onChange={handleChange} />
      <button onClick={handleSubmit}>Submit Offer</button>
    </div>
  );
}

export default UserForm;
