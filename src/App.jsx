// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Dashboards
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Officer Features
import ManageComplaints from "./pages/officer/ManageComplaints";
import UpdateStatus from "./pages/officer/UpdateStatus";

// Citizen Features
import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import ComplaintHistory from "./pages/citizen/ComplaintHistory";
import TrackComplaint from "./pages/citizen/TrackComplaint";
import Feedback from "./pages/citizen/Feedback";

// Admin Features
import AssignWork from "./pages/admin/AssignWork";
import ManageDepartmentsOfficers from "./pages/admin/ManageDepartmentsOfficers";
import Reports from "./pages/admin/Reports";
import Notification from "./pages/admin/Notification"; // Make sure Notification.jsx exists
import AdminFeedback from "./pages/admin/AdminFeedback"; // Make sure AdminFeedback.jsx exists

// Auth & Routing
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import MobileLogin from "./components/auth/MobileLogin";

function App() {
  const userRole = localStorage.getItem("role") || "citizen";

  return (
    <Router>
      <Routes>
        {/* Citizen Features */}
        <Route
          path="/submit-complaint"
          element={
            <PrivateRoute role="citizen" userRole={userRole}>
              <SubmitComplaint />
            </PrivateRoute>
          }
        />
        <Route
          path="/complaint-history"
          element={
            <PrivateRoute role="citizen" userRole={userRole}>
              <ComplaintHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/track-complaint"
          element={
            <PrivateRoute role="citizen" userRole={userRole}>
              <TrackComplaint />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute role="citizen" userRole={userRole}>
              <Feedback />
            </PrivateRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mobile-login" element={<MobileLogin />} />

        {/* Citizen Dashboard */}
        <Route
          path="/citizen/dashboard"
          element={
            <PrivateRoute role="citizen" userRole={userRole}>
              <CitizenDashboard />
            </PrivateRoute>
          }
        />

        {/* Officer Dashboard & Features */}
        <Route
          path="/officer/dashboard"
          element={
            <PrivateRoute role="officer" userRole={userRole}>
              <OfficerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/officer/manage-complaints"
          element={
            <PrivateRoute role="officer" userRole={userRole}>
              <ManageComplaints />
            </PrivateRoute>
          }
        />
        <Route
          path="/officer/update-status/:id"
          element={
            <PrivateRoute role="officer" userRole={userRole}>
              <UpdateStatus />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard & Features */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-departments-officers"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <ManageDepartmentsOfficers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-feedback"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <AdminFeedback />
            </PrivateRoute>
          }
        />
        <Route
          path="/assign-work"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <AssignWork />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <Notification />
            </PrivateRoute>
          }
        />

        {/* Default Redirect */}
        <Route
          path="/"
          element={
            userRole === "admin"
              ? <Navigate to="/admin/dashboard" />
              : userRole === "officer"
              ? <Navigate to="/officer/dashboard" />
              : <Navigate to="/citizen/dashboard" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;