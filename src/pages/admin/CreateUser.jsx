import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function CreateUser({ currentUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("officer"); // default role
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (role === "admin" && currentUserRole !== "admin") {
      alert("Only admin can create another admin");
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Store role in Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        role,
      });

      alert(`User created successfully as ${role}`);
      setEmail("");
      setPassword("");
      setRole("officer");

      navigate("/admin"); // Redirect to admin dashboard
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Create User</h2>
      <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="officer">Officer</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}

export default CreateUser;