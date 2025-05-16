import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import axios from "axios";

// ✅ Base URL: fallback to localhost if .env not defined
const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : window.location.origin);

// ✅ Create context
const AuthContext = createContext();

// ✅ Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

// ✅ Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "USER_LOADED":
      return {
        ...state,
        user: action.payload,
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

// ✅ Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAuthorizationHeader = (token) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const removeAuthorizationHeader = () => {
    delete axios.defaults.headers.common["Authorization"];
  };

  // ✅ Load from cookie/localStorage on mount
  const checkAuth = useCallback(async () => {
    if (state.isAuthenticated || !state.loading) return;

    try {
      const token =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || localStorage.getItem("token");

      if (!token) {
        dispatch({ type: "AUTH_ERROR" });
        return;
      }

      const res = await axios.get(`${API_URL}/api/users/checkAuth`, {
        withCredentials: true,
      });

      const { user } = res.data;

      if (user) {
        dispatch({ type: "USER_LOADED", payload: user });
        setAuthorizationHeader(token);
        localStorage.setItem("user", JSON.stringify({ token, user }));
      } else {
        dispatch({ type: "AUTH_ERROR" });
      }
    } catch (err) {
      console.error("❌ Auth check failed:", err);
      dispatch({ type: "AUTH_ERROR" });
    }
  }, [state.isAuthenticated, state.loading]);

  // ✅ Run checkAuth on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const { token, user } = JSON.parse(storedUser);
        if (user && token) {
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
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

  // ✅ Logout
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    removeAuthorizationHeader();
    dispatch({ type: "LOGOUT_SUCCESS" });
  }, []);

  // ✅ Memoized context
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      logout,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      role: state.user?.role,
      token:
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || localStorage.getItem("token"),
    }),
    [state, logout]
  );

  // ✅ Optional debug
  useEffect(() => {
    if (!state.loading) {
      console.log("🔁 Auth State:", state);
    }
  }, [state]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
