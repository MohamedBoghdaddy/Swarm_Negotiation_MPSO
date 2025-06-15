import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useDashboardContext } from "../../context/DashboardContext";
import "../../styles/UserForm.css";
import { useAuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserForm() {
  const {
    runNegotiation,
    algorithms,
    winnerAlgorithm,
    currentRound,
    getEvaluationMetrics,
    fetchManufacturers,
    NODE_API_URL,
  } = useDashboardContext();

  const { user, token, refreshToken, logout } = useAuthContext();

  const [form, setForm] = useState({
    fabricType: "",
    quantity: 1,
    priceRange: 100,
    qualityPreference: "Standard",
    deliveryTimeline: 7,
  });

  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [history, setHistory] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sortKey, setSortKey] = useState("fitness");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterQuality, setFilterQuality] = useState("");

  const [nodeAxiosInstance] = useState(() =>
    axios.create({ baseURL: NODE_API_URL })
  );

  // Axios interceptor for token and refresh handling
  useEffect(() => {
    const reqInterceptor = nodeAxiosInstance.interceptors.request.use(
      (config) => {
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = nodeAxiosInstance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return nodeAxiosInstance(originalRequest);
          } catch (refreshError) {
            toast.error("Session expired. Please login again.");
            setShowLoginModal(true);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      nodeAxiosInstance.interceptors.request.eject(reqInterceptor);
      nodeAxiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [token, refreshToken, nodeAxiosInstance]);

  // Load optimization history
  useEffect(() => {
    const saved = localStorage.getItem("optimizationHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Fetch manufacturers using context function
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setShowLoginModal(true);
        return;
      }
      try {
        const manufacturersData = await fetchManufacturers(token);
        setManufacturers(manufacturersData);
      } catch (err) {
        console.error("❌ Failed to fetch manufacturer products:", err);
        toast.error(
          `Failed to load manufacturers: ${
            err.response?.data?.error || err.message
          }`
        );
      }
    };
    fetchData();
  }, [token, fetchManufacturers]);

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
    if (!token) return setShowLoginModal(true);
    if (!form.fabricType || !form.qualityPreference) {
      return toast.error("Please complete all form fields.");
    }
    if (manufacturers.length === 0) {
      return toast.error("No manufacturer products loaded.");
    }

    try {
      setLoading(true);
      await runNegotiation(form, manufacturers);
      setNegotiationResult({ algorithms, winner: winnerAlgorithm });

      const metricsData = await getEvaluationMetrics();
      setMetrics(metricsData);

      const newEntry = {
        date: new Date().toISOString(),
        form,
        winner: winnerAlgorithm,
        result: algorithms[winnerAlgorithm]?.offers?.slice(-1)[0],
      };

      const updatedHistory = [newEntry, ...history.slice(0, 4)];
      setHistory(updatedHistory);
      localStorage.setItem(
        "optimizationHistory",
        JSON.stringify(updatedHistory)
      );

      toast.success("Optimization completed successfully!");
    } catch (err) {
      let msg = "Failed to optimize: ";
      if (err.response?.status === 401) {
        msg += "Session expired.";
        setShowLoginModal(true);
      } else {
        msg += err.response?.data?.error || err.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getSortedFilteredResults = () => {
    const allOffers = Object.entries(algorithms).flatMap(([algo, data]) =>
      data.offers.map((offer, index) => ({
        algorithm: algo,
        ...offer,
        fitness: data.fitness,
      }))
    );
    return allOffers
      .filter((o) => !filterQuality || o.quality === filterQuality)
      .sort((a, b) =>
        sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
      );
  };

  const renderAlgorithmComparison = () => (
    <table className="product-table">
      <thead>
        <tr>
          <th>Algorithm</th>
          <th>Best Price</th>
          <th>Quality</th>
          <th>Delivery</th>
          <th>Fitness</th>
          <th>Round</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(algorithms).map(([name, data]) => (
          <tr
            key={name}
            className={winnerAlgorithm === name ? "winner-row" : ""}
          >
            <td>{name}</td>
            <td>{data.offers.slice(-1)[0]?.price || "N/A"}</td>
            <td>{data.offers.slice(-1)[0]?.quality || "N/A"}</td>
            <td>{data.offers.slice(-1)[0]?.delivery || "N/A"} days</td>
            <td>{data.fitness.toFixed(4)}</td>
            <td>{currentRound}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderMetrics = () => (
    <div className="metrics-section">
      <h4>Algorithm Performance Metrics</h4>
      <table className="metrics-table">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Precision</th>
            <th>Recall</th>
            <th>F1-Score</th>
            <th>Support</th>
            <th>GD</th>
            <th>HV</th>
          </tr>
        </thead>
        <tbody>
          {metrics &&
            Object.entries(metrics).map(([algo, data]) => (
              <tr key={algo}>
                <td>{algo}</td>
                <td>{data.precision.toFixed(4)}</td>
                <td>{data.recall.toFixed(4)}</td>
                <td>{data.f1.toFixed(4)}</td>
                <td>{data.support}</td>
                <td>{data.gd.toFixed(4)}</td>
                <td>{data.hv.toFixed(4)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={5000} />
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Login Required</h3>
            <p>Your session has expired or you need to authenticate.</p>
            <div className="modal-actions">
              <button onClick={() => setShowLoginModal(false)}>Cancel</button>
              <button onClick={logout}>Login</button>
            </div>
          </div>
        </div>
      )}

      <h1>Fabric Offer Optimization</h1>

      {/* Form */}
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

      {/* Result Section */}
      {negotiationResult && (
        <div className="result-box">
          <h3>🏆 Winning Algorithm: {winnerAlgorithm}</h3>
          <p>
            <strong>Price:</strong>{" "}
            {algorithms[winnerAlgorithm].offers.slice(-1)[0].price} EGP
          </p>
          <p>
            <strong>Quality:</strong>{" "}
            {algorithms[winnerAlgorithm].offers.slice(-1)[0].quality}
          </p>
          <p>
            <strong>Delivery:</strong>{" "}
            {algorithms[winnerAlgorithm].offers.slice(-1)[0].delivery} days
          </p>

          <h4>Algorithm Comparison</h4>
          {renderAlgorithmComparison()}

          <button
            className="metrics-btn"
            onClick={() => setShowMetrics(!showMetrics)}
          >
            {showMetrics ? "Hide Metrics" : "Show Evaluation Metrics"}
          </button>

          {showMetrics && metrics && renderMetrics()}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="result-box">
          <h3>📜 Optimization History</h3>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                {new Date(entry.date).toLocaleString()} - {entry.winner} @{" "}
                {entry.result.price} EGP ({entry.result.quality})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserForm;
