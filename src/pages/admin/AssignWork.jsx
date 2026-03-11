import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

import { FaSearch } from "react-icons/fa";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* FIX LEAFLET DEFAULT ICON */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const marker = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function AssignWork() {

  const [address, setAddress] = useState("Loading address...");
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");

  const [assignmentInfo, setAssignmentInfo] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchComplaints();
    fetchDepartments();
    fetchOfficers();
  }, []);

  /* FETCH COMPLAINTS */

  const fetchComplaints = async () => {

    try {

      const snapshot = await getDocs(collection(db, "complaints"));

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setComplaints(list);

    } catch (err) {
      console.log(err);
    }

  };

  /* FETCH DEPARTMENTS */

  const fetchDepartments = async () => {

    try {

      const snapshot = await getDocs(collection(db, "departments"));

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setDepartments(list);

    } catch (err) {
      console.log(err);
    }

  };

  /* FETCH OFFICERS */

  const fetchOfficers = async () => {

    try {

      const snapshot = await getDocs(collection(db, "officers"));

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setOfficers(list);

    } catch (err) {
      console.log(err);
    }

  };

  /* FETCH ADDRESS */

  const fetchAddress = async (lat, lon) => {

    try {

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          headers: {
            "User-Agent": "citizen-grievance-app"
          }
        }
      );

      const data = await res.json();

      setAddress(data.display_name || "Address not found");

    } catch (err) {

      console.log(err);
      setAddress("Unable to fetch address");

    }

  };

  /* OPEN COMPLAINT */

  const openComplaint = async (complaint) => {

    if (complaint.location) {

      fetchAddress(
        complaint.location.latitude,
        complaint.location.longitude
      );

    } else {

      setAddress("Location not available");

    }

    setSelectedComplaint(complaint);

    if (
      complaint.status === "Assigned" ||
      complaint.status === "In Progress" ||
      complaint.status === "Resolved"
    ) {

      const snapshot = await getDocs(collection(db, "assignments"));

      const assignment = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .find((a) => a.complaintId === complaint.id);

      setAssignmentInfo(assignment);

    } else {

      setAssignmentInfo(null);

    }

  };

  /* SEARCH FILTER */

  const filteredComplaints = complaints.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  /* FILTER OFFICERS */

  const filteredOfficers = officers.filter(
    (o) => o.departmentName === selectedDepartment
  );

  /* ASSIGN COMPLAINT */

  const assignComplaint = async () => {

    if (!selectedOfficer) {
      alert("Please select an officer");
      return;
    }

    const officer = officers.find((o) => o.id === selectedOfficer);

    try {

      await addDoc(collection(db, "assignments"), {
        complaintId: selectedComplaint.id,
        complaintTitle: selectedComplaint.title,
        officerId: officer.id,
        officerName: officer.name,
        department: officer.departmentName,
        status: "Assigned",
        assignedAt: serverTimestamp()
      });

      await updateDoc(doc(db, "complaints", selectedComplaint.id), {
        status: "Assigned"
      });

      alert("Complaint assigned successfully");

      setSelectedComplaint(null);
      setSelectedDepartment("");
      setSelectedOfficer("");

      fetchComplaints();

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="space-y-8">

      <h2 className="text-2xl font-bold text-white">
        Assign Complaints
      </h2>

      {/* SEARCH */}

      <div className="relative w-80">

        <FaSearch className="absolute top-3 left-3 text-gray-400" />

        <input
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#140a22] text-white border border-purple-500/30 p-3 pl-9 rounded-lg w-full"
        />

      </div>

      {/* COMPLAINT GRID */}

      <div className="grid md:grid-cols-3 gap-6">

        {filteredComplaints.map((c) => (

          <div
            key={c.id}
            onClick={() => openComplaint(c)}
            className="bg-[#1b0f2e] border border-purple-600/30 p-5 rounded-xl cursor-pointer hover:border-purple-500"
          >

            <h3 className="text-white font-semibold">{c.title}</h3>

            <p className="text-gray-400 text-sm mt-1">
              Category: {c.category}
            </p>

            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
              {c.description}
            </p>

            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded mt-3 inline-block">
              {c.status}
            </span>

          </div>

        ))}

      </div>

      {/* MODAL */}

      {selectedComplaint && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl w-[700px] max-h-[85vh] overflow-y-auto text-white">

            <button
              onClick={() => setSelectedComplaint(null)}
              className="bg-red-600 px-3 py-1 rounded float-right"
            >
              Close
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selectedComplaint.title}
            </h2>

            <p className="text-gray-400">
              <b>Category:</b> {selectedComplaint.category}
            </p>

            <p className="text-gray-400 mb-3">
              <b>Description:</b> {selectedComplaint.description}
            </p>

            {selectedComplaint.imageUrl && (

              <img
                src={selectedComplaint.imageUrl}
                alt="complaint"
                className="rounded-lg mb-3"
              />

            )}

            <p className="text-gray-400">
              <b>Address:</b> {address}
            </p>

            {/* MAP */}

            {selectedComplaint.location && (

              <MapContainer
                center={[
                  Number(selectedComplaint.location.latitude),
                  Number(selectedComplaint.location.longitude)
                ]}
                zoom={15}
                style={{ height: "300px", width: "100%" }}
                className="rounded-lg mt-3"
              >

                <TileLayer
                  attribution="© OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[
                    Number(selectedComplaint.location.latitude),
                    Number(selectedComplaint.location.longitude)
                  ]}
                  icon={marker}
                >

                  <Popup>{selectedComplaint.title}</Popup>

                </Marker>

              </MapContainer>

            )}

            {/* ASSIGN */}

            {selectedComplaint.status === "Submitted" ? (

              <>

                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg mt-4 w-full"
                >

                  <option value="">Select Department</option>

                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}

                </select>

                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg mt-3 w-full"
                >

                  <option value="">Select Officer</option>

                  {filteredOfficers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}

                </select>

                <button
                  onClick={assignComplaint}
                  className="bg-[#6f06f9] px-6 py-2 rounded-lg hover:bg-[#8b2cf5] mt-4 w-full"
                >
                  Assign Work
                </button>

              </>

            ) : (

              <>

                <p className="mt-4 text-gray-300">
                  <b>Assigned Department:</b> {assignmentInfo?.department}
                </p>

                <p className="text-gray-300">
                  <b>Assigned Officer:</b> {assignmentInfo?.officerName}
                </p>

                <button className="bg-gray-600 px-6 py-2 rounded-lg mt-3 w-full">
                  Assigned
                </button>

              </>

            )}

          </div>

        </div>

      )}

    </div>

  );

}

export default AssignWork;