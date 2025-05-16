import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/signup.css";
import { useSignup } from "../../hooks/useSignup";

const Signup = () => {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    gender,
    setGender,
    role,
    setRole,
    errorMessage,
    successMessage,
    isLoading,
    handleSignup,
  } = useSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="main-container">
      <div className="frame-container">
        {/* Left: Signup Form */}
        <div className="left-sign">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSignup}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Choose a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={70}
                required
              />
            </div>

            <div className="field password-container">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <span
                  className="toggle-visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="field password-container">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  minLength={6}
                  required
                />
                <span
                  className="toggle-visibility"
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="field">
              <label>Gender</label>
              <div className="gender-container">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    required
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    required
                  />
                  Female
                </label>
              </div>
            </div>

            <div className="field">
              <label>Role</label>
              <div className="role-container">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={() => setRole("user")}
                    required
                  />
                  Fabric Buyer
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="manufacturer"
                    checked={role === "manufacturer"}
                    onChange={() => setRole("manufacturer")}
                    required
                  />
                  Manufacturer
                </label>
              </div>
            </div>

            {errorMessage && <div className="error">{errorMessage}</div>}
            {successMessage && <div className="success">{successMessage}</div>}

            <button type="submit" className="left_btn" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Right: Login Redirect */}
        <div className="right-sign">
          <h1>Already have an account?</h1>
          <Link to="/signin">
            <button type="button" className="right_btn">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
