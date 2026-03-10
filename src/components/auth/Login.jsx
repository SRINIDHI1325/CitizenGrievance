// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider, githubProvider } from "../../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { login } from "../../firebase/authService";

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

      const userCredential = await login(email, password);
      const user = userCredential.user;

      // Default role
      let role = "citizen";

      // Simple role detection (for testing)
      if (email.includes("officer")) {
        role = "officer";
      }

      if (email.includes("admin")) {
        role = "admin";
      }

      // Save role
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "citizen") navigate("/citizen");
      if (role === "officer") navigate("/officer");
      if (role === "admin") navigate("/admin");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }

  };

  // Google login
  const handleGoogleLogin = async () => {

    try {

      await signInWithPopup(auth, googleProvider);

      // Default role for Google users
      localStorage.setItem("role", "citizen");

      navigate("/citizen");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }

  };

  // GitHub login
  const handleGithubLogin = async () => {

    try {

      await signInWithPopup(auth, githubProvider);

      // Default role
      localStorage.setItem("role", "citizen");

      navigate("/citizen");

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

        {/* Email login */}
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

        {/* Divider */}
        <div className="my-6 flex items-center justify-center text-gray-400">
          <span className="border-b border-gray-600 w-1/5"></span>
          <span className="px-2">or</span>
          <span className="border-b border-gray-600 w-1/5"></span>
        </div>

        {/* Social login */}
        <div className="flex flex-col gap-4">

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full py-3 border border-purple-600/50 rounded-lg hover:bg-purple-700 transition text-white"
          >

            <img
              src="https://img.icons8.com/color/24/google-logo.png"
              alt="Google"
            />

            Continue with Google

          </button>

          <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-2 w-full py-3 border border-purple-600/50 rounded-lg hover:bg-purple-700 transition text-white"
          >

            <img
              src="https://img.icons8.com/ios-glyphs/24/github.png"
              alt="GitHub"
            />

            Continue with GitHub

          </button>

        </div>

        <p className="text-center text-gray-400 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-[#ccff00] font-semibold hover:underline"
          >

            Sign Up

          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;
