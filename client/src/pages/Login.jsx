import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import api from "../api/api";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthShowcase from "../components/AuthShowcase";

const inputClassName =
  "block w-full rounded-2xl border border-orange-100 bg-white/90 py-4 pl-11 pr-4 text-sm font-semibold text-[#1E2A39] placeholder:text-slate-300 transition focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login gagal, silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#fff7ed_0%,#fffdf8_32%,#f8fafc_100%)] px-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-6 items-center">
        <div className="auth-enter-left h-full [&>*]:h-full">
          <AuthShowcase variant="login" />
        </div>

        <div className="auth-enter-right relative h-full min-h-[760px] overflow-hidden rounded-[2rem] border border-orange-100 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur xl:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500" />
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-100/70 blur-3xl" />

          <div className="relative">
            <div className="mb-8">
              <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                Login
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#1E2A39]">
                Selamat datang kembali
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Masuk ke akun kamu untuk lanjut belanja, cek order, dan nikmati
                pengalaman yang konsisten dengan homepage.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-[#c63125]">
                  {error}
                </div>
              )}

              <div className="space-y-4">
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
                      placeholder="Masukkan password kamu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-[#1E2A39]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                <span>Akun baru? Daftar dalam beberapa detik.</span>
                <div className="flex items-center gap-4">
                  <Link
                    to="/forgot-password"
                    className="font-bold text-slate-500 transition hover:text-[#1E2A39]"
                  >
                    Lupa password?
                  </Link>
                </div>
              </div> */}

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  size="sm"
                  className="text-xs font-bold text-[#c63125] hover:underline"
                >
                  Lupa Password?
                </Link>
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
                    Masuk Sekarang
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
                    atau masuk dengan
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleAuthButton
                  setError={setError}
                  setLoading={setLoading}
                  onErrorMessage="Login Google gagal, silakan coba lagi."
                  onSuccessRedirect={() => navigate("/")}
                />
              </div>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-slate-400">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-bold text-orange-500 transition hover:text-orange-600"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
