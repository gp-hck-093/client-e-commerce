import { Link } from "react-router";
import { FiArrowRight, FiPackage, FiShield, FiTruck } from "react-icons/fi";

const contentMap = {
  login: {
    eyebrow: "Welcome back",
    title: "Belanja yang terasa cepat, rapi, dan menyenangkan.",
    description:
      "Masuk untuk lanjut checkout, cek order, dan temukan produk yang lagi ramai diincar.",
    ctaLabel: "Lihat katalog",
    ctaLink: "/",
    highlights: [
      "Produk pilihan yang tampil clean seperti homepage",
      "Checkout cepat dan order tracking dalam satu akun",
      "Akses promo dan rekomendasi yang lebih personal",
    ],
    stats: [
      { label: "Produk siap kirim", value: "120+" },
      { label: "Pesanan selesai", value: "3.4k" },
      { label: "Ulasan positif", value: "98%" },
    ],
  },
  register: {
    eyebrow: "Join ZapShop",
    title:
      "Bikin akun baru dan mulai belanja dengan gaya yang sama seperti home.",
    description:
      "Daftar untuk simpan alamat, pantau pesanan, dan checkout lebih cepat kapan saja.",
    ctaLabel: "Jelajahi produk",
    ctaLink: "/",
    highlights: [
      "Satu akun untuk wishlist, cart, dan riwayat order",
      "Alamat tersimpan agar proses checkout makin singkat",
      "Promo baru dan rilisan produk bisa langsung kamu pantau",
    ],
    stats: [
      { label: "Brand aktif", value: "80+" },
      { label: "Transaksi aman", value: "24/7" },
      { label: "Pengiriman cepat", value: "Same day" },
    ],
  },
};

const icons = [FiPackage, FiShield, FiTruck];

export default function AuthShowcase({ variant = "login" }) {
  const content = contentMap[variant] || contentMap.login;

  return (
    <div className="relative h-full min-h-[760px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#7c2d12] p-8 text-white shadow-2xl shadow-orange-200/40 lg:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,24,39,0.1),rgba(17,24,39,0.55))]" />
      <div className="absolute -right-20 top-10 h-44 w-44 rounded-full bg-orange-400/15 blur-3xl" />
      <div className="absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-amber-200/10 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14 text-xl font-black text-orange-300 shadow-lg shadow-orange-950/20">
              Z
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">
                <span className="text-orange-300">Zap</span>
                <span className="text-white">Shop</span>
              </p>
              <p className="text-sm text-white/80">
                Modern everyday marketplace
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-orange-100">
              {content.eyebrow}
            </p>
            <h2 className="max-w-lg text-3xl font-black leading-tight lg:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 lg:text-base">
              {content.description}
            </p>
          </div>

          <Link
            to={content.ctaLink}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#1f2937] transition hover:-translate-y-0.5 hover:bg-orange-50"
          >
            {content.ctaLabel}
            <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {content.stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/15 bg-white/12 p-4 backdrop-blur-sm"
            >
              <p className="text-2xl font-black text-orange-200">
                {item.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-white/75">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-[1.75rem] border border-white/15 bg-black/10 p-5 backdrop-blur-sm">
          {content.highlights.map((item, index) => {
            const Icon = icons[index] || FiPackage;

            return (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-300/18 text-orange-200">
                  <Icon size={18} />
                </div>
                <p className="text-sm leading-6 text-white/90">{item}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
