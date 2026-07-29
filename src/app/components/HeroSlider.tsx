"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSlides, ApiSlide } from "@/lib/api";

// Static fallback banner shown when API returns no slides or errors
function StaticBanner() {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-hero">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border-soft mb-6 shadow-sm">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-medium text-text-muted">Welcome</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-text-primary leading-tight mb-6 tracking-tight">
          Discover Our <span className="text-primary">Collection</span>
        </h1>
        <p className="text-lg text-text-muted mb-8 max-w-md">
          Browse our latest products and find something you love.
        </p>
        <Link
          href="/catalog"
          className="px-8 py-3.5 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
}

// Loading skeleton while slides are being fetched
function SliderSkeleton() {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-hero">
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin" />
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<ApiSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next (right-to-left), -1 = prev (left-to-right)
  const [isHovered, setIsHovered] = useState(false);

  // Fetch slides from the API on mount
  useEffect(() => {
    getSlides()
      .then((data) => setSlides(data))
      .catch((err) => {
        console.error("Failed to fetch slides:", err);
        setSlides([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  if (loading) return <SliderSkeleton />;
  if (slides.length === 0) return <StaticBanner />;

  const slide = slides[currentSlide];

  return (
    <div 
      className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ opacity: 0, x: direction * 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 80 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 flex flex-col md:flex-row max-w-7xl mx-auto px-6 items-center pt-24 pb-12 md:py-0"
        >
          {/* Left half */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center h-full z-10">
            {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border-soft mb-6 shadow-sm">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-text-muted">Featured</span>
            </div> */}
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-text-primary leading-tight mb-6 tracking-tight">
              {slide.title?.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "text-primary" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>
            
            <p className="text-lg text-text-muted mb-8 max-w-md">
              {slide.description}
            </p>
            
            <Link 
              href={slide.url || "/catalog"}
              className="px-8 py-3.5 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              SHOP NOW
            </Link>
          </div>

          {/* Right half */}
          <div className="hidden md:flex w-full md:w-1/2 h-full relative items-center justify-center p-8 z-10">
             {slide.image_url && (
               <div className="relative w-full aspect-square max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                 <Image 
                   src={slide.image_url}
                   alt={slide.title || "Slide image"}
                   fill
                   className="object-cover"
                 />
               </div>
             )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-text-primary flex items-center justify-center shadow-md backdrop-blur transition-all z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-text-primary flex items-center justify-center shadow-md backdrop-blur transition-all z-20"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? "bg-primary w-8" : "bg-primary/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}