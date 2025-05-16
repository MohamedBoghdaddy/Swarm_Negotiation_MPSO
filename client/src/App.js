// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UserForm from "./components/forms/UserForm";
import ManufacturerForm from "./components/forms/ManufacturerForm";
import Home from "./components/Home/home";
import NavBar from "./components/Home/NavBar";
import Footer from "./components/Home/Footer";
import Login from "./components/login&register/Login";
import Signup from "./components/login&register/Signup";
import Dashboard from "./components/AdminDashboard/Dashboard.jsx";
import { useAuthContext } from "./context/AuthContext";
import "./App.css";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user?.role))
    return <Navigate to="/" />;
  return element;
};

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/user"
              element={
                <ProtectedRoute
                  element={<UserForm />}
                  allowedRoles={["user"]}
                />
              }
            />
            <Route
              path="/manufacturer"
              element={
                <ProtectedRoute
                  element={<ManufacturerForm />}
                  allowedRoles={["manufacturer"]}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  element={<Dashboard />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
