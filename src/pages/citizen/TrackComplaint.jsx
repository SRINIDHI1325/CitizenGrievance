import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

function TrackComplaint() {

  const [complaints, setComplaints] = useState([]);

  const steps = ["Submitted", "Assigned", "In Progress", "Resolved"];

  const fetchComplaints = async () => {

    const querySnapshot = await getDocs(collection(db, "complaints"));

    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setComplaints(list);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0814] text-white p-8">

      <h2 className="text-3xl font-bold text-[#ccff00] mb-8">
        Track Complaints
      </h2>

      {complaints.map((c) => {

        const currentStep = steps.indexOf(c.status);

        return (

          <div
            key={c.id}
            className="bg-[#241835]/70 backdrop-blur-lg border border-[#6f06f9]/40 rounded-xl p-6 shadow-lg mb-6"
          >

            <h3 className="text-xl font-semibold mb-2">{c.title}</h3>

            <p className="text-gray-400 mb-4">{c.description}</p>

            <div className="flex gap-6">

              {steps.map((step, index) => (

                <div key={index} className="text-center">

                  <div
                    className={`w-8 h-8 rounded-full mx-auto ${
                      index <= currentStep
                        ? "bg-green-500"
                        : "bg-gray-600"
                    }`}
                  />

                  <p className="text-sm mt-1">{step}</p>

                </div>

              ))}

            </div>

          </div>

        );

      })}

    </div>
  );
}

export default TrackComplaint;
