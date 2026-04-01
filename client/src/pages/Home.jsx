import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import api from "../api/api";
import CarouselHome from "../components/CarouselHome";
import CardHome from "../components/CardHome";
import SkeletonCard from "../components/SkeletonCard";
import ProductDetail from "../components/ProductDetail";
import { FaArrowDown } from "react-icons/fa";

export default function Home() {
  // 🔥 GET FILTER STATE FROM NAVBAR (via MainLayout)
  const { search, category, brand, sort } = useOutletContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const limit = 10;

  // 🔥 FETCH PRODUCTS WITH FILTER
  const fetchProducts = async (page = 1, isLoadMore = false) => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/products", {
        params: {
          page,
          limit,
          search,
          category,
          brand,
          sort,
        },
      });

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...data.data]);
      } else {
        setProducts(data.data);
      }

      setTotalPages(data.totalPage);
      setTotalData(data.totalData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
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
  // 🔥 INITIAL FETCH
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1, false);
  }, [search, category, brand, sort]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage, true);
  };


  return (
    <div className="px-6 py-4 space-y-6 pb-16">
      <CarouselHome />

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">All Products</h2>
        <p className="text-sm text-gray-400">{totalData} products found</p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <CardHome
            key={product.id}
            product={product}
            onView={handleViewDetail}
          />
        ))}

        {/* SKELETONS WHILE LOADING */}
        {isLoading &&
          [...Array(5)].map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
      </div>

      {/* LOAD MORE BUTTON */}
      {products.length > 0 && currentPage < totalPages && (
        <div className="flex justify-center py-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="group relative flex items-center gap-3 bg-white hover:bg-orange-50 text-orange-500 border-2 border-orange-100 hover:border-orange-500 px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-md text-orange-500"></span>
            ) : (
              <>
                <span className="tracking-wide">Load More Products</span>
                <FaArrowDown className="animate-bounce group-hover:translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}

      {/* FOOTER MESSAGE IF NO MORE PRODUCTS */}
      {products.length > 0 && currentPage >= totalPages && !isLoading && (
        <div className="text-center py-12 border-t border-dashed border-gray-100 mt-8">
          <p className="text-gray-400 font-medium tracking-tight">You've reached the end of our current catalog ✨</p>
        </div>
      )}

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
