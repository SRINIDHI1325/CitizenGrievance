import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Feedback() {

  const [feedbacks, setFeedbacks] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  /* ================= FETCH FEEDBACK ================= */

  const fetchFeedback = async () => {

    const snapshot = await getDocs(collection(db, "feedback"));

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setFeedbacks(list);

    processChartData(list);

  };

  /* ================= SENTIMENT CHECK ================= */

  const isPositive = (message) => {

    const positiveWords = [
      "good",
      "great",
      "thank",
      "excellent",
      "nice",
      "happy",
      "resolved",
      "fast"
    ];

    message = message.toLowerCase();

    return positiveWords.some((word) => message.includes(word));
  };

  /* ================= CREATE GRAPH DATA ================= */

  const processChartData = (data) => {

    const deptStats = {};

    data.forEach((f) => {

      const dept = f.department || "Unknown";

      if (!deptStats[dept]) {
        deptStats[dept] = { department: dept, positive: 0, negative: 0 };
      }

      if (isPositive(f.message)) {
        deptStats[dept].positive += 1;
      } else {
        deptStats[dept].negative += 1;
      }

    });

    setChartData(Object.values(deptStats));

  };

  return (

    <div style={{ padding: "25px", color: "#e5e7eb" }}>

      <h1 style={{ color: "#ccff00" }}><b>Citizen Feedback Dashboard</b></h1>

      {/* ================= GRAPH ================= */}

      <div style={chartContainer}>

        <h2 style={{ marginBottom: "15px", color: "#f9fafb" }}>
          Department-wise Feedback Analysis
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" stroke="#444" />

            <XAxis
              dataKey="department"
              stroke="#ddd"
            />

            <YAxis stroke="#ddd" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1f1b2e",
                border: "none",
                color: "#fff"
              }}
            />

            <Legend />

            <Bar dataKey="positive" fill="#10b981" name="Positive" />

            <Bar dataKey="negative" fill="#ef4444" name="Negative" />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ================= FEEDBACK LIST ================= */}

      <h2 style={{ marginTop: "40px", color: "#ccff00" }}>
        Citizen Messages
      </h2>

      <div style={grid}>

        {feedbacks.map((f) => (

          <div key={f.id} style={card}>

            <p><b>Department:</b> {f.department}</p>

            <p><b>Email:</b> {f.email}</p>

            <p><b>Message:</b></p>

            <p style={{ color: "#cbd5e1" }}>{f.message}</p>

            <p style={dateText}>
              {f.createdat?.toDate().toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}

/* ================= STYLES ================= */

const chartContainer = {
  background: "#241835",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid rgba(147,51,234,0.3)",
  boxShadow: "0 6px 18px rgba(0,0,0,0.4)"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
  gap: "20px",
  marginTop: "20px"
};

const card = {
  background: "#241835",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid rgba(147,51,234,0.3)",
  boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
  color: "#e5e7eb"
};

const dateText = {
  marginTop: "10px",
  fontSize: "12px",
  color: "#9ca3af"
};

export default Feedback;