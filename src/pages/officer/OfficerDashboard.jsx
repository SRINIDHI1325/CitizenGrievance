// src/pages/officer/OfficerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

function OfficerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Real-time complaints fetch
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, "complaints"), where("assignedTo", "==", user.uid));
        const unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setComplaints(data);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching complaints:", error);
            setLoading(false);
          }
        );
        return () => unsubscribeSnapshot();
      } else {
        setComplaints([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) return <p className="text-white p-10">Loading complaints...</p>;

  // Stats
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const progress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("role");      // Optional: clear role
      localStorage.removeItem("officerId"); // Optional: clear officerId
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0814] text-white p-10">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#CCFF00]">Officer Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div
          className="bg-[#241835] p-6 rounded-lg text-center cursor-pointer"
          onClick={() => navigate("/officer/manage-complaints")}
        >
          <h3 className="text-lg">Total Complaints</h3>
          <p className="text-3xl font-bold text-[#CCFF00]">{complaints.length}</p>
        </div>

        <div
          className="bg-[#241835] p-6 rounded-lg text-center cursor-pointer"
          onClick={() => navigate("/officer/manage-complaints")}
        >
          <h3 className="text-lg">Pending</h3>
          <p className="text-3xl font-bold text-yellow-400">{pending}</p>
        </div>

        <div
          className="bg-[#241835] p-6 rounded-lg text-center cursor-pointer"
          onClick={() => navigate("/officer/manage-complaints")}
        >
          <h3 className="text-lg">In Progress</h3>
          <p className="text-3xl font-bold text-blue-400">{progress}</p>
        </div>

        <div
          className="bg-[#241835] p-6 rounded-lg text-center cursor-pointer"
          onClick={() => navigate("/officer/manage-complaints")}
        >
          <h3 className="text-lg">Resolved</h3>
          <p className="text-3xl font-bold text-green-400">{resolved}</p>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-[#241835] p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Complaints</h2>
          <button
            onClick={() => navigate("/officer/manage-complaints")}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            Manage All
          </button>
        </div>

        {complaints.length === 0 ? (
          <p>No complaints assigned to you yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-purple-600">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.slice(0, 5).map((c) => (
                <tr key={c.id} className="border-b border-purple-800">
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3">
                    <span
                      className={
                        c.status === "Resolved"
                          ? "text-green-400"
                          : c.status === "In Progress"
                          ? "text-blue-400"
                          : "text-yellow-400"
                      }
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/officer/update-status/${c.id}`)}
                      className="bg-purple-600 px-3 py-1 rounded"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OfficerDashboard;