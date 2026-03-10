// src/components/auth/Register.jsx
import React, { useState } from "react";
import { auth, googleProvider, githubProvider, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Email signup
  const handleSignup = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
        createdAt: new Date()
      });

      // Save role locally
      localStorage.setItem("role", formData.role);

      alert("Registration successful!");

      // Redirect based on role
      if (formData.role === "citizen") navigate("/citizen");
      if (formData.role === "officer") navigate("/officer");
      if (formData.role === "admin") navigate("/admin");

    } catch (err) {

      if (err.code === "auth/email-already-in-use") {
        if (window.confirm("Email already exists. Login instead?")) {
          navigate("/login");
        }
      } else {
        alert(err.message);
      }

    } finally {
      setLoading(false);
    }

  };

  // Google login
  const handleGoogleLogin = async () => {

    try {

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName,
        email: user.email,
        role: "citizen"
      }, { merge: true });

      localStorage.setItem("role", "citizen");

      navigate("/citizen");

    } catch (err) {
      alert(err.message);
    }

  };

  // Github login
  const handleGithubLogin = async () => {

    try {

      const result = await signInWithPopup(auth, githubProvider);
      con
