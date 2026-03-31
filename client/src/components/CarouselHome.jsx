import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    id: 1,
    title: "Spring Fashion Sale",
    subtitle: "Up to 50% off on top brands — today only!",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  },
  {
    id: 2,
    title: "Electronics Deals",
    subtitle: "Latest gadgets with best price",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    id: 3,
    title: "Accessories Collection",
    subtitle: "Upgrade your style today",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
];

export default function CarouselHome() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full h-100 rounded-2xl overflow-hidden">
      {/* IMAGE */}
      <img src={slides[current].image} className="w-full h-full object-cover" />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-r from-orange-500/70 to-purple-500/40" />

      {/* TEXT */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white">
        <h2 className="text-3xl font-bold mb-2">{slides[current].title}</h2>
        <p className="mb-4">{slides[current].subtitle}</p>
        <button className="bg-white text-orange-500 px-4 py-2 rounded-full">
          Shop Now →
        </button>
      </div>

      {/* BUTTONS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
