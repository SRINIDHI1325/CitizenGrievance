import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FaBell } from "react-icons/fa";

function Notification() {

  const [notification, setNotification] = useState([]);

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {

    const q = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setNotification(list);
  };

  return (

    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-white">
        Notifications
      </h2>

      {notification.length === 0 ? (

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl text-gray-400 text-center">
          No notifications
        </div>

      ) : (

        <div className="space-y-4">

          {notification.map((n) => (

            <div
              key={n.id}
              className="flex gap-4 items-center bg-[#1b0f2e] border border-purple-600/30 p-4 rounded-xl hover:border-purple-500 transition"
            >

              <FaBell className="text-purple-400 text-xl"/>

              <div>

                <b className="text-white">
                  New Complaint Raised
                </b>

                <p className="text-gray-400 text-sm">
                  Category: {n.category}
                </p>

                <p className="text-gray-400 text-sm">
                  Status: {n.status}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default Notification;