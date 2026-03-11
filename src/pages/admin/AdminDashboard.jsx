// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaTasks, FaChartBar, FaSignOutAlt } from "react-icons/fa";

// Placeholder components for each tab
function ManageDepartmentsOfficers() {
  return (
    <div>
      <h3>Manage Departments & Officers</h3>
      <p>Here you can add, edit, or remove departments and officers.</p>
    </div>
  );
}

function AssignWork() {
  return (
    <div>
      <h3>Assign Work</h3>
      <p>Here you can assign complaints or tasks to officers.</p>
    </div>
  );
}

function Reports() {
  return (
    <div>
      <h3>Reports</h3>
      <p>View complaint statistics and performance reports here.</p>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("departments");

  // Render the tab content
  const renderContent = () => {
    switch (activeTab) {
      case "departments":
        return <ManageDepartmentsOfficers />;
      case "assign":
        return <AssignWork />;
      case "reports":
        return <Reports />;
      default:
        return <ManageDepartmentsOfficers />;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("userRole"); // remove role from storage
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

        <button
          onClick={() => setActiveTab("departments")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: activeTab === "departments" ? "#374151" : "transparent",
            border: "none",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <FaBuilding /> Manage Departments & Officers
        </button>

        <button
          onClick={() => setActiveTab("assign")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: activeTab === "assign" ? "#374151" : "transparent",
            border: "none",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <FaTasks /> Assign Work
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: activeTab === "reports" ? "#374151" : "transparent",
            border: "none",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <FaChartBar /> Reports
        </button>

        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "transparent",
            border: "none",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;