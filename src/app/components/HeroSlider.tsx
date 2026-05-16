"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mockHeroSlides } from "@/lib/mock/dummyData";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === mockHeroSlides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === mockHeroSlides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? mockHeroSlides.length - 1 : prev - 1));

  return (
    <div 
      className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 flex flex-col md:flex-row max-w-7xl mx-auto px-6 items-center pt-24 pb-12 md:py-0"
        >
          {/* Left half */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center h-full z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border-soft mb-6 shadow-sm">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-text-muted">Featured</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-text-primary leading-tight mb-6 tracking-tight">
              {mockHeroSlides[currentSlide].headline.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "text-primary" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>
            
            <p className="text-lg text-text-muted mb-8 max-w-md">
              {mockHeroSlides[currentSlide].subtext}
            </p>
            
            <Link 
              href={mockHeroSlides[currentSlide].ctaLink}
              className="px-8 py-3.5 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              {mockHeroSlides[currentSlide].ctaText}
            </Link>
          </div>

          {/* Right half */}
          <div className="hidden md:flex w-full md:w-1/2 h-full relative items-center justify-center p-8 z-10">
             <div className="relative w-full aspect-square max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
               <Image 
                 src={mockHeroSlides[currentSlide].image}
                 alt={mockHeroSlides[currentSlide].headline}
                 fill
                 className="object-cover"
               />
               {currentSlide === 0 && (
                 <div className="absolute bottom-6 left-6 bg-surface rounded-2xl px-5 py-3 shadow-lg font-bold text-primary text-xl">
                   $49.99
                 </div>
               )}
             </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
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

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {mockHeroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? "bg-primary w-8" : "bg-primary/30"}`}
          />
        ))}
      </div>
    </div>
  );
}