import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import api from "../api/api";
import CarouselHome from "../components/CarouselHome";
import CardHome from "../components/CardHome";
import Pagination from "../components/Pagination";
import ProductDetail from "../components/ProductDetail";

export default function Home() {
  // 🔥 GET FILTER STATE FROM NAVBAR (via MainLayout)
  const { search, category, brand, sort } = useOutletContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const limit = 10;

  // 🔥 FETCH PRODUCTS WITH FILTER
  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products", {
        params: {
          page: currentPage,
          limit,
          search,
          category,
          brand,
          sort,
        },
      });

      setProducts(data.data);
      setTotalPages(data.totalPage);
      setTotalData(data.totalData);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 FETCH DETAIL (MODAL)
  const handleViewDetail = async (id) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setSelectedProduct(data);
      setShowModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 FETCH WHEN PAGE OR FILTER CHANGES
  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, category, brand, sort]);

  // 🔥 RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, brand, sort]);

  return (
    <div className="px-6 py-4 space-y-6 pb-16">
      <CarouselHome />

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">All Products</h2>
        <p className="text-sm text-gray-400">{totalData} products found</p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-5 gap-6">
        {products.map((product) => (
          <CardHome
            key={product.id}
            product={product}
            onView={handleViewDetail}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" }); // UX upgrade
        }}
      />

      {/* MODAL */}
      {showModal && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
