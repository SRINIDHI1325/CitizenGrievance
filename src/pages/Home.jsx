// src/pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Shield, Settings, MapPin, FileText, CheckCircle } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role, path) => {
    localStorage.setItem("role", role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0814] via-[#140B1F] to-[#1E0F2F] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 backdrop-blur-md bg-white/5 border-b border-white/10">
        <h1 className="text-2xl font-bold text-[#CCFF00]">CivicConnect</h1>

        <div className="flex gap-6">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      <section className="text-center py-20">
        <h1 className="text-5xl font-bold">
          Smart Citizen Grievance Management Portal
        </h1>
      </section>
    </div>
  );
};

export default Home;