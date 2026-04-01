import { useState } from "react";
import { Link } from "react-router";
import { FiArrowLeft, FiMail, FiSend } from "react-icons/fi";
import api from "../api/api";

const inputClassName =
  "block w-full rounded-2xl border border-orange-100 bg-white/90 py-4 pl-11 pr-4 text-sm font-semibold text-[#1E2A39] placeholder:text-slate-300 transition focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      setError("Invalid email format.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot-password", {
        email: normalizedEmail,
      });
      setSuccess(data.message || "Link reset password berhasil dikirim.");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengirim link reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#fff7ed_0%,#fffdf8_32%,#f8fafc_100%)] px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-orange-100 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur xl:p-10">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
            Forgot Password
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#1E2A39]">
            Minta link reset password
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Masukkan email akun kamu. Kalau email terdaftar, kami akan kirim
            link reset password ke inbox kamu.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-[#c63125]">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {success}
            </div>
          )}

          <div className="group relative text-left">
            <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <FiMail size={18} />
              </div>
              <input
                type="email"
                required
                className={inputClassName}
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            <p className="mt-2 ml-1 text-xs text-slate-400">
              Gunakan email yang terdaftar di akun kamu.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-bold text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-orange-200/80 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Kirim Link Reset
                <FiSend size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-400">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-bold text-orange-500 transition hover:text-orange-600"
          >
            <FiArrowLeft size={16} />
            Kembali ke login
          </Link>
        </p>
      </div>
    </div>
  );
}
