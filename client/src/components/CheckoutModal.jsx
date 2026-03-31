import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";

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
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!address.trim()) {
      alert("Please enter your shipping address.");
      return;
    }
    setConfirmed(true);

    const orderData = {
      id: Date.now(), // nanti dari response API
      totalPrice: total,
      status: "pending",
      paymentMethod: selectedPayment,
      address,
      items: cartItems,
      subtotal,
      shipping,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onConfirm();
      navigate("/orders", { state: { newOrder: orderData } });
    }, 1500);
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
          /* SUCCESS STATE */
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
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
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
                        {item.qty} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-orange-500 shrink-0">
                      ${(item.price * item.qty).toFixed(2)}
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

            {/* SHIPPING ADDRESS */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" /> Shipping Address
              </h3>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full shipping address..."
                rows={3}
                className="w-full text-sm border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-400 transition resize-none text-gray-700 placeholder-gray-300"
              />
            </div>

            <hr className="border-dashed border-gray-200" />

            {/* PRICE SUMMARY */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                💰 Price Summary
              </h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-800 pt-2 border-t border-dashed border-gray-200">
                <span>Total</span>
                <span className="text-orange-500">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* CONFIRM BUTTON */}
            <button
              onClick={handleConfirm}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-sm"
            >
              Confirm Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
