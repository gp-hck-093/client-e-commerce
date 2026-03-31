import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import GoogleAuthButton from "../components/GoogleAuthButton";

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
      setError(err.response?.data?.message || "Login gagal, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f8f8] p-4 pt-20">
      <div className="absolute -right-[10%] -top-[10%] -z-10 h-500px w-500px animate-pulse rounded-full bg-[#c63125]/5 blur-3xl" />
      <div className="animate-float-delayed absolute -bottom-[10%] -left-[10%] -z-10 h-400px w-400px rounded-full bg-[#F1A501]/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-gray-200/50">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-center font-volkhov text-4xl font-bold text-[#1E2A39]">
              Selamat Datang
            </h1>
            <p className="text-center text-sm font-medium text-gray-400">
              Masuk ke akun kamu
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="animate-shake rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-xs font-bold text-[#c63125]">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="group relative text-left">
                <label className="mb-1.5 ml-4 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <FiMail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-11 pr-4 text-sm font-bold text-[#1E2A39] placeholder-gray-300 transition-all focus:border-[#c63125] focus:outline-none focus:ring-2 focus:ring-[#c63125]/20 group-hover:border-gray-200"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="group relative text-left">
                <label className="mb-1.5 ml-4 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <FiLock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-11 pr-12 text-sm font-bold text-[#1E2A39] placeholder-gray-300 transition-all focus:border-[#c63125] focus:outline-none focus:ring-2 focus:ring-[#c63125]/20 group-hover:border-gray-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#1E2A39]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/register"
                className="text-xs font-bold text-[#c63125] hover:underline"
              >
                Belum punya akun?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E2A39] text-sm font-bold text-white shadow-xl shadow-[#1E2A39]/20 transition-all hover:bg-[#1E2A39]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 font-medium text-gray-400">
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

          <p className="mt-8 text-center text-sm font-medium text-gray-400">
            Belum punya akun?{" "}
            <Link to="/register" className="font-bold text-[#c63125] hover:underline">
              Daftar Disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
