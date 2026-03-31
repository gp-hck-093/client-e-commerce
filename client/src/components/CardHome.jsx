import { FaStar, FaShoppingCart, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function CardHome({ product }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group">
      {/* IMAGE */}
      <div className="relative">
        <img src={product.imageUrl} className="w-full h-75 object-cover" />

        {/* CATEGORY */}
        <span className="absolute bottom-3 left-3 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
          Category
        </span>

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          {/* VIEW DETAIL */}
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            className="bg-white p-3 rounded-full hover:bg-orange-500 hover:text-white transition"
          >
            <FaEye />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1">{product.name}</h3>

        <p className="text-xs text-gray-500 truncate">{product.description}</p>

        {/* RATING */}
        <div className="flex items-center gap-1 text-yellow-400 text-sm mt-2">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar className="text-gray-300" />
          <span className="text-gray-500 text-xs">(120)</span>
        </div>

        {/* STOCK */}
        <p className="text-xs text-gray-400 mt-1">{product.qty} in stock</p>

        {/* PRICE */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-orange-500 font-bold">${product.price}</p>

          <button className="bg-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
            <FaShoppingCart />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
