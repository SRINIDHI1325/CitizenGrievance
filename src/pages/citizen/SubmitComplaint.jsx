import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function SubmitComplaint() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Get Current Location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setGettingLocation(false);
      },
      (error) => {
        alert("Unable to fetch location");
        setGettingLocation(false);
      }
    );
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!image) return "";

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "citizen_grievance_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/deu5wmxhv/image/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();
    return result.secure_url;
  };

  // Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImage();

      await addDoc(collection(db, "complaints"), {
        title,
        category,
        description,
        imageUrl,
        location: location || null,
        status: "Submitted",
        createdAt: Timestamp.now(),
      });

      alert("Complaint submitted successfully");

      setTitle("");
      setCategory("");
      setDescription("");
      setImage(null);
      setLocation(null);
      setLoading(false);
    } catch (error) {
      console.error("Error adding complaint:", error);
      alert("Error submitting complaint");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0814] via-[#140a22] to-[#1b0f2e] flex items-center justify-center p-6">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-[#2c1d47]/80 backdrop-blur-xl border border-purple-500/50 rounded-3xl p-10 shadow-xl space-y-6"
      >

        <h2 className="text-3xl md:text-4xl font-bold text-[#ccff00] text-center mb-6">
          Submit Complaint
        </h2>

        <input
          type="text"
          placeholder="Complaint Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-[#3b2a59] text-white border border-purple-400"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded bg-[#3b2a59] text-white border border-purple-400"
        >
          <option value="">Select Category</option>
          <option value="Road & Infrastructure">Road & Infrastructure</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Electricity">Electricity</option>
          <option value="Waste Management">Waste Management</option>
          <option value="Public Safety">Public Safety</option>
          <option value="Other Civic Issues">Other Civic Issues</option>
        </select>

        <textarea
          placeholder="Describe your complaint"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full p-3 rounded bg-[#3b2a59] text-white border border-purple-400"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-white"
        />

        {/* Location Button */}

        <button
          type="button"
          onClick={getLocation}
          className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          📍 {gettingLocation ? "Getting Location..." : "Use My Current Location"}
        </button>

        {location && (
          <div className="text-sm text-green-300 text-center">
            📍 Location Added <br />
            Lat: {location.latitude} | Lng: {location.longitude}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#6f06f9] text-white rounded-xl hover:bg-[#8b2cf5] transition font-semibold"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>

      </form>
    </div>
  );
}

export default SubmitComplaint;
