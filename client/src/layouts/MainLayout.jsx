import { Outlet } from "react-router";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("");

  // 🔥 ADD THIS
  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setSort("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <Navbar
        onSearch={setSearch}
        onCategory={setCategory}
        onBrand={setBrand}
        onSort={setSort}
        onReset={resetFilters}
      />

      {/* CONTENT */}
      <main className="flex-1">
        <Outlet context={{ search, category, brand, sort }} />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
