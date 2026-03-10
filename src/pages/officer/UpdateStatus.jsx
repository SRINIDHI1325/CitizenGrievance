import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";

function UpdateStatus() {

  const { complaintId } = useParams();

  const navigate = useNavigate();

  const [status, setStatus] = useState("");

  const [remark, setRemark] = useState("");

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

    if (!status) return alert("Select status");

    const docRef = doc(db, "complaints", complaintId);

    await updateDoc(docRef, {
      status,
      remarks: remark ? arrayUnion(remark) : []
    });

    alert("Status updated successfully");

    navigate("/officer/manage-complaints");

  };

  if (!complaint) return <p>Loading...</p>;

  return (

    <div className="min-h-screen bg-[#0d0814] text-white flex justify-center items-center">

      <div className="bg-[#241835] p-8 rounded-lg border border-purple-600 w-96">

        <h2 className="text-2xl font-bold text-[#ccff00] mb-4">
          Update Status
        </h2>

        <p className="mb-4">{complaint.title}</p>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 bg-[#1a1126] rounded mb-4"
        >

          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>

        </select>

        <textarea
          placeholder="Add remark (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="w-full p-2 bg-[#1a1126] rounded mb-4"
        />

        <button
          onClick={handleUpdate}
          className="w-full py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          Update Status
        </button>

      </div>

    </div>
  );
}

export default UpdateStatus;
