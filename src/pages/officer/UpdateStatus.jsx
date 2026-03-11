// src/pages/officer/UpdateStatus.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function UpdateStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Pending");

  // Fetch current complaint status
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const complaintRef = doc(db, "complaints", id);
        const docSnap = await getDoc(complaintRef);
        if (docSnap.exists()) {
          setStatus(docSnap.data().status);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchComplaint();
  }, [id]);

  const updateStatus = async () => {
    try {
      const complaintRef = doc(db, "complaints", id);
      await updateDoc(complaintRef, { status });
      alert("Status Updated Successfully");
      navigate("/officer/manage-complaints"); // redirect to complaints list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0814] text-white">
      <div className="bg-[#241835] p-8 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Complaint Status</h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 mb-4 bg-black text-white"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <button
          onClick={updateStatus}
          className="bg-purple-600 w-full p-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default UpdateStatus;