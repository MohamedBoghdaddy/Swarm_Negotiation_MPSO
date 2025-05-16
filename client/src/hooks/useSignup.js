import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

const API_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:4000" : "");

export const useSignup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [nid, setNid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useAuthContext();

  const handleSignup = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    else return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setErrorMessage("❌ Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/users/signup`,
        {
          username,
          email,
          password,
          confirmPassword,
          firstName,
          middleName,
          lastName,
          gender,
          nid,
          role,
        },
        { withCredentials: true }
      );

      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "REGISTRATION_SUCCESS", payload: user });

      setSuccessMessage("✅ Registration successful!");
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    gender,
    setGender,
    nid,
    setNid,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    role,
    setRole,
    errorMessage,
    successMessage,
    isLoading,
    handleSignup,
  };
};
