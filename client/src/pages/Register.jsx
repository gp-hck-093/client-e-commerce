import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import api from "../api/api";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthShowcase from "../components/AuthShowcase";

const inputClassName =
  "block w-full rounded-2xl border border-orange-100 bg-white/90 py-4 pl-11 pr-4 text-sm font-semibold text-[#1E2A39] placeholder:text-slate-300 transition focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        username: name,
        email,
        password,
        phoneNumber,
        address,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Register gagal, silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#fffdf8_32%,#f8fafc_100%)] px-4 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="auth-enter-left relative h-full min-h-[760px] overflow-hidden rounded-[2rem] border border-orange-100 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur xl:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500" />
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-100/70 blur-3xl" />

          <div className="relative">
            <div className="mb-8">
              <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                Register
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#1E2A39]">
                Buat akun baru
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Simpan data pengiriman, pantau pesanan, dan nikmati flow belanja
                yang lebih cepat seperti pengalaman di home.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-[#c63125]">
                  {error}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                {/* NAME (FULL WIDTH) */}
                <div className="group relative text-left md:col-span-2">
                  <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <FiUser size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      className={inputClassName}
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* EMAIL */}
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
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="group relative text-left">
                  <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <FiLock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className={`${inputClassName} pr-12`}
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-[#1E2A39]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-11 pr-12 text-sm font-bold text-[#1E2A39] placeholder-gray-300 transition-all focus:border-[#c63125] focus:outline-none focus:ring-2 focus:ring-[#c63125]/20 group-hover:border-gray-200"
                    placeholder="Min. 8 Karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#1E2A39]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>

            <div className="group relative text-left">
              <label className="mb-1.5 ml-4 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Phone Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <FiPhone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  className="block w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-11 pr-4 text-sm font-bold text-[#1E2A39] placeholder-gray-300 transition-all focus:border-[#c63125] focus:outline-none focus:ring-2 focus:ring-[#c63125]/20 group-hover:border-gray-200"
                  placeholder="08xx-xxxx-xxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="group relative text-left">
              <label className="mb-1.5 ml-4 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <FiMapPin size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-11 pr-4 text-sm font-bold text-[#1E2A39] placeholder-gray-300 transition-all focus:border-[#c63125] focus:outline-none focus:ring-2 focus:ring-[#c63125]/20 group-hover:border-gray-200"
                  placeholder="Jalan, Kelurahan, Kota"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

              <div className="flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3">
                <FiShield size={16} className="text-orange-500" />
                <p className="text-xs font-medium text-slate-500">
                  Data kamu aman dan terenkripsi bersama ZapShop.
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
                    Daftar Sekarang
                    <FiArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex flex-col gap-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-orange-100" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 font-medium text-slate-400">
                    atau daftar dengan
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleAuthButton
                  setError={setError}
                  setLoading={setLoading}
                  onErrorMessage="Register dengan Google gagal, silakan coba lagi."
                  onSuccessRedirect={() => navigate("/")}
                />
              </div>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-slate-400">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-bold text-orange-500 transition hover:text-orange-600"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-enter-right h-full [&>*]:h-full">
          <AuthShowcase variant="register" />
        </div>
      </div>
    </div>
  );
}
