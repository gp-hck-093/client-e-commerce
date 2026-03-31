import { useNavigate } from "react-router";
import {
  FaSearch,
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaChevronDown,
  FaSlidersH,
  FaReceipt,
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-100 px-6 py-3 flex items-center justify-between">
      
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <div className="bg-orange-500 text-white p-2 rounded-full">⚡</div>
        <h1 className="text-lg font-semibold">
          <span className="text-orange-500">Zap</span>
          <span className="text-pink-500">Shop</span>
        </h1>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center bg-white rounded-full border w-125 px-3 py-2">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search products, brands..."
          className="flex-1 outline-none text-sm"
        />
        <div className="flex items-center gap-1 px-3 py-1 border-l cursor-pointer text-sm text-gray-600">
          <FaSlidersH />
          All
          <FaChevronDown />
        </div>
        <div className="ml-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm cursor-pointer flex items-center gap-1">
          Newest
          <FaChevronDown />
        </div>
      </div>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-6 text-gray-600 text-lg">
        <FaUser className="cursor-pointer hover:text-orange-500 transition" />
        <FaReceipt
          className="cursor-pointer hover:text-orange-500 transition"
          onClick={() => navigate("/orders")}
        />
        <FaShoppingCart
          className="cursor-pointer hover:text-orange-500 transition"
          onClick={() => navigate("/cart")}
        />
      </div>
    </div>
  );
}
