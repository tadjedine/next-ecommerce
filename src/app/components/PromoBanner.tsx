"use client";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <div className="py-12 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll>
          <div className="flex flex-col md:flex-row bg-hero rounded-3xl overflow-hidden shadow-lg border border-border-soft">
            {/* Left 60% */}
            <div className="w-full md:w-[60%] p-12 md:p-20 flex flex-col items-start justify-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-6 leading-tight">
                Level up your style with our premium collection
              </h2>
              <p className="text-lg text-text-muted mb-10 max-w-md">
                Discover uncompromised quality and timeless designs crafted for everyday elegance.
              </p>
              <Link 
                href="/shop"
                className="px-8 py-4 bg-accent text-white rounded-full font-bold hover:bg-orange-600 transition-colors shadow-md"
              >
                Shop the Collection
              </Link>
            </div>

            {/* Right 40% */}
            <div className="w-full md:w-[40%] h-80 md:h-auto relative">
              <Image 
                src="/promo-cloth.png"
                alt="Premium fashion collection"
                fill
                className="object-cover"
              />
              <div className="absolute top-6 right-6 bg-accent text-white rounded-full px-4 py-2 text-sm font-bold shadow-lg transform rotate-3">
                Up to 50% OFF
              </div>
            </div>
          </div>
        </FadeUpOnScroll>
      </div>
    </div>
  );
}
