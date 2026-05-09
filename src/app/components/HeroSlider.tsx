"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockHeroSlides } from "@/lib/mock/dummyData";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockHeroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-orange-50">
      {mockHeroSlides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* Split layout to match your design image exactly */}
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-8 md:pl-24 text-center md:text-left h-1/2 md:h-full z-20">
              <p className="text-lg md:text-xl mb-4 text-gray-700">{slide.subtext}</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">{slide.headline}</h2>
              <Link href={slide.ctaLink} className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
                {slide.ctaText}
              </Link>
            </div>
            <div className="w-full md:w-1/2 relative h-1/2 md:h-full">
              <Image src={slide.image} alt={slide.headline} fill className="object-cover object-center" priority={index === 0} sizes="50vw" />
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {mockHeroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full border-2 border-black transition-colors ${index === currentSlide ? "bg-black" : "bg-transparent"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}