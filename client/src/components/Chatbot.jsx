import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { BsChatDots, BsX, BsSend, BsImage } from "react-icons/bs";

// Sambungkan ke URL server backend Anda. (Jika dipush ke production, ganti / sesuaikan dengan env)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
const socket = io(SOCKET_URL);

export default function Chatbot() {
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

  // Ambil user ID, untuk amannya saat diimplementasi sesungguhnya ambil dari Redux/Local Storage
  const userId = 1; 

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
  }, []);

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
      imageUrl: imagePreview || null 
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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 rounded-full shadow-[0_10px_25px_-5px_rgba(249,115,22,0.4)] hover:shadow-lg transition-all z-50 transform hover:scale-105"
      >
        {isOpen ? <BsX size={26} /> : <BsChatDots size={26} />}
      </button>

      {/* Jendela Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[90vw] h-[550px] bg-base-100 shadow-2xl rounded-2xl flex flex-col z-50 border border-base-300 overflow-hidden transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 font-bold flex justify-between items-center shadow-sm">
            <span className="flex items-center gap-2">
              <BsChatDots size={18} /> AI Assistant
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-base-300 transition-colors"
            >
              <BsX size={24} />
            </button>
          </div>

          {/* Konten Chat */}
          <div className="flex-1 p-4 overflow-y-auto bg-base-200/50 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={"chat " + (msg.sender === "user" ? "chat-end" : "chat-start")}
              >
                <div
                  className={
                    "chat-bubble shadow-sm " +
                    (msg.sender === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-white border border-gray-100 text-gray-800")
                  }
                >
                  {/* Render gambar jika ada */}
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="user upload" 
                      className="max-w-[200px] max-h-48 object-cover rounded-xl mt-2 mb-2 shadow-sm"
                    />
                  )}
                  {msg.text && <p className="whitespace-pre-line text-sm">{msg.text}</p>}
                </div>

                {/* Kontainer Produk Jika AI Membawakan Hasil */}
                {msg.products && msg.products.length > 0 && (
                  <div className="chat-footer mt-2">
                    <div className="flex flex-col gap-2 w-64 max-w-[80vw]">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="card bg-base-100 shadow-md border border-base-200 overflow-hidden"
                        >
                          {prod.image ? (
                            <figure className="h-32 bg-base-300">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </figure>
                          ) : null}
                          <div className="p-3 text-left">
                            <h2 className="font-semibold text-sm line-clamp-1">{prod.name}</h2>
                            <p className="text-orange-500 font-bold text-sm my-1">
                              Rp {prod.price.toLocaleString("id-ID")}
                            </p>
                            <button
                              onClick={() => handleAddToCart(prod.id)}
                              className="btn btn-sm w-full mt-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-none hover:opacity-90"
                            >
                              Add to Cart
                            </button>
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
                <div className="chat-bubble bg-base-100 shadow-sm text-base-content flex items-center gap-1">
                  <span className="loading loading-dots loading-sm mt-1"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Container */}
          <div className="bg-base-100 border-t border-base-300 flex flex-col p-2">
            
            {/* Tampilkan Preview Jika ada yang diupload */}
            {imagePreview && (
              <div className="relative mb-2 self-start bg-base-200 p-2 rounded-xl">
                <img src={imagePreview} className="h-16 w-16 object-cover rounded-md shadow-sm" alt="Preview"/>
                <button 
                  onClick={() => {
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 hover:scale-110"
                >
                  <BsX size={14} />
                </button>
              </div>
            )}

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2"
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
                className="btn btn-ghost btn-circle btn-sm h-10 w-10 shrink-0 text-base-content"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <BsImage size={18} />
              </button>

              <input
                type="text"
                placeholder="Tanya produk..."
                className="input input-sm input-bordered flex-1 rounded-full px-4 h-10"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              
              <button
                type="submit"
                className="btn btn-circle btn-sm h-10 w-10 shrink-0 bg-orange-500 text-white border-none hover:bg-orange-600 disabled:bg-gray-200"
                disabled={!input.trim() && !imagePreview}
              >
                <BsSend size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
