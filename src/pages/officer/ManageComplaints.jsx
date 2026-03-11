// src/pages/officer/ManageComplaints.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "complaints"),
            where("assignedTo", "==", user.uid)
          );
          const snapshot = await getDocs(q);
          setComplaints(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          console.error("Error fetching complaints:", error);
        }
      } else {
        setComplaints([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const openMap = (location) => {
    if (!location) return;
    const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0d0814] text-white p-10">
      <h2 className="text-3xl font-bold text-[#CCFF00] mb-6">Manage Complaints</h2>

      {complaints.length === 0 ? (
        <p>No complaints assigned to you yet.</p>
      ) : (
        <table className="w-full bg-[#241835] border border-purple-600">
          <thead>
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Location</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c.id}>
                <td className="p-4">{c.title}</td>
                <td className="p-4">{c.category}</td>
                <td className={`p-4 ${
                  c.status === "Resolved"
                    ? "text-green-400"
                    : c.status === "In Progress"
                    ? "text-blue-400"
                    : "text-yellow-400"
                }`}>
                  {c.status}
                </td>
                <td className="p-4">
                  {c.location ? (
                    <button
                      onClick={() => openMap(c.location)}
                      className="bg-blue-600 px-3 py-1 rounded"
                    >
                      View Map
                    </button>
                  ) : "No Location"}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => navigate(`/officer/update-status/${c.id}`)}
                    className="bg-purple-600 px-3 py-1 rounded"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageComplaints;