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
    <div>
      <h2>Complaint History</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Description</th>
            <th>Image</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td>{c.category}</td>
              <td>{c.description}</td>

              <td>
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt="complaint"
                    width="80"
                  />
                )}
              </td>

              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default ComplaintHistory;