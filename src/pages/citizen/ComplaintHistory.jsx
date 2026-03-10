import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

function ComplaintHistory() {

  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "complaints"));

      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setComplaints(list);

    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0814] text-white p-8">

      <h2 className="text-3xl font-bold text-[#ccff00] mb-8">
        Complaint History
      </h2>

      <div className="bg-[#241835]/70 backdrop-blur-lg border border-[#6f06f9]/40 rounded-xl p-6 shadow-lg overflow-x-auto">

        <table className="w-full text-left">

          <thead>
            <tr className="text-[#ccff00]">
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Description</th>
              <th className="p-3">Image</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>

            {complaints.map((c) => (
              <tr key={c.id} className="border-t border-[#6f06f9]/30">

                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.category}</td>
                <td className="p-3">{c.description}</td>

                <td className="p-3">
                  {c.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt="complaint"
                      className="w-20 rounded"
                    />
                  )}
                </td>

                <td className="p-3">{c.status}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ComplaintHistory;
