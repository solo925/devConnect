import React from "react";
import { Route, Routes } from "react-router-dom"; // Import Routes and Route
import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      {/* Other routes */}
    </Routes>
  );
};

export default RoutesComponent;
