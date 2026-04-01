import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { FiArrowLeft, FiCheckCircle, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import api from "../api/api";

const inputClassName =
  "block w-full rounded-2xl border border-orange-100 bg-white/90 py-4 pl-11 pr-4 text-sm font-semibold text-[#1E2A39] placeholder:text-slate-300 transition focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const id = searchParams.get("id") || "";
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const missingParams = useMemo(() => !token || !id, [token, id]);
  const passwordValidationMessage = useMemo(() => {
    const normalizedPassword = newPassword.trim();

    if (!normalizedPassword) return "Password is required.";
    if (normalizedPassword.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (missingParams) {
      setError("Link reset password tidak valid atau parameter belum lengkap.");
      return;
    }

    if (passwordValidationMessage) {
      setError(passwordValidationMessage);
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/reset-password", {
        id,
        token,
        newPassword: newPassword.trim(),
      });
      setSuccess(data.message || "Password berhasil direset.");
      setNewPassword("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal reset password, silakan coba lagi.",
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
            Reset Password
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#1E2A39]">
            Buat password baru
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Masukkan password baru untuk akun kamu. Password cukup minimal 6
            karakter.
          </p>
        </div>

        {missingParams ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-[#c63125]">
            Link reset password tidak valid atau parameter belum lengkap.
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-[#c63125]">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                <span className="inline-flex items-center gap-2">
                  <FiCheckCircle size={16} />
                  {success}
                </span>
              </div>
            )}

            <div className="group relative text-left">
              <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <FiLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`${inputClassName} pr-12`}
                  placeholder="Masukkan password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-[#1E2A39]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <p className="mt-2 ml-1 text-xs text-slate-400">
                Minimal 6 karakter.
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
                "Simpan Password Baru"
              )}
            </button>
          </form>
        )}

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
