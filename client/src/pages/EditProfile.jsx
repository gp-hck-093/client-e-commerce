import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import api from "../api/api";
import defaultProfileImage from "../assets/profile-default.png";

const withImageVersion = (imageUrl) => {
  if (!imageUrl) return defaultProfileImage;
  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}t=${Date.now()}`;
};

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    phoneNumber: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(defaultProfileImage);
  const [loading, setLoading] = useState(false);

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

        setPreview(withImageVersion(data.data.imageUrl));
      } catch (error) {
        console.log("Fetch profile error:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

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

      const { data } = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const updatedProfile = {
        ...data.data,
        imageUrl: withImageVersion(data.data.imageUrl),
      };

      setPreview(updatedProfile.imageUrl);
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: updatedProfile,
        })
      );

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#f97316",
      });
      navigate("/");
    } catch (error) {
      console.log("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Failed to update profile.",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#f8fafc_42%,_#eef2ff_100%)] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-white/80 bg-white/95 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur sm:p-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">
            Account Settings
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-800">
            Edit Profile
          </h2>
        </div>

        <p className="mb-6 max-w-lg text-sm leading-6 text-slate-500">
            Keep your profile fresh so your account feels more personal.
          </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block rounded-[26px] border border-dashed border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 px-5 py-4 transition hover:border-orange-300 hover:shadow-md">
            <span className="mb-3 block text-sm font-semibold text-slate-700">
              Profile Picture
            </span>

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-[30px] bg-white p-2 shadow-lg shadow-orange-100">
                <img
                  src={preview || defaultProfileImage}
                  alt="preview"
                  className="h-28 w-28 rounded-[22px] object-cover"
                />
              </div>

              <div>
                <span className="inline-flex rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200">
                  Choose Image
                </span>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  Make your profile easier to recognize
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PNG, JPG, or JPEG up to a few MB works best
                </p>
              </div>
            </div>

            <input
              type="file"
              onChange={handleImageChange}
              className="mt-4 w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-orange-500 file:shadow-sm"
            />
          </label>

          <div className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </span>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </span>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Address
              </span>
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(251,146,60,0.35)] transition hover:scale-[1.01] hover:from-orange-600 hover:via-amber-500 hover:to-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
