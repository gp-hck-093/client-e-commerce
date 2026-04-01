import { useState } from "react";
import { useNavigate } from "react-router";
import { FaTimes, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import api from "../api/api";

const PAYMENT_METHODS = [
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Cash on Delivery",
];

export default function CheckoutModal({
  cartItems,
  subtotal,
  shipping,
  total,
  onClose,
  onConfirm,
}) {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("Credit Card");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post(
        "/orders/checkout",
        { paymentMethod: selectedPayment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      sessionStorage.setItem("newOrderId", data.orderId);
      setConfirmed(true);

      setTimeout(() => {
        onConfirm();
        navigate("/orders");
      }, 1500);
    } catch (err) {
      setError("Checkout failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            Order Confirmation
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes />
          </button>
        </div>

        {confirmed ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <FaCheckCircle className="text-6xl text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Order Placed!
            </h3>
            <p className="text-sm text-gray-400">
              Your order has been confirmed successfully.
            </p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-6">
            {/* ORDER ITEMS */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                🛍️ Items Ordered
              </h3>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.qty} × Rp{" "}
                        {Number(item.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-orange-500 shrink-0">
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-dashed border-gray-200" />

            {/* PAYMENT METHOD */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaCreditCard className="text-orange-500" /> Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedPayment(method)}
                    className={`text-sm px-3 py-2 rounded-xl border-2 transition font-medium ${
                      selectedPayment === method
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 text-gray-500 hover:border-orange-200"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-dashed border-gray-200" />

            {/* PRICE SUMMARY */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                💰 Price Summary
              </h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>Rp {shipping.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-800 pt-2 border-t border-dashed border-gray-200">
                <span>Total</span>
                <span className="text-orange-500">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            {/* CONFIRM BUTTON */}
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition text-sm"
            >
              {loading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
