// src/pages/officer/OfficerDashboard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function OfficerDashboard({ officerId }) {
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const q = query(collection(db, "complaints"), where("assignedTo", "==", officerId));
      const snapshot = await getDocs(q);
      const data = { pending: 0, inProgress: 0, resolved: 0 };

      snapshot.forEach(doc => {
        const status = doc.data().status;
        if (status === "Pending") data.pending++;
        else if (status === "In Progress") data.inProgress++;
        else if (status === "Resolved") data.resolved++;
      });

      setStats(data);
    };

    fetchStats();
  }, [officerId]);

  return (
    <div>
      <h2>Welcome Officer</h2>
      <div>
        <p>Pending Complaints: {stats.pending}</p>
        <p>In Progress: {stats.inProgress}</p>
        <p>Resolved: {stats.resolved}</p>
      </div>

      <Link to="/officer/manage-complaints">
        <button>Manage Complaints</button>
      </Link>
    </div>
  );
}

export default OfficerDashboard;