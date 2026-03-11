import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import PrivateRoute from "./routes/PrivateRoute";

// Dashboards
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import ComplaintHistory from "./pages/citizen/ComplaintHistory";
import TrackComplaint from "./pages/citizen/TrackComplaint";
import Feedback from "./pages/citizen/Feedback";

// Officer Features
import ManageComplaints from "./pages/officer/ManageComplaints";
import UpdateStatus from "./pages/officer/UpdateStatus";

import PrivateRoute from "./routes/PrivateRoute";
import CreateUser from "./pages/admin/CreateUser";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";



function App() {

  const userRole = "citizen";

  return (
    <Router>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/create-user"
  element={
    <PrivateRoute role="admin" userRole={userRole}>
      <CreateUser currentUserRole={userRole} />
    </PrivateRoute>
  }
/>

        <Route path="/" element={<Navigate to="/citizen" />} />

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

        {/* Officer Dashboard */}
        <Route
          path="/officer"
          element={
            <PrivateRoute role="officer" userRole={userRole}>
              <OfficerDashboard />
            </PrivateRoute>
          }
        />

    {/* Admin Routes */}
    <Route
      path="/admin"
      element={
        <PrivateRoute
          role="admin"
          userRole={localStorage.getItem("userRole")}
        >
          <AdminDashboard />
        </PrivateRoute>
      }
    />

      </Routes>

    </Router>
  );
}

export default App;
