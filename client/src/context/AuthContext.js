import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : window.location.origin);

// Context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "USER_LOADED":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT_SUCCESS":
    case "AUTH_ERROR":
      return { ...state, user: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Read token from localStorage or cookie
  const getStoredToken = () =>
    localStorage.getItem("token") ||
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  const setAuthorizationHeader = (token) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const removeAuthorizationHeader = () => {
    delete axios.defaults.headers.common["Authorization"];
  };

  // Auth check on mount
  const checkAuth = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      dispatch({ type: "AUTH_ERROR" });
      return;
    }

    try {
      setAuthorizationHeader(token);

      const res = await axios.get(`${API_URL}/api/users/checkAuth`, {
        withCredentials: true,
      });

      const user = res.data.user;

      if (user) {
        dispatch({ type: "USER_LOADED", payload: { user } });
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ user, token }));
      } else {
        dispatch({ type: "AUTH_ERROR" });
      }
    } catch (err) {
      console.error("❌ Auth check failed:", err);
      dispatch({ type: "AUTH_ERROR" });
    }
  }, []);

  useEffect(() => {
    const local = localStorage.getItem("user");

    if (local) {
      try {
        const { token, user } = JSON.parse(local);
        if (user && token) {
          dispatch({ type: "LOGIN_SUCCESS", payload: { user } });
          setAuthorizationHeader(token);
        } else {
          checkAuth();
        }
      } catch (err) {
        console.error("❌ Failed to parse local user:", err);
        dispatch({ type: "AUTH_ERROR" });
      }
    } else {
      checkAuth();
    }
  }, [checkAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    removeAuthorizationHeader();
    dispatch({ type: "LOGOUT_SUCCESS" });
  }, []);

  const contextValue = useMemo(() => {
    const token = getStoredToken();

    return {
      user: state.user,
      role: state.user?.role,
      token,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      logout,
      dispatch,
    };
  }, [state, logout]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
