import React, { useState } from "react";
import firebaseApp from "../../firebase/firebase";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const db = getFirestore(firebaseApp);

function Feedback() {

  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !department || !message) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "feedback"), {
        email: email,
        department: department,
        message: message,
        createdAt: serverTimestamp()
      });

      alert("Feedback submitted successfully!");

      setEmail("");
      setDepartment("");
      setMessage("");

    } catch (error) {
      console.error(error);
      alert("Error submitting feedback");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0814] p-6">

      <div className="bg-[#241835] border border-purple-500 rounded-xl p-8 w-full max-w-lg">

        <h2 className="text-3xl font-bold text-[#ccff00] mb-6 text-center">
          Give Feedback
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[#1a1126] text-white border border-purple-400 focus:outline-none"
          />

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-3 rounded bg-[#1a1126] text-white border border-purple-400"
          >
            <option value="">Select Department</option>
            <option>Road & Infrastructure</option>
            <option>Water Supply</option>
            <option>Electricity</option>
            <option>Waste Management</option>
            <option>Public Safety</option>
            <option>Other Civic Issues</option>
          </select>

          {/* Feedback Message */}
          <textarea
            rows="5"
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded bg-[#1a1126] text-white border border-purple-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Feedback;
