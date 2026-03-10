import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import ComplaintHistory from "./pages/citizen/ComplaintHistory";
import TrackComplaint from "./pages/citizen/TrackComplaint";

import PrivateRoute from "./routes/PrivateRoute";
import CreateUser from "./pages/admin/CreateUser";

function App() {

  const userRole = "citizen";

  return (
    <Router>

      <Routes>
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

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;