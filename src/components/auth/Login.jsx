// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider, githubProvider, db } from "../../firebase/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect based on role
  const redirectByRole = (role) => {
   localStorage.setItem("role", role); 
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "officer") navigate("/officer/dashboard");
    else navigate("/citizen/dashboard");
  };

  // Email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      // Get user role from Firestore
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        alert("Your account is not registered. Please contact admin.");
        return;
      }

      const role = userDoc.data().role;
      console.log("ROLE FROM FIRESTORE:", role);

      redirectByRole(role);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Social Login
  const handleSocialLogin = async (provider) => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;

      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        alert("Your account is not registered. Please contact admin.");
        return;
      }

      const role = userDoc.data().role;
      redirectByRole(role);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0814] via-[#140a22] to-[#1b0f2e] p-4">
      <div className="bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-10 w-full max-w-md shadow-lg">

        <h2 className="text-4xl font-bold text-[#ccff00] text-center mb-6">
          Welcome Back
        </h2>

        <p className="text-center text-gray-400 mb-8">
          Login to your Citizen Portal account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6f06f9] hover:bg-[#8b2cf5] text-white font-bold rounded-lg transition"
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
          <span className="border-b w-1/5"></span>
          <span className="text-gray-500 px-2">or</span>
          <span className="border-b w-1/5"></span>
        </div>

        <div className="flex flex-col gap-4">

          <button
            onClick={() => handleSocialLogin(googleProvider)}
            className="flex items-center justify-center gap-2 w-full py-3 border rounded-lg hover:bg-gray-100 transition"
          >
            <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google"/>
            Continue with Google
          </button>

          <button
            onClick={() => handleSocialLogin(githubProvider)}
            className="flex items-center justify-center gap-2 w-full py-3 border rounded-lg hover:bg-gray-100 transition"
          >
            <img src="https://img.icons8.com/ios-glyphs/24/github.png" alt="GitHub"/>
            Continue with GitHub
          </button>

        </div>

        <p
          className="text-center text-purple-500 mt-4 cursor-pointer hover:underline"
          onClick={() => navigate("/mobile-login")}
        >
          Try another way
        </p>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;