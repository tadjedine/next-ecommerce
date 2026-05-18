"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ApiProduct } from "@/lib/api";
import { HoverLift } from "./motion/HoverLift";
import { Heart, ImageOff, Check, Loader2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function ProductCard({ product }: { product: ApiProduct }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Get the cover image URL, falling back through available sources
  const imageUrl =
    product.cover_image?.urls?.home ||
    product.cover_image?.url ||
    (product.images && product.images.length > 0 ? product.images[0]?.urls?.home || product.images[0]?.url : null);

  const hasImage = !!imageUrl;

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
          Promo
        </div>
      )}

      {/* Wishlist Icon */}
      <button className="absolute top-5 right-5 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-500 text-text-muted">
        <Heart size={18} />
      </button>

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] w-full overflow-hidden bg-bg-base rounded-xl">
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
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
            <div className="flex items-center text-xs text-text-muted gap-1 ml-2 shrink-0 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
              In Stock
            </div>
          ) : (
            <div className="flex items-center text-xs gap-1 ml-2 shrink-0 bg-red-50 text-red-500 px-2 py-1 rounded-lg">
              Out of Stock
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
          <><Loader2 size={16} className="animate-spin" /> Adding...</>
        ) : added ? (
          <><Check size={16} /> Added!</>
        ) : product.quantity > 0 ? (
          "Add to Cart"
        ) : (
          "Unavailable"
        )}
      </button>
    </HoverLift>
  );
}