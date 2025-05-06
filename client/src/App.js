import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserForm from "./components/forms/UserForm";
import ManufacturerForm from "./components/forms/ManufacturerForm";
import Home from "./components/Home/home";
import NavBar from "./components/Home/NavBar";
import Footer from "./components/Home/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<UserForm />} />
            <Route path="/manufacturer" element={<ManufacturerForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
