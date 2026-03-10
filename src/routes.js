import React from "react";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";

const routes = [
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/admin", element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> },
  { path: "/officer", element: <ProtectedRoute><OfficerDashboard /></ProtectedRoute> },
  { path: "/citizen", element: <ProtectedRoute><CitizenDashboard /></ProtectedRoute> },
];

export default routes;