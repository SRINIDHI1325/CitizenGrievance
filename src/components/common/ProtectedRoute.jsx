// src/components/common/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  // Fetch role from Firestore or context (simplified example)
  const role = JSON.parse(localStorage.getItem("role"));

  if (allowedRoles.includes(role)) return children;
  return <Navigate to="/login" />;
};

export default ProtectedRoute;