import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function ManageComplaints({ officerId }) {

  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchComplaints = async () => {

      const q = query(
        collection(db, "complaints"),
        where("assignedTo", "==", officerId)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

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

    <div className="min-h-screen bg-[#0d0814] text-white p-10">

      <h2 className="text-3xl font-bold text-[#ccff00] mb-6">
        Manage Complaints
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full bg-[#241835] border border-purple-600 rounded-lg">

          <thead>

            <tr className="text-left border-b border-purple-600">

              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Location</th>
              <th className="p-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {complaints.map(c => (

              <tr key={c.id} className="border-b border-purple-800">

                <td className="p-4">{c.title}</td>

                <td className="p-4">{c.category}</td>

                <td className="p-4 text-yellow-400">{c.status}</td>

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
                    onClick={() => goToUpdateStatus(c.id)}
                    className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-700"
                  >
                    Update Status
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ManageComplaints;
