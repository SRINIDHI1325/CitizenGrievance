// src/components/auth/MobileLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, firebase } from "../../firebase/firebase"; // make sure auth is imported correctly
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function MobileLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!phone) return alert("Enter your mobile number");

    setLoading(true);
    try {
      // check if phone exists in users collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phone", "==", phone));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        alert("Phone number not registered. Please sign up first.");
        setLoading(false);
        return;
      }

      // setup recaptcha
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      alert("OTP sent successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const result = await confirmationResult.confirm(otp);
      // login successful, get user role from firestore
      const uid = result.user.uid;
      const userDoc = await getDocs(query(collection(db, "users"), where("phone", "==", phone)));
      if (!userDoc.empty) {
        const role = userDoc.docs[0].data().role;
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "officer") navigate("/officer/dashboard");
        else navigate("/citizen/dashboard");
      }
    } catch (err) {
      alert("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0d0814] via-[#140a22] to-[#1b0f2e]">
      <div className="bg-[#241835]/70 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-10 w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold text-[#ccff00] text-center mb-6">
          Login with Mobile
        </h2>

        <input
          type="text"
          placeholder="Enter mobile number with country code"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded-lg mb-4 bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
        />

        {!confirmationResult ? (
          <button
            onClick={sendOtp}
            className="w-full py-3 bg-[#6f06f9] hover:bg-[#8b2cf5] text-white font-bold rounded-lg transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 rounded-lg mb-4 bg-[#1a1126] border border-purple-600/40 text-white focus:outline-none focus:ring-2 focus:ring-[#ccff00]"
            />
            <button
              onClick={verifyOtp}
              className="w-full py-3 bg-[#6f06f9] hover:bg-[#8b2cf5] text-white font-bold rounded-lg transition"
            >
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

export default MobileLogin;