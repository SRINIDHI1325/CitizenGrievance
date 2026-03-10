// src/pages/citizen/CitizenDashboard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";

function CitizenDashboard() {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to Login page
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0814] via-[#140a22] to-[#1b0f2e] text-white p-10 relative">

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-[#6f06f9] hover:bg-[#8b2cf5] rounded-full text-white font-semibold shadow-lg"
      >
        Logout
      </button>

      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-[#ccff00] mb-3">Citizen Portal</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Help improve your city by reporting issues, tracking complaints, and viewing your past reports in one place.
        </p>
      </div>

      {/* Main Action Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">

        {/* Submit Complaint */}
        <Link
          to="/submit-complaint"
          className="group w-full max-w-xs text-center bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-10 shadow-lg hover:shadow-purple-700/40 transition duration-300 hover:scale-110"
        >
          <div className="text-6xl mb-4">📢</div>
          <h3 className="text-3xl font-semibold mb-2 group-hover:text-[#ccff00]">Submit Complaint</h3>
          <p className="text-gray-400 text-base">
            Report civic issues like roads, electricity, water problems, and sanitation.
          </p>
        </Link>

        {/* Complaint History */}
        <Link
          to="/complaint-history"
          className="group w-full max-w-xs text-center bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-10 shadow-lg hover:shadow-purple-700/40 transition duration-300 hover:scale-110"
        >
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-3xl font-semibold mb-2 group-hover:text-[#ccff00]">Complaint History</h3>
          <p className="text-gray-400 text-base">
            View all complaints you previously submitted and check their progress.
          </p>
        </Link>

        {/* Track Complaint */}
        <Link
          to="/track-complaint"
          className="group w-full max-w-xs text-center bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-10 shadow-lg hover:shadow-purple-700/40 transition duration-300 hover:scale-110"
        >
          <div className="text-6xl mb-4">📍</div>
          <h3 className="text-3xl font-semibold mb-2 group-hover:text-[#ccff00]">Track Complaint</h3>
          <p className="text-gray-400 text-base">
            Monitor the progress of your complaint and see updates from authorities.
          </p>
        </Link>

        {/* Feedback */}
        <Link
          to="/feedback"
          className="group w-full max-w-xs text-center bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-10 shadow-lg hover:shadow-purple-700/40 transition duration-300 hover:scale-110"
        >
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-3xl font-semibold mb-2 group-hover:text-[#ccff00]">Give Feedback</h3>
          <p className="text-gray-400 text-base">
            Share your suggestions and help us improve city services.
          </p>
        </Link>

      </div>

      {/* Bottom Info Section */}
      <div className="mt-20 grid md:grid-cols-2 gap-8">
        <div className="bg-[#241835]/60 border border-purple-600/30 rounded-xl p-6 backdrop-blur-lg text-center">
          <h3 className="text-2xl font-semibold mb-2 text-[#ccff00]">Why report issues?</h3>
          <p className="text-gray-400 text-base">
            Reporting problems helps local authorities fix issues faster
            and improves the quality of life in your community.
          </p>
        </div>

        <div className="bg-[#241835]/60 border border-purple-600/30 rounded-xl p-6 backdrop-blur-lg text-center">
          <h3 className="text-2xl font-semibold mb-2 text-[#ccff00]">Your participation matters</h3>
          <p className="text-gray-400 text-base">
            Every complaint submitted contributes to building
            a better and smarter city for everyone.
          </p>
        </div>
      </div>

    </div>
  );
}

export default CitizenDashboard;
