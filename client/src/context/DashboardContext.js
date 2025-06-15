import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "./AuthContext"; // Adjust path if needed

export const DashboardContext = createContext();

const NODE_API_URL = "http://localhost:4000"; // NodeJS server
const PYTHON_API_URL = "http://localhost:8000"; // Python server

const DashboardProvider = ({ children }) => {
  const { currentUser } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [algorithms, setAlgorithms] = useState({
    PSO: { offers: [], fitness: 0, metrics: {} },
    GA: { offers: [], fitness: 0, metrics: {} },
    ABC: { offers: [], fitness: 0, metrics: {} },
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [winnerAlgorithm, setWinnerAlgorithm] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState(null);

  const handleError = (error, message) => {
    console.error(message, error);
    toast.error(`${message}: ${error.response?.data?.detail || error.message}`);
  };

  const runNegotiation = useCallback(async (userOffer, manufacturerOffers) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${PYTHON_API_URL}/api/negotiation/run`,
        {
          userOffer,
          manufacturerOffers,
          algorithms: ["PSO", "GA", "ABC"],
        }
      );

      setAlgorithms(response.data.algorithms);
      setWinnerAlgorithm(response.data.winner);
      setCurrentRound(response.data.currentRound);

      toast.success("Negotiation completed successfully!");
    } catch (error) {
      handleError(error, "Failed to run negotiation");
    } finally {
      setLoading(false);
    }
  }, []);

  const getEvaluationMetrics = useCallback(async () => {
    try {
      const response = await axios.get(
        `${PYTHON_API_URL}/api/negotiation/metrics`
      );
      setEvaluationResults(response.data);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to get evaluation metrics");
      return null;
    }
  }, []);

  const fetchManufacturers = useCallback(async (token) => {
    try {
      const res = await axios.get(`${NODE_API_URL}/api/manufacturer/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.products.map((prod, idx) => ({
        id: idx + 1,
        ...prod,
      }));
    } catch (error) {
      handleError(error, "Failed to fetch manufacturers");
      throw error;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      currentUser,
      loading,
      algorithms,
      currentRound,
      winnerAlgorithm,
      evaluationResults,
      runNegotiation,
      getEvaluationMetrics,
      fetchManufacturers,
      NODE_API_URL,
      PYTHON_API_URL,
    }),
    [
      currentUser,
      loading,
      algorithms,
      currentRound,
      winnerAlgorithm,
      evaluationResults,
      runNegotiation,
      getEvaluationMetrics,
      fetchManufacturers,
    ]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardProvider;

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};
