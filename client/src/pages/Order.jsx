import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaReceipt,
} from "react-icons/fa";
import api from "../api/api";
import Swal from "sweetalert2";

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
  failed: {
    label: "Failed",
    color: "text-red-500",
    bg: "bg-red-50",
    icon: <FaTimesCircle />,
  },
};

const handlePay = async (order) => {
  try {
    const { data } = await api.post(
      `/orders/${order.id}/pay`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    const snapToken = data.snapToken;

    window.snap.pay(snapToken, {
      onSuccess: async function (result) {
        await Swal.fire({
          icon: "success",
          title: "Payment success",
          text: "Your payment was completed successfully.",
          confirmButtonColor: "#f97316",
        });
        console.log(result);
        window.location.reload();
      },
      onPending: function (result) {
        Swal.fire({
          icon: "info",
          title: "Payment pending",
          text: "Your payment is still being processed.",
          confirmButtonColor: "#f97316",
        });
        console.log(result);
      },
      onError: function (result) {
        Swal.fire({
          icon: "error",
          title: "Payment failed",
          text: "There was a problem while processing your payment.",
          confirmButtonColor: "#f97316",
        });
        console.log(result);
      },
      onClose: function () {
        Swal.fire({
          icon: "warning",
          title: "Payment popup closed",
          text: "You closed the payment window before finishing.",
          confirmButtonColor: "#f97316",
        });
      },
    });
  } catch (error) {
    console.error("Payment error:", error);
  }
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

const handleCancelOrder = async (orderId) => {
  // Kita pindahkan ke komponen utama agar state-nya terjaga
};

function OrderCard({ order, isNew = false, onPay, onCancel }) {
  const [expanded, setExpanded] = useState(isNew);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Fetch order detail (items) saat expanded
  useEffect(() => {
    if (!expanded || items.length > 0) return;
    const fetchDetail = async () => {
      try {
        setLoadingItems(true);
        const { data } = await api.get(`/orders/${order.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setItems(data.OrderItems || []);
      } catch (err) {
        console.error("Failed to fetch order detail:", err);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchDetail();
  }, [expanded]);

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
            Rp {Number(order.totalPrice).toLocaleString("id-ID")}
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
            {loadingItems ? (
              <p className="text-xs text-gray-400">Loading items...</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.Product?.imageUrl}
                      alt={item.Product?.name}
                      className="w-11 h-11 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.Product?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.qty} × Rp{" "}
                        {Number(item.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 shrink-0">
                      Rp {Number(item.subtotal).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
              <p className="text-xs text-gray-400 mb-1">Payment Status</p>
              <p className="text-sm font-semibold text-gray-700 capitalize">
                {order.Payment?.status || "-"}
              </p>
            </div>
          </div>

          {/* PRICE BREAKDOWN */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span className="text-orange-500">
                Rp {Number(order.totalPrice).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {order.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onCancel(order.id); }}
                className="flex-1 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <FaTimesCircle /> Cancel
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onPay(order); }}
                className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <FaCreditCard /> Pay Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderId, setNewOrderId] = useState(
    // tangkap newOrderId dari sessionStorage kalau baru checkout
    sessionStorage.getItem("newOrderId") || null,
  );

  // State untuk modal konfirmasi pembatalan
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
        sessionStorage.removeItem("newOrderId"); // hapus setelah dipakai
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await api.patch(
        `/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      // Update local state instead of reload for smoother feel
      setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: 'failed'} : o));
      setShowCancelModal(false);
      setSelectedOrderToCancel(null);
    } catch (error) {
      console.error("Cancel error:", error);
      Swal.fire({
        icon: "error",
        title: "Cancel failed",
        text: error.response?.data?.message || "Failed to cancel order",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const openCancelModal = (orderId) => {
    setSelectedOrderToCancel(orderId);
    setShowCancelModal(true);
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
          <p className="text-xs text-gray-400">{orders.length} orders found</p>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-24">
          <p className="text-gray-400 text-sm">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FaReceipt className="text-5xl text-gray-200 mb-4" />
          <p className="text-gray-500 font-semibold">No orders yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Start shopping to see your orders here!
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-5 bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-orange-600 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              isNew={String(order.id) === String(newOrderId)}
              onPay={handlePay}
              onCancel={openCancelModal} // Pass function down
            />
          ))}
        </div>
      )}

      {/* CUSTOM CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-in-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-orange-400"></div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-50 p-4 rounded-full text-red-500 mb-4 animate-bounce">
                <FaTimesCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cancel Order?</h3>
              <p className="text-sm text-gray-500 mb-8 px-2">
                Are you sure you want to cancel **#Order {selectedOrderToCancel}**? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 rounded-2xl transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={() => handleCancelOrder(selectedOrderToCancel)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
