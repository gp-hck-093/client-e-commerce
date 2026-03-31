import { useState } from "react";
import CarouselHome from "../components/CarouselHome";
import CardHome from "../components/CardHome";
import Pagination from "../components/Pagination";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  // TEMP DATA
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 79.99,
      qty: 42,
      description: "Premium headphones",
      imageUrl: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
    },
    {
      id: 2,
      name: "Running Sneakers",
      price: 94.99,
      qty: 85,
      description: "Lightweight shoes",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },
    {
      id: 3,
      name: "Smart Watch",
      price: 149.99,
      qty: 30,
      description: "Fitness tracking",
      imageUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    },
    {
      id: 4,
      name: "Leather Bag",
      price: 119.99,
      qty: 18,
      description: "Premium bag",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    },
    {
      id: 5,
      name: "Sunglasses",
      price: 59.99,
      qty: 20,
      description: "Stylish sunglasses",
      imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    },
    {
      id: 6,
      name: "Laptop Stand",
      price: 39.99,
      qty: 15,
      description: "Ergonomic stand",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    },
  ];

  // PAGINATION LOGIC (FRONTEND ONLY FOR NOW)
  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="px-6 py-4 space-y-6 pb-16">
      <CarouselHome />

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">All Products</h2>
        <p className="text-sm text-gray-400">
          {products.length} products found
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <CardHome key={product.id} product={product} />
        ))}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
