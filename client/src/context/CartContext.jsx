import { createContext, useContext, useState } from "react";
import { FaBell } from "react-icons/fa";
import api from "../api/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // FETCH cart dari database
  const fetchCart = async () => {
    try {
      const { data } = await api.get("/carts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      // mapping data dari backend ke struktur yang dipakai frontend
      const mapped = data.map((item) => ({
        id: item.id,
        productId: item.ProductId,
        qty: item.qty,
        name: item.Product.name,
        price: item.Product.price,
        imageUrl: item.Product.imageUrl,
        description: item.Product.description || "",
        category: item.Product.Category?.name || "",
      }));

      setCartItems(mapped);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // ADD produk ke cart → POST /carts
  const addToCart = async (product) => {
    try {
      await api.post(
        "/carts",
        { ProductId: product.id, qty: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      showToast(`${product.name} added to cart!`);
      fetchCart(); // refresh cart dari DB
    } catch (err) {
      console.error("Failed to add to cart:", err);
      // Check for backend error message
      const msg = err.response?.data?.message || "Failed to add item 😢";
      showToast(msg);
    }
  };

  // UPDATE qty → PUT /carts/:id
  const updateQty = async (id, newQty) => {
    try {
      await api.put(
        `/carts/${id}`,
        { qty: newQty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      fetchCart(); // refresh cart dari DB
    } catch (err) {
      console.error("Failed to update qty:", err);
      const msg = err.response?.data?.message || "Failed to update qty";
      showToast(msg);
    }
  };

  // DELETE item → DELETE /carts/:id
  const deleteItem = async (id) => {
    try {
      await api.delete(`/carts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      fetchCart(); // refresh cart dari DB
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  // CLEAR CART (local only, sesuaikan kalau ada endpoint-nya)
  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        deleteItem,
        clearCart,
        fetchCart,
        totalItems,
      }}
    >
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-orange-500 text-white text-sm font-semibold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce whitespace-nowrap">
          <FaBell className="text-white text-lg" />
          {toast}
        </div>
      )}
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
