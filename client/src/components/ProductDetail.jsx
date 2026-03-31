import { useEffect } from "react";

export default function ProductDetail({ product, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      {/* OVERLAY CLICK */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* MODAL */}
      <div className="relative bg-white rounded-3xl w-[900px] max-w-full p-8 shadow-2xl animate-fadeIn">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>

        <div className="grid grid-cols-2 gap-8">
          {/* IMAGE */}
          <div className="flex items-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[350px] object-cover rounded-2xl shadow"
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-4">
            {/* NAME */}
            <h2 className="text-2xl font-bold leading-snug">{product.name}</h2>

            {/* PRICE */}
            <p className="text-orange-500 text-3xl font-bold">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>

            {/* META INFO */}
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mt-2">
              <p className="font-medium text-gray-400">Category</p>
              <p>{product.Category?.name}</p>

              <p className="font-medium text-gray-400">Brand</p>
              <p>{product.Brand?.name}</p>

              <p className="font-medium text-gray-400">Stock</p>
              <p
                className={`${
                  product.qty < 5 ? "text-red-500" : "text-gray-700"
                }`}
              >
                {product.qty}
              </p>

              <p className="font-medium text-gray-400">Product ID</p>
              <p>{product.id}</p>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-1 text-gray-700">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || "No description available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
