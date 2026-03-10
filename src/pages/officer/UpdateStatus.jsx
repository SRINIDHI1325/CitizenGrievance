// src/pages/officer/UpdateStatus.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";

function UpdateStatus() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      const docRef = doc(db, "complaints", complaintId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setComplaint(snapshot.data());
        setStatus(snapshot.data().status);
      }
    };

    fetchComplaint();
  }, [complaintId]);

  const handleUpdate = async () => {
    if (!status) return alert("Please select status");

    const docRef = doc(db, "complaints", complaintId);
    await updateDoc(docRef, { status });
    alert("Status updated successfully");
    navigate("/officer/manage-complaints");
  };

  if (!complaint) return <p>Loading...</p>;

  return (
    <div>
      <h2>Update Status: {complaint.title}</h2>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>
      <br /><br />
      <button onClick={handleUpdate}>Update Status</button>
    </div>
  );
}

export default UpdateStatus;