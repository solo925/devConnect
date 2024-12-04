import React from "react";
import { Route, Routes } from "react-router-dom"; // Use Routes for version 6+
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
    </Routes>
  );
};

export default RoutesComponent;
