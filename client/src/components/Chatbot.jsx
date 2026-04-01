import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { BsChatDots, BsX, BsSend, BsImage, BsRobot } from "react-icons/bs";

import { useCart } from "../context/CartContext";

// Sambungkan ke URL server backend Anda. (Jika dipush ke production, ganti / sesuaikan dengan env)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
const socket = io(SOCKET_URL);

export default function Chatbot() {
  const { fetchCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Halo! ✨ Saya asisten AI E-Commerce. Ada yang bisa saya bantu cari?",
    },
  ]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Ambil user ID dari JWT token di local storage
  const token = localStorage.getItem("access_token");
  let userId = null;
  if (token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      userId = JSON.parse(jsonPayload).id;
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  }

  useEffect(() => {
    // Event typing indicator dari server
    socket.on("chat:typing", () => {
      setIsTyping(true);
    });

    // Event ketika AI merespon dengan text dan produk
    socket.on("chat", (data) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.message,
          products: data.products || [],
        },
      ]);
    });

    // Event ketika berhasil atau gagal menambahkan barang ke keranjang
    socket.on("cart", (data) => {
      // 🔥 REFRESH KERANJANG DI UI JIKA BERHASIL
      if (data.success) {
        fetchCart();
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.message, // "Produk ditambahkan ke keranjang" / dsb
        },
      ]);
    });

    return () => {
      socket.off("chat:typing");
      socket.off("chat");
      socket.off("cart");
    };
  }, [fetchCart]);

  // Scroll otomatis ke bawah setiap kali ada pesan baru
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit 2MB for safe Base64 websocket transmission
        alert("Gambar tidak boleh lebih dari 2MB agar lebih ringan dikirim ya.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Save as Base64 Data URI
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && !imagePreview) return;

    // Tambahkan pesan user & gambar ke UI 
    setMessages((prev) => [...prev, { sender: "user", text: input, image: imagePreview }]);

    // Kirim pesan ke socket server. Socket bisa handle image Base64 lewat property imageUrl
    const payload = { 
      message: input.trim() || "Tolong carikan produk untuk gambar ini", 
      userId,
      imageUrl: imagePreview || null,
      chatHistory: messages.slice(-5).map(m => ({ sender: m.sender, text: m.text }))
    };
    socket.emit("chat", payload);
    
    setInput("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddToCart = (productId) => {
    socket.emit("cart", { productId, userId });
  };

  return (
    <>
      {/* Tombol Floating untuk Membuka Chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 bg-gradient-to-br from-orange-500 via-pink-500 to-rose-600 text-white p-4 rounded-full shadow-[0_10px_30px_-5px_rgba(249,115,22,0.5)] hover:shadow-2xl transition-all z-50 transform hover:scale-110 active:scale-95 ${!isOpen ? 'floating-btn-animate' : ''} group`}
        aria-label="Open support chat"
      >
        {isOpen ? (
          <BsX size={28} className="transition-transform group-hover:rotate-90" />
        ) : (
          <div className="relative">
            <BsChatDots size={28} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </div>
        )}
      </button>

      {/* Jendela Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[90vw] h-[600px] chatbot-glass chatbot-shadow rounded-3xl flex flex-col z-50 border border-white/20 overflow-hidden chat-animate-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500/90 to-pink-500/90 backdrop-blur-md text-white p-5 font-bold flex justify-between items-center shadow-lg border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-white/20 p-1 flex items-center justify-center">
                <img src="/assets/ai-bot.png" alt="AI" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-base tracking-wide">AI Concierge</span>
                <span className="text-[10px] uppercase font-medium opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1.5 rounded-lg transition-all"
            >
              <BsX size={26} />
            </button>
          </div>

          {/* Konten Chat */}
          <div className="flex-1 p-5 overflow-y-auto bg-transparent space-y-6 scrollbar-thin scrollbar-thumb-base-300">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={"chat " + (msg.sender === "user" ? "chat-end" : "chat-start")}
              >
                {msg.sender === "bot" && (
                  <div className="chat-image avatar">
                    <div className="w-8 h-8 rounded-full border border-orange-200">
                      <img src="/assets/ai-bot.png" alt="Bot" />
                    </div>
                  </div>
                )}
                
                <div
                  className={
                    "chat-bubble p-4 text-sm leading-relaxed shadow-sm " +
                    (msg.sender === "user"
                      ? "bg-gradient-to-br from-orange-500 to-pink-600 text-white message-bubble-user"
                      : "bg-white border border-gray-100 text-gray-700 font-medium message-bubble-bot")
                  }
                >
                  {/* Render gambar jika ada */}
                  {msg.image && (
                    <div className="relative group mb-3">
                      <img 
                        src={msg.image} 
                        alt="user upload" 
                        className="max-w-[220px] max-h-56 object-cover rounded-2xl shadow-md border-2 border-white/50"
                      />
                    </div>
                  )}
                  {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}
                </div>

                {/* Kontainer Produk Jika AI Membawakan Hasil */}
                {msg.products && msg.products.length > 0 && (
                  <div className="chat-footer mt-4 w-full">
                    <div className="flex flex-col gap-3 py-1">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="flex h-32">
                            {prod.image && (
                              <div className="w-1/3 overflow-hidden bg-gray-50 border-r border-gray-100">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                              </div>
                            )}
                            <div className={`p-3 flex flex-col justify-between ${prod.image ? 'w-2/3' : 'w-full'}`}>
                              <div>
                                <h2 className="font-bold text-gray-800 text-xs line-clamp-2 mb-1">{prod.name}</h2>
                                <p className="text-orange-500 font-extrabold text-sm">
                                  Rp {prod.price.toLocaleString("id-ID")}
                                </p>
                              </div>
                              <button
                                onClick={() => handleAddToCart(prod.id)}
                                className="mt-auto py-1.5 px-3 rounded-full bg-gray-900 text-white text-[10px] font-bold hover:bg-orange-500 transition-colors uppercase tracking-tight flex items-center justify-center gap-1"
                              >
                                Quick Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Animasi Typing / Loading */}
            {isTyping && (
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-8 h-8 rounded-full border border-orange-200">
                    <img src="/assets/ai-bot.png" alt="Bot" />
                  </div>
                </div>
                <div className="chat-bubble bg-white border border-gray-100 text-gray-500 py-3 px-5 message-bubble-bot flex items-center gap-1.5">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Container */}
          <div className="p-4 bg-white/60 backdrop-blur-md border-t border-gray-100 mt-auto">
            {/* Tampilkan Preview Jika ada yang diupload */}
            {imagePreview && (
              <div className="relative mb-3 inline-block">
                <div className="p-1.5 bg-white rounded-2xl shadow-xl border border-orange-100">
                  <img src={imagePreview} className="h-20 w-20 object-cover rounded-xl shadow-inner" alt="Preview"/>
                </div>
                <button 
                  onClick={() => {
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-600 hover:scale-110 active:scale-90 transition-all border-2 border-white"
                >
                  <BsX size={14} />
                </button>
              </div>
            )}

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 bg-white/80 p-1 rounded-full shadow-inner border border-gray-200 focus-within:ring-2 ring-orange-500/20 transition-all"
            >
              {/* Image Input Hidden */}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <button
                type="button"
                className="p-2.5 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-full transition-all"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                title="Upload Image"
              >
                <BsImage size={20} />
              </button>

              <input
                type="text"
                placeholder="Ask something about products..."
                className="bg-transparent border-none focus:ring-0 flex-1 py-2 px-1 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              
              <button
                type="submit"
                className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                   (input.trim() || imagePreview) 
                   ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:scale-105 active:scale-95' 
                   : 'bg-gray-100 text-gray-300'
                }`}
                disabled={!input.trim() && !imagePreview}
              >
                <BsSend size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
