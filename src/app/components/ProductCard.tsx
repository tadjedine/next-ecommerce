"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ApiProduct } from "@/lib/api";
import { HoverLift } from "./motion/HoverLift";
import { Heart, ImageOff, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ProductCard({ product }: { product: ApiProduct }) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Carousel/Slider state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const minSwipeDistance = 50;

  // Collect all unique image URLs for the slider
  const images = useMemo(() => {
    if (!product.images || product.images.length === 0) {
      const coverUrl = product.cover_image?.urls?.home || product.cover_image?.url;
      return coverUrl ? [coverUrl] : [];
    }
    // Sort to place cover image first, then by position
    const coverId = product.cover_image?.id;
    const sortedImages = [...product.images].sort((a, b) => {
      if (a.id === coverId) return -1;
      if (b.id === coverId) return 1;
      return a.position - b.position;
    });
    return sortedImages.map((img) => img.urls?.home || img.url);
  }, [product.images, product.cover_image]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentClientX = e.targetTouches[0].clientX;
    if (Math.abs(touchStart - currentClientX) > 10) {
      setIsSwiping(true);
    }
    setTouchEnd(currentClientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (isRightSwipe) {
      setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isSwiping) {
      e.preventDefault();
    }
  };

  const handleAddToCart = async () => {
    if (adding || product.quantity <= 0) return;
    setAdding(true);
    try {
      await addItem(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <HoverLift className="group flex flex-col gap-3 relative bg-surface border border-border-soft rounded-2xl p-3 h-full">
      {/* Sale Badge */}
      {product.on_sale && (
        <div className="absolute top-5 left-5 z-10 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
          {t("product.promo")}
        </div>
      )}

      {/* Wishlist Icon */}
      <button className="absolute top-5 right-5 z-10 p-2 bg-surface/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-500 text-text-muted">
        <Heart size={18} />
      </button>

      {/* Image */}
      <Link 
        href={`/products/${product.slug}`} 
        onClick={handleLinkClick}
        className="relative aspect-[4/5] w-full overflow-hidden bg-bg-base rounded-xl group/image"
      >
        {images.length > 0 ? (
          <>
            <div 
              className="w-full h-full relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={images[currentIdx]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover/image:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority={currentIdx === 0}
              />
            </div>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-surface/30 dark:bg-black/30 backdrop-blur-md rounded-full text-text-primary border border-border-soft hover:bg-primary hover:text-white transition-all shadow-sm opacity-0 group-hover/image:opacity-100 z-10"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-surface/30 dark:bg-black/30 backdrop-blur-md rounded-full text-text-primary border border-border-soft hover:bg-primary hover:text-white transition-all shadow-sm opacity-0 group-hover/image:opacity-100 z-10"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIdx(idx);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      currentIdx === idx 
                        ? "bg-primary w-3" 
                        : "bg-white/60 dark:bg-black/40 hover:bg-white/95"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
            <ImageOff size={32} className="mb-2 opacity-40" />
            <span className="text-xs opacity-60">No image</span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-col gap-2 mt-2 flex-grow">
        <div className="flex justify-between items-start">
          <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-text-primary hover:text-primary line-clamp-1 transition-colors">
            {product.name}
          </Link>
          {product.quantity > 0 ? (
            <div className="flex items-center text-xs gap-1 ml-2 shrink-0 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg">
              {t("product.in_stock")}
            </div>
          ) : (
            <div className="flex items-center text-xs gap-1 ml-2 shrink-0 bg-red-500/10 text-red-500 px-2 py-1 rounded-lg">
              {t("product.out_of_stock")}
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center mt-auto pt-1">
          <span className="font-bold text-primary">{product.price.toFixed(2)} €</span>
        </div>
      </div>

      {/* Add to Cart CTA */}
      <button
        onClick={handleAddToCart}
        className={`w-full mt-2 py-2.5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          added
            ? "bg-emerald-500 text-white"
            : "bg-bg-base text-primary hover:bg-primary hover:text-white"
        }`}
        disabled={product.quantity <= 0 || adding}
      >
        {adding ? (
          <><Loader2 size={16} className="animate-spin" /> {t("cart.adding")}</>
        ) : added ? (
          <><Check size={16} /> {t("cart.added")}</>
        ) : product.quantity > 0 ? (
          t("cart.add")
        ) : (
          t("cart.unavailable")
        )}
      </button>
    </HoverLift>
  );
}