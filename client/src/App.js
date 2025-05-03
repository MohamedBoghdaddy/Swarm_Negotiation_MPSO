import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserForm from "./components/forms/UserForm";
import ManufacturerForm from "./components/forms/ManufacturerForm";
import "./App.css"; // Import global styles for the app

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Welcome to the Offer Optimization App</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<UserForm />} />
            <Route path="/manufacturer" element={<ManufacturerForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
