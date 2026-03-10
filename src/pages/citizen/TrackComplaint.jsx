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
    <div>

      <h2>Track Complaints</h2>

      {complaints.map((c) => {

        const currentStep = steps.indexOf(c.status);

        return (
          <div key={c.id} style={{border:"1px solid gray", padding:"15px", marginBottom:"20px"}}>

            <h3>{c.title}</h3>
            <p>{c.description}</p>

            <div style={{display:"flex", gap:"20px"}}>

              {steps.map((step, index) => (

                <div key={index}>

                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: index <= currentStep ? "green" : "gray"
                    }}
                  />

                  <p>{step}</p>

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