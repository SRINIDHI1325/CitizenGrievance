// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider, githubProvider, db } from "../../firebase/firebase";
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- Email/Password Login ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2️⃣ Get user role from Firestore
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        alert("Your account is not registered. Please contact admin.");
        setLoading(false);
        return;
      }

      const role = userDoc.data().role;

      // 3️⃣ Redirect based on role
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "officer") navigate("/officer/dashboard");
      else navigate("/citizen/dashboard");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Social Login (Google & GitHub) ----------------
  const handleSocialLogin = async (provider) => {
    setLoading(true);

    try {
      // 1️⃣ Sign in with popup
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;

      // 2️⃣ Get user role from Firestore
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Account not registered
        alert("Your account is not registered. Please contact admin.");
        setLoading(false);
        return;
      }

      const role = userDoc.data().role;

      // 3️⃣ Redirect based on role
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "officer") navigate("/officer/dashboard");
      else navigate("/citizen/dashboard");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Forgot Password ----------------
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-4">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          onClick={handleForgotPassword}
          className="text-right text-purple-500 text-sm mt-2 cursor-pointer hover:underline"
        >
          Forgot Password?
        </p>

        <div className="my-6 flex items-center justify-center">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-gray-500 px-2">or</span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSocialLogin(googleProvider)}
            className="flex items-center justify-center gap-2 w-full py-3 border rounded-lg hover:bg-gray-100 transition"
          >
            <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />
            Continue with Google
          </button>

          <button
            onClick={() => handleSocialLogin(githubProvider)}
            className="flex items-center justify-center gap-2 w-full py-3 border rounded-lg hover:bg-gray-100 transition"
          >
            <img src="https://img.icons8.com/ios-glyphs/24/github.png" alt="GitHub" />
            Continue with GitHub
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;