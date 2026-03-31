import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  FaArrowLeft,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaMapMarkerAlt,
  FaReceipt,
} from "react-icons/fa";

// TEMP riwayat order lama (nanti dari API GET /orders)
const dummyPastOrders = [
  {
    id: 1001,
    totalPrice: 239.98,
    status: "paid",
    paymentMethod: "Credit Card",
    address: "Jl. Sudirman No. 1, Jakarta",
    createdAt: "2025-03-01T10:00:00.000Z",
    items: [
      {
        id: 1,
        name: "Wireless Headphones",
        qty: 2,
        price: 79.99,
        imageUrl:
          "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
      },
      {
        id: 2,
        name: "Sunglasses",
        qty: 1,
        price: 59.99,
        imageUrl:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
      },
    ],
  },
  {
    id: 1002,
    totalPrice: 149.99,
    status: "pending",
    paymentMethod: "Bank Transfer",
    address: "Jl. Gatot Subroto No. 5, Bandung",
    createdAt: "2025-03-10T14:30:00.000Z",
    items: [
      {
        id: 3,
        name: "Smart Watch",
        qty: 1,
        price: 149.99,
        imageUrl:
          "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
      },
    ],
  },
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending Payment",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    icon: <FaClock />,
  },
  paid: {
    label: "Paid",
    color: "text-green-500",
    bg: "bg-green-50",
    icon: <FaCheckCircle />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-500",
    bg: "bg-red-50",
    icon: <FaTimesCircle />,
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${config.color} ${config.bg}`}
    >
      {config.icon} {config.label}
    </span>
  );
}

function OrderCard({ order, isNew = false, onPay }) {
  const [expanded, setExpanded] = useState(isNew);
  const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`bg-white rounded-xl shadow transition-all duration-300 overflow-hidden ${isNew ? "ring-2 ring-orange-400" : ""}`}
    >
      {/* CARD HEADER */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 p-2.5 rounded-full text-orange-500">
            <FaReceipt />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Order #{order.id}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <p className="text-orange-500 font-bold text-sm">
            ${order.totalPrice.toFixed(2)}
          </p>
          <span className="text-gray-300 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* EXPANDED DETAIL */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-dashed border-gray-100 pt-4">
          {/* ITEMS */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Items
            </p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.qty} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 shrink-0">
                    ${(item.qty * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <FaCreditCard className="text-orange-400" /> Payment Method
              </p>
              <p className="text-sm font-semibold text-gray-700">
                {order.paymentMethod}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <FaMapMarkerAlt className="text-orange-400" /> Shipping Address
              </p>
              <p className="text-sm font-semibold text-gray-700 truncate">
                {order.address}
              </p>
            </div>
          </div>

          {/* PRICE BREAKDOWN */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${(order.totalPrice - 9.99).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>$9.99</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-dashed border-gray-200">
              <span>Total</span>
              <span className="text-orange-500">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* PAY BUTTON — hanya muncul kalau status pending */}
          {order.status === "pending" && (
            <button
              onClick={() => onPay(order)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              <FaCreditCard /> Pay Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const newOrder = location.state?.newOrder || null;

  // Gabungin new order (dari checkout) + riwayat lama
  const allOrders = newOrder ? [newOrder, ...dummyPastOrders] : dummyPastOrders;

  const handlePay = (order) => {
    // nanti disambungin ke Midtrans di sini
    // contoh: window.snap.pay(snapToken)
    alert(`Redirecting to Midtrans payment for Order #${order.id}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 pb-20">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full bg-white shadow hover:bg-orange-500 hover:text-white transition"
        >
          <FaArrowLeft className="text-sm" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          <p className="text-xs text-gray-400">
            {allOrders.length} orders found
          </p>
        </div>
      </div>

      {/* NEW ORDER LABEL */}
      {newOrder && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
            🎉 New Order
          </span>
        </div>
      )}

      {/* ORDER LIST */}
      <div className="space-y-4">
        {allOrders.map((order, index) => (
          <OrderCard
            key={order.id}
            order={order}
            isNew={index === 0 && !!newOrder}
            onPay={handlePay}
          />
        ))}
      </div>
    </div>
  );
}
