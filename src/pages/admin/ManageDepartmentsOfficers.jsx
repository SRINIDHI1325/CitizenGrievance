
import React, { useState, useEffect } from "react";
import { FaBuilding, FaUser, FaTrash, FaSearch } from "react-icons/fa";
import { db } from "../../firebase/firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

function ManageDepartmentsOfficers() {

  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);

  const [deptName, setDeptName] = useState("");
  const [deptDescription, setDeptDescription] = useState("");

  const [officerName, setOfficerName] = useState("");
  const [officerEmail, setOfficerEmail] = useState("");
  const [officerPhone, setOfficerPhone] = useState("");
  const [officerDepartment, setOfficerDepartment] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");

  const [officerPassword, setOfficerPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchOfficers();
  }, []);

  const fetchDepartments = async () => {
    const snapshot = await getDocs(collection(db, "departments"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setDepartments(list);
  };

  const fetchOfficers = async () => {
    const snapshot = await getDocs(collection(db, "officers"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setOfficers(list);
  };

  const addDepartment = async (e) => {
    e.preventDefault();
    if (!deptName) return;

    await addDoc(collection(db, "departments"), {
      name: deptName,
      description: deptDescription,
      status: "active"
    });

    setDeptName("");
    setDeptDescription("");
    fetchDepartments();
  };

  const deleteDepartment = async (id) => {
    await deleteDoc(doc(db, "departments", id));
    fetchDepartments();
  };

  const addOfficer = async (e) => {
    e.preventDefault();

    if (!officerName || !officerDepartment || !officerEmail) {
      alert("Please fill all fields");
      return;
    }

    if (officerPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await addDoc(collection(db, "officers"), {
      name: officerName,
      email: officerEmail,
      phone: officerPhone,
      departmentName: officerDepartment,
      password: officerPassword,
      status: "active"
    });

    await fetch("http://localhost:5000/send-officer-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: officerName,
        email: officerEmail,
        password: officerPassword
      })
    });

    alert("Officer Added Successfully & Email Sent.!");

    setOfficerName("");
    setOfficerEmail("");
    setOfficerPhone("");
    setOfficerDepartment("");
    setOfficerPassword("");
    setConfirmPassword("");

    fetchOfficers();
  };

  const deleteOfficer = async (id) => {
    await deleteDoc(doc(db, "officers", id));
    fetchOfficers();
  };

  const filteredOfficers = officers.filter((o) => {
    return (
      o.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDept === "" || o.departmentName === filterDept)
    );
  });

  const totalDepartments = departments.length;
  const totalOfficers = officers.length;

  return (

    <div className="space-y-10">

      <h2 className="text-2xl font-bold text-white">
        Manage Departments & Officers
      </h2>

      {/* ===== STATS ===== */}

      <div className="flex gap-6">

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl text-center text-white w-48">
          <FaBuilding size={28} className="mx-auto mb-2 text-purple-400"/>
          <h3 className="text-xl font-bold">{totalDepartments}</h3>
          <p className="text-gray-400">Departments</p>
        </div>

        <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl text-center text-white w-48">
          <FaUser size={28} className="mx-auto mb-2 text-purple-400"/>
          <h3 className="text-xl font-bold">{totalOfficers}</h3>
          <p className="text-gray-400">Officers</p>
        </div>

      </div>

      {/* ===== DEPARTMENTS ===== */}

      <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl">

        <h3 className="text-lg font-semibold text-white mb-4">
          Departments
        </h3>

        <form onSubmit={addDepartment} className="flex flex-col gap-3 mb-6">

          <input
            placeholder="Department Name"
            value={deptName}
            onChange={(e)=>setDeptName(e.target.value)}
            className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg"
          />

          <input
            placeholder="Description"
            value={deptDescription}
            onChange={(e)=>setDeptDescription(e.target.value)}
            className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg"
          />

          <button className="bg-[#6f06f9] px-6 py-2 rounded-lg hover:bg-[#8b2cf5]">
            Add Department
          </button>

        </form>

        <div className="space-y-3">

          {departments.map((dept)=>(

            <div key={dept.id}
              className="flex justify-between items-center bg-[#140a22] p-4 rounded-lg border border-purple-500/20">

              <div>
                <b className="text-white">{dept.name}</b>
                <p className="text-gray-400 text-sm">{dept.description}</p>
              </div>

              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={()=>deleteDepartment(dept.id)}
              />

            </div>

          ))}

        </div>

      </div>

      {/* ===== OFFICERS ===== */}

      <div className="bg-[#1b0f2e] border border-purple-600/30 p-6 rounded-xl">

        <h3 className="text-lg font-semibold text-white mb-4">
          Officers
        </h3>

        <form onSubmit={addOfficer} className="grid md:grid-cols-3 gap-3 mb-6">

          <input placeholder="Officer Name"
            value={officerName}
            onChange={(e)=>setOfficerName(e.target.value)}
            className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg"
          />

          <input placeholder="Email"
            value={officerEmail}
            onChange={(e)=>setOfficerEmail(e.target.value)}
            className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg"
          />

          <input placeholder="Phone"
            value={officerPhone}
            onChange={(e)=>setOfficerPhone(e.target.value)}
            className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg"
          />

          <select
            value={officerDepartment}
            onChange={(e)=>setOfficerDepartment(e.target.value)}
            className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg"
          >
            <option value="">Select Department</option>
            {departments.map((d)=>(
              <option key={d.id}>{d.name}</option>
            ))}
          </select>

          <input type="password" placeholder="Password"
            value={officerPassword}
            onChange={(e)=>setOfficerPassword(e.target.value)}
            className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg"
          />

          <input type="password" placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg"
          />

          <button className="bg-[#6f06f9] px-6 py-2 rounded-lg hover:bg-[#8b2cf5] col-span-3">
            Add Officer
          </button>

        </form>

        {/* SEARCH + FILTER */}

        <div className="flex gap-3 mb-4">

          <div className="relative">

            <FaSearch className="absolute top-3 left-3 text-gray-400"/>

            <input
              placeholder="Search officer..."
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
              className="bg-[#140a22] text-white border border-purple-500/30 p-3 pl-9 rounded-lg"
            />

          </div>

          <select
            value={filterDept}
            onChange={(e)=>setFilterDept(e.target.value)}
            className="bg-[#140a22] text-white border border-purple-500/30 p-3 rounded-lg"
          >
            <option value="">All Departments</option>
            {departments.map((d)=>(
              <option key={d.id}>{d.name}</option>
            ))}
          </select>

        </div>

        {/* OFFICER TABLE */}

        <table className="w-full text-center border border-purple-600/20">

          <thead className="bg-[#140a22] text-white">

            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredOfficers.map((o)=>(

              <tr key={o.id} className="border-t border-purple-600/20 text-gray-300">

                <td className="p-3">{o.name}</td>
                <td>{o.email}</td>
                <td>{o.phone}</td>
                <td>{o.departmentName}</td>

                <td>
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={()=>deleteOfficer(o.id)}
                  />
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ManageDepartmentsOfficers;