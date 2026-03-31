import { useState, useEffect } from "react";
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
  {
    id: 4,
    title: "Streetwear Trends",
    subtitle: "Stay stylish with modern outfits",
    image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455",
  },
  {
    id: 5,
    title: "Gaming Essentials",
    subtitle: "Upgrade your gaming setup",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
  },
  {
    id: 6,
    title: "Minimal Lifestyle",
    subtitle: "Clean and simple design products",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  },
  {
    id: 7,
    title: "Smart Living",
    subtitle: "Make your home smarter",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827",
  },
];

export default function CarouselHome() {
  const [current, setCurrent] = useState(0);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden group">
      {/* 🔥 FADE SLIDES */}
      {slides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.image}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0"
          }`}
        />
      ))}

      {/* GRADIENT */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent z-20" />

      {/* TEXT */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white max-w-md z-30">
        <h2 className="text-4xl font-bold mb-3 leading-tight">
          {slides[current].title}
        </h2>
        <p className="text-sm text-gray-200">{slides[current].subtitle}</p>
      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full shadow opacity-0 group-hover:opacity-100 transition z-30"
      >
        <FaChevronLeft />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full shadow opacity-0 group-hover:opacity-100 transition z-30"
      >
        <FaChevronRight />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              current === i ? "bg-orange-500 scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
