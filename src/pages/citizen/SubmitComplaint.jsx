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

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGettingLocation(false);
      },
      (error) => {
        alert("Unable to fetch location");
        setGettingLocation(false);
      }
    );
  };

  const uploadImage = async () => {
    if (!image) return "";

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "citizen_grievance_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/deu5wmxhv/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const result = await res.json();
    return result.secure_url;
  };

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
        status: "Pending",
        createdAt: Timestamp.now()
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
    <div>
      <h2>Submit Complaint</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Complaint Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Road">Road</option>
          <option value="Water">Water</option>
          <option value="Electricity">Electricity</option>
          <option value="Sanitation">Sanitation</option>
        </select>

        <br /><br />

        <textarea
          placeholder="Describe your complaint"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <br /><br />

        <button type="button" onClick={getLocation}>
          {gettingLocation ? "Getting Location..." : "Use My Current Location"}
        </button>

        <br /><br />

        {location && (
          <p>
            Location captured: <br />
            Latitude: {location.lat} <br />
            Longitude: {location.lng}
          </p>
        )}

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>

      </form>
    </div>
  );
}

export default SubmitComplaint;