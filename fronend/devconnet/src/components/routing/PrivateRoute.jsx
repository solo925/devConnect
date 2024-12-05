import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, loading } = auth;

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
