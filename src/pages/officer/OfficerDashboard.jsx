import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function OfficerDashboard({ officerId }) {

  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {

    const fetchStats = async () => {

      const q = query(
        collection(db, "complaints"),
        where("assignedTo", "==", officerId)
      );

      const snapshot = await getDocs(q);

      const data = {
        pending: 0,
        inProgress: 0,
        resolved: 0
      };

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

    <div className="min-h-screen bg-[#0d0814] text-white p-10">

      <h2 className="text-4xl font-bold text-[#ccff00] mb-10">
        Officer Dashboard
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mb-10">

        <div className="bg-[#241835] p-6 rounded-lg border border-purple-600">
          <h3 className="text-xl font-semibold">Pending</h3>
          <p className="text-3xl mt-2 text-yellow-400">{stats.pending}</p>
        </div>

        <div className="bg-[#241835] p-6 rounded-lg border border-purple-600">
          <h3 className="text-xl font-semibold">In Progress</h3>
          <p className="text-3xl mt-2 text-blue-400">{stats.inProgress}</p>
        </div>

        <div className="bg-[#241835] p-6 rounded-lg border border-purple-600">
          <h3 className="text-xl font-semibold">Resolved</h3>
          <p className="text-3xl mt-2 text-green-400">{stats.resolved}</p>
        </div>

      </div>

      <Link to="/officer/manage-complaints">

        <button className="px-6 py-3 bg-purple-600 rounded hover:bg-purple-700">
          Manage Complaints
        </button>

      </Link>

    </div>
  );
}

export default OfficerDashboard;
