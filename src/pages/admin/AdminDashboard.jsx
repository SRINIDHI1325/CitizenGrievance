// src/pages/admin/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import {
  FaBuilding,
  FaTasks,
  FaChartBar,
  FaSignOutAlt,
  FaBell,
  FaComments
} from "react-icons/fa";

import ManageDepartmentsOfficers from "./ManageDepartmentsOfficers";
import AssignWork from "./AssignWork";
import Reports from "./Reports";
import Notification from "./Notification";
import Feedback from "./AdminFeedback";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("departments");

  const renderContent = () => {
    switch (activeTab) {
      case "departments":
        return <ManageDepartmentsOfficers />;
      case "assign":
        return <AssignWork />;
      case "reports":
        return <Reports />;
      case "notification":
        return <Notification />;
      case "feedback":
        return <Feedback />;
      default:
        return <ManageDepartmentsOfficers />;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0d0814] via-[#140a22] to-[#1b0f2e] text-white">

      {/* ================= SIDEBAR ================= */}
      <div className="w-72 h-screen fixed left-0 top-0 p-6 flex flex-col bg-[#241835]/95 backdrop-blur-xl border-r border-purple-600/30">

        <h2 className="text-3xl font-bold text-[#ccff00] mb-10">
          Admin Dashboard
        </h2>

        <div className="flex flex-col gap-3">

          <button
            onClick={() => setActiveTab("departments")}
            className={`flex items-center gap-3 p-4 rounded-xl transition ${
              activeTab === "departments"
                ? "bg-[#3e1a5f]"
                : "hover:bg-[#3e1a5f]/70"
            }`}
          >
            <FaBuilding /> Manage Departments
          </button>

          <button
            onClick={() => setActiveTab("assign")}
            className={`flex items-center gap-3 p-4 rounded-xl transition ${
              activeTab === "assign"
                ? "bg-[#3e1a5f]"
                : "hover:bg-[#3e1a5f]/70"
            }`}
          >
            <FaTasks /> Assign Work
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-3 p-4 rounded-xl transition ${
              activeTab === "reports"
                ? "bg-[#3e1a5f]"
                : "hover:bg-[#3e1a5f]/70"
            }`}
          >
            <FaChartBar /> Reports
          </button>

          <button
            onClick={() => setActiveTab("notification")}
            className={`flex items-center gap-3 p-4 rounded-xl transition ${
              activeTab === "notification"
                ? "bg-[#3e1a5f]"
                : "hover:bg-[#3e1a5f]/70"
            }`}
          >
            <FaBell /> Notifications
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex items-center gap-3 p-4 rounded-xl transition ${
              activeTab === "feedback"
                ? "bg-[#3e1a5f]"
                : "hover:bg-[#3e1a5f]/70"
            }`}
          >
            <FaComments /> Feedback
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-3 p-4 mt-6 bg-[#6f06f9] rounded-xl hover:bg-[#8b2cf5] transition"
          >
            <FaSignOutAlt /> Logout
          </button>

        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 ml-72 p-10 overflow-auto">

        {/* DASHBOARD CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div
            onClick={() => setActiveTab("departments")}
            className={`cursor-pointer group bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8 shadow-lg transition transform hover:scale-105 ${
              activeTab === "departments" ? "shadow-purple-700/50" : ""
            }`}
          >
            <div className="text-5xl mb-3 text-purple-400">
              <FaBuilding />
            </div>

            <h3 className="text-2xl font-semibold group-hover:text-[#ccff00]">
              Manage Departments
            </h3>
          </div>

          <div
            onClick={() => setActiveTab("assign")}
            className={`cursor-pointer group bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8 shadow-lg transition transform hover:scale-105 ${
              activeTab === "assign" ? "shadow-purple-700/50" : ""
            }`}
          >
            <div className="text-5xl mb-3 text-purple-400">
              <FaTasks />
            </div>

            <h3 className="text-2xl font-semibold group-hover:text-[#ccff00]">
              Assign Work
            </h3>
          </div>

          <div
            onClick={() => setActiveTab("reports")}
            className={`cursor-pointer group bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8 shadow-lg transition transform hover:scale-105 ${
              activeTab === "reports" ? "shadow-purple-700/50" : ""
            }`}
          >
            <div className="text-5xl mb-3 text-purple-400">
              <FaChartBar />
            </div>

            <h3 className="text-2xl font-semibold group-hover:text-[#ccff00]">
              Reports
            </h3>
          </div>

          <div
            onClick={() => setActiveTab("notification")}
            className={`cursor-pointer group bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8 shadow-lg transition transform hover:scale-105 ${
              activeTab === "notification" ? "shadow-purple-700/50" : ""
            }`}
          >
            <div className="text-5xl mb-3 text-purple-400">
              <FaBell />
            </div>

            <h3 className="text-2xl font-semibold group-hover:text-[#ccff00]">
              Notifications
            </h3>
          </div>

          <div
            onClick={() => setActiveTab("feedback")}
            className={`cursor-pointer group bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8 shadow-lg transition transform hover:scale-105 ${
              activeTab === "feedback" ? "shadow-purple-700/50" : ""
            }`}
          >
            <div className="text-5xl mb-3 text-purple-400">
              <FaComments />
            </div>

            <h3 className="text-2xl font-semibold group-hover:text-[#ccff00]">
              Feedback
            </h3>
          </div>

        </div>

        {/* TAB CONTENT WITH GLOBAL DARK THEME */}
        <div
          className="
          mt-10 
          bg-[#241835]/80 
          border border-purple-600/30 
          rounded-2xl 
          p-8 
          shadow-lg 
          text-gray-200

          [&_h1]:text-white
          [&_h2]:text-white
          [&_h3]:text-white
          [&_label]:text-gray-300

          [&_input]:bg-[#1b0f2e]
          [&_input]:text-white
          [&_input]:border-purple-500/30
          [&_input]:placeholder-gray-400
          [&_input]:rounded-lg
          [&_input]:p-3

          [&_textarea]:bg-[#1b0f2e]
          [&_textarea]:text-white
          [&_textarea]:border-purple-500/30
          [&_textarea]:rounded-lg
          [&_textarea]:p-3

          [&_select]:bg-[#1b0f2e]
          [&_select]:text-white
          [&_select]:border-purple-500/30
          [&_select]:rounded-lg
          [&_select]:p-3

          [&_table]:text-gray-200
          [&_th]:text-white
          [&_td]:text-gray-300

          [&_button]:bg-[#6f06f9]
          [&_button]:text-white
          [&_button]:rounded-lg
          [&_button]:hover:bg-[#8b2cf5]
          "
        >
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;