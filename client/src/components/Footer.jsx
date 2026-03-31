import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0B1220] text-gray-300 px-6 pt-12 pb-6">
      {/* TOP SECTION */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        {/* LOGO + DESC */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange-500 text-white p-2 rounded-full">⚡</div>
            <h1 className="text-lg font-semibold text-white">
              <span className="text-orange-500">Zap</span>
              <span className="text-pink-500">Shop</span>
            </h1>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Your one-stop destination for quality products at jaw-dropping
            prices. Shop fast, live better.
          </p>

          {/* SOCIAL */}
          <div className="flex gap-3">
            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
              <div
                key={i}
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
              >
                <Icon />
              </div>
            ))}
          </div>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-white font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">New Arrivals</li>
            <li className="hover:text-white cursor-pointer">Best Sellers</li>
            <li className="hover:text-white cursor-pointer">Flash Sales</li>
            <li className="hover:text-white cursor-pointer">Electronics</li>
            <li className="hover:text-white cursor-pointer">Fashion</li>
            <li className="hover:text-white cursor-pointer">Accessories</li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-white font-semibold mb-4">Help</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">FAQ</li>
            <li className="hover:text-white cursor-pointer">Shipping Info</li>
            <li className="hover:text-white cursor-pointer">
              Returns & Exchanges
            </li>
            <li className="hover:text-white cursor-pointer">Order Tracking</li>
            <li className="hover:text-white cursor-pointer">Size Guide</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Press</li>
            <li className="hover:text-white cursor-pointer">Sustainability</li>
            <li className="hover:text-white cursor-pointer">Affiliates</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
          </ul>
        </div>
      </div>

      {/* CONTACT BAR */}
      <div className="border-t border-gray-700 pt-6 pb-6 grid grid-cols-3 text-sm">
        <div className="flex items-center gap-3">
          <FaEnvelope className="text-orange-500" />
          support@zapshop.com
        </div>

        <div className="flex items-center gap-3">
          <FaPhone className="text-orange-500" />
          +1 (800) 927-7465
        </div>

        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-orange-500" />
          123 Commerce St, NY 10001
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-700 pt-4 flex justify-between text-xs text-gray-500">
        <p>© 2026 ZapShop. All rights reserved.</p>

        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-white cursor-pointer">
            Terms of Service
          </span>
          <span className="hover:text-white cursor-pointer">
            Cookie Settings
          </span>
        </div>
      </div>
    </footer>
  );
}
