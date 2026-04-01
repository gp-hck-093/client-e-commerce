import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    phoneNumber: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH PROFILE DATA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setForm({
          username: data.data.username || "",
          phoneNumber: data.data.phoneNumber || "",
          address: data.data.address || "",
        });

        if (data.data.imageUrl) {
          setPreview(data.data.imageUrl);
        }
      } catch (error) {
        console.log("Fetch profile error:", error);
      }
    };

    fetchProfile();
  }, []);

  // 🔥 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 HANDLE IMAGE CHANGE + PREVIEW
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("username", form.username);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("address", form.address);

      if (image) {
        formData.append("image", image);
      }

      await api.put("/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      alert("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.log("Update error:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-md">
        <h1 className="text-xl font-bold mb-5 text-gray-800">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔥 IMAGE PREVIEW */}
          <div className="flex justify-center">
            <img
              src={preview || "https://via.placeholder.com/100"}
              alt="preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>

          {/* 🔥 FILE INPUT */}
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full text-sm"
          />

          {/* USERNAME */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* PHONE */}
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* ADDRESS */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition font-semibold"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
