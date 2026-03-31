import { FaShoppingCart, FaEye } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router"; // ← tambah ini

export default function CardHome({ product, onView }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
        />

        {/* CATEGORY BADGE */}
        <span className="absolute bottom-3 left-3 bg-purple-500 text-white text-xs px-3 py-1 rounded-full shadow">
          {product.Category?.name || "Category"}
        </span>

        {/* VIEW DETAIL */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <button
            onClick={() => onView(product.id)}
            className="bg-white p-3 rounded-full hover:bg-orange-500 hover:text-white transition shadow-md"
          >
            <FaEye />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3">
        {/* TITLE (ENLARGED) */}
        <h3 className="font-semibold text-base line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* PRICE + BUTTON */}
        <div className="flex justify-between items-center mt-1">
          <p className="text-orange-500 font-bold text-lg">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </p>

          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 text-xs hover:bg-orange-600 transition"
          >
            <FaShoppingCart />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
