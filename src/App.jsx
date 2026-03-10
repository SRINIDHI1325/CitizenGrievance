// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Dashboards
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Citizen Features
import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import ComplaintHistory from "./pages/citizen/ComplaintHistory";
import TrackComplaint from "./pages/citizen/TrackComplaint";
import Feedback from "./pages/citizen/Feedback";

// Officer Features
import ManageComplaints from "./pages/officer/ManageComplaints";
import UpdateStatus from "./pages/officer/UpdateStatus";

// Admin Features
import CreateUser from "./pages/admin/CreateUser";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";


// Private Route
import PrivateRoute from "./routes/PrivateRoute";

function App() {

  // get role from localStorage
  const userRole = localStorage.getItem("role");

  return (
    <Router>
      <Routes>

        {/* Root */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Citizen Dashboard */}
        <Route
          path="/citizen"
          element={
            <PrivateRoute role="citizen" userRole={userRole}>
              <CitizenDashboard />
            </PrivateRoute>
          }
        />

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

        {/* Officer Dashboard */}
        <Route
          path="/officer"
          element={
            <PrivateRoute role="officer" userRole={userRole}>
              <OfficerDashboard />
            </PrivateRoute>
          }
        />

        {/* Officer Features */}
        <Route
          path="/officer/manage-complaints"
          element={
            <PrivateRoute role="officer" userRole={userRole}>
              <ManageComplaints />
            </PrivateRoute>
          }
        />

        <Route
          path="/officer/update-status/:complaintId"
          element={
            <PrivateRoute role="officer" userRole={userRole}>
              <UpdateStatus />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Admin Feature */}
        <Route
          path="/create-user"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <CreateUser />
            </PrivateRoute>
          }
        />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
