// src/pages/officer/ManageComplaints.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function ManageComplaints({ officerId }) {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      const q = query(collection(db, "complaints"), where("assignedTo", "==", officerId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(data);
    };

    fetchComplaints();
  }, [officerId]);

  const openMap = (location) => {
    const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    window.open(url, "_blank");
  };

  const goToUpdateStatus = (id) => {
    navigate(`/officer/update-status/${id}`);
  };

  return (
    <div>
      <h2>Manage Complaints</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(c => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td>{c.category}</td>
              <td>{c.status}</td>
              <td>
                {c.location ? (
                  <button onClick={() => openMap(c.location)}>View Location</button>
                ) : "No Location"}
              </td>
              <td>
                <button onClick={() => goToUpdateStatus(c.id)}>Update Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageComplaints;