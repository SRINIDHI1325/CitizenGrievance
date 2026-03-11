// src/components/auth/Register.jsx
import React, { useState } from "react";
import { auth, googleProvider, githubProvider, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlinePhone, AiOutlineHome } from "react-icons/ai";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "citizen",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
        createdAt: new Date()
      });

      localStorage.setItem("role", formData.role);
      alert("Registration successful!");
      if (formData.role === "citizen") navigate("/citizen/dashboard");
      if (formData.role === "officer") navigate("/officer/dashboard");
      if (formData.role === "admin") navigate("/admin/dashboard");

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        if (window.confirm("Email already exists. Login instead?")) navigate("/login");
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), { fullName: user.displayName, email: user.email, role: "citizen" }, { merge: true });
      localStorage.setItem("role", "citizen");
      navigate("/citizen/dashboard");
    } catch (err) { alert(err.message); }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), { fullName: user.displayName || user.email, email: user.email, role: "citizen" }, { merge: true });
      localStorage.setItem("role", "citizen");
      navigate("/citizen/dashboard");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0814] via-[#140a22] to-[#1b0f2e] p-4">
      <div className="bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-10 w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#ccff00]">Create an Account</h2>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 rounded-lg bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
              required
            />
          </div>

          <div className="relative">
            <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 rounded-lg bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
              required
            />
          </div>

          <div className="relative">
            <AiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 rounded-lg bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
              required
            />
          </div>

          <div className="relative">
            <AiOutlineHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 rounded-lg bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
              required
            />
          </div>

          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 rounded-lg bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
              required
            />
          </div>

          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 rounded-lg bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6f06f9] hover:bg-[#8b2cf5] text-white font-bold rounded-lg transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-gray-500 px-2">or</span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full py-3 border rounded-lg hover:bg-gray-100 transition"
          >
            <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />
            Continue with Google
          </button>

          <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-2 w-full py-3 border rounded-lg hover:bg-gray-100 transition"
          >
            <img src="https://img.icons8.com/ios-glyphs/24/github.png" alt="GitHub" />
            Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#ccff00] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;