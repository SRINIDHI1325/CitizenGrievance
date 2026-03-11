// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (role && role !== userRole) {
    // Logged in but role doesn't match
    if (userRole === "admin") return <Navigate to="/admin" />;
    if (userRole === "officer") return <Navigate to="/officer/dashboard" />;
    return <Navigate to="/citizen/dashboard" />;
  }

  return children;
};

export default PrivateRoute;