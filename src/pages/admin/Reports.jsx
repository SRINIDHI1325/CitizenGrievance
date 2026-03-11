import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function Reports() {

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {

    const snapshot = await getDocs(collection(db, "complaints"));

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setComplaints(data);
  };

  /* ================= STATUS DATA ================= */

  const submitted = complaints.filter(c => c.status === "Submitted").length;
  const assigned = complaints.filter(c => c.status === "Assigned").length;
  const progress = complaints.filter(c => c.status === "Ongoing").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  const statusData = [
    { name: "Submitted", value: submitted },
    { name: "Assigned", value: assigned },
    { name: "Ongoing", value: progress },
    { name: "Resolved", value: resolved }
  ];

  /* ================= CATEGORY DATA ================= */

  const categoryMap = {};

  complaints.forEach(c => {
    if (categoryMap[c.category]) {
      categoryMap[c.category] += 1;
    } else {
      categoryMap[c.category] = 1;
    }
  });

  const categoryData = Object.keys(categoryMap).map(key => ({
    category: key,
    complaints: categoryMap[key]
  }));

  const COLORS = ["#f59e0b", "#2563eb", "#8b5cf6", "#10b981"];

  return (

    <div className="space-y-8">

      <h2 className="text-2xl font-bold text-white">
        Reports & Analytics
      </h2>

      {/* ================= STATS ================= */}

      <div className="flex flex-wrap gap-6">

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl text-center w-[180px]">
          <h3 className="text-3xl font-bold text-white">{complaints.length}</h3>
          <p className="text-gray-400">Total Complaints</p>
        </div>

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl text-center w-[180px]">
          <h3 className="text-3xl font-bold text-yellow-400">{submitted}</h3>
          <p className="text-gray-400">Submitted</p>
        </div>

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl text-center w-[180px]">
          <h3 className="text-3xl font-bold text-blue-400">{assigned}</h3>
          <p className="text-gray-400">Assigned</p>
        </div>

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl text-center w-[180px]">
          <h3 className="text-3xl font-bold text-purple-400">{progress}</h3>
          <p className="text-gray-400">Ongoing</p>
        </div>

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl text-center w-[180px]">
          <h3 className="text-3xl font-bold text-green-400">{resolved}</h3>
          <p className="text-gray-400">Resolved</p>
        </div>

      </div>

      {/* ================= CHARTS ================= */}

      <div className="flex flex-wrap gap-8">

        {/* PIE CHART */}

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl">

          <h3 className="text-lg font-semibold text-white mb-4">
            Complaint Status Distribution
          </h3>

          <PieChart width={350} height={300}>

            <Pie
              data={statusData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >

              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </div>

        {/* BAR CHART */}

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl">

          <h3 className="text-lg font-semibold text-white mb-6">
            Complaints by Category
          </h3>

          <BarChart
            width={650}
            height={320}
            data={categoryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >

            <CartesianGrid strokeDasharray="3 3" stroke="#444" />

            <XAxis
              dataKey="category"
              angle={-30}
              textAnchor="end"
              interval={0}
              stroke="#ccc"
            />

            <YAxis stroke="#ccc" />

            <Tooltip />

            <Bar
              dataKey="complaints"
              fill="#8b5cf6"
              radius={[4,4,0,0]}
            />

          </BarChart>

          <div className="flex justify-center items-center gap-2 mt-4 text-gray-300">
            <span className="w-3 h-3 bg-purple-500 rounded"></span>
            complaints
          </div>

        </div>

      </div>

    </div>

  );

}

export default Reports;