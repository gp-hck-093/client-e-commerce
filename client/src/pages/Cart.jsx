import CheckoutModal from "../components/CheckoutModal";
import { useState } from "react";
import {
  FaTrash,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaTag,
} from "react-icons/fa";

import { useNavigate } from "react-router";

// TEMP DATA - simulasi item yang sudah di-add ke keranjang
const initialCartItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    qty: 2,
    description: "Premium headphones",
    imageUrl: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 149.99,
    qty: 1,
    description: "Fitness tracking",
    imageUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Leather Bag",
    price: 119.99,
    qty: 1,
    description: "Premium bag",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    category: "Fashion",
  },
];

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  // UPDATE qty
  const handleUpdateQty = (id, newQty) => {
    if (newQty < 1) return;
    if (newQty > 99) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item)),
    );
  };

  // DELETE item
  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setDeletingId(null);
      showNotification("Item removed from cart.");
    }, 300);
  };

  // CLEAR CART
  const handleClearCart = () => {
    setCartItems([]);
    showNotification("Cart has been cleared.");
  };

  // CALCULATIONS
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 pb-20 relative">
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${
            notification.type === "success" ? "bg-orange-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-white shadow hover:bg-orange-500 hover:text-white transition"
          >
            <FaArrowLeft className="text-sm" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">My Cart</h1>
            <p className="text-xs text-gray-400">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
          >
            <FaTrash className="text-xs" />
            Clear All
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-white rounded-full p-8 shadow mb-5">
            <FaShoppingCart className="text-5xl text-gray-200" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Add some products to get started!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-orange-600 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex gap-6 items-start">
          {/* CART ITEMS LIST */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 overflow-hidden flex gap-0 group ${
                  deletingId === item.id
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
              >
                {/* IMAGE */}
                <div className="relative w-36 h-36 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FaTag className="text-[9px]" />
                    {item.category}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-full text-red-400 bg-red-50 hover:bg-red-500 hover:text-white transition"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    {/* PRICE */}
                    <p className="text-orange-500 font-bold text-lg">
                      ${(item.price * item.qty).toFixed(2)}
                      <span className="text-gray-400 text-xs font-normal ml-1">
                        (${item.price} each)
                      </span>
                    </p>

                    {/* QTY EDITOR (EDIT / UPDATE) */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow text-gray-600 hover:bg-orange-500 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600"
                      >
                        <FaMinus className="text-xs" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={item.qty}
                        onChange={(e) =>
                          handleUpdateQty(
                            item.id,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-10 text-center text-sm font-semibold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      <button
                        onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                        disabled={item.qty >= 99}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow text-gray-600 hover:bg-orange-500 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="w-80 shrink-0 sticky top-6">
            <div className="bg-white rounded-xl shadow p-5 space-y-4">
              <h2 className="font-bold text-gray-800 text-base">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-gray-500"
                  >
                    <span className="truncate max-w-[160px]">
                      {item.name}{" "}
                      <span className="text-gray-400">×{item.qty}</span>
                    </span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-dashed border-gray-200" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
              </div>

              <hr className="border-dashed border-gray-200" />

              <div className="flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span className="text-orange-500 text-lg">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-sm"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full text-gray-400 hover:text-orange-500 text-sm text-center transition"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onClose={() => setShowCheckout(false)}
          onConfirm={() => {
            // nanti disambungin ke API POST /orders
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
}
