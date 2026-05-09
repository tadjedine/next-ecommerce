import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/mock/dummyData"; // To be deleted

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col gap-3 relative">
      {/* Badges */}
      {product.badge && (
        <div className="absolute top-2 left-2 z-10 bg-black text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
          {product.badge}
        </div>
      )}
      
      {/* Wishlist Icon (Mock) */}
      <button className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      </button>

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <Link href={`/product/${product.slug}`} className="text-sm font-medium hover:underline line-clamp-1">
            {product.name}
          </Link>
          <div className="flex items-center text-xs text-gray-500 gap-1 ml-2 shrink-0">
            ★ {product.rating} <span className="hidden sm:inline">({product.review_count})</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          {product.original_price && (
            <span className="text-sm text-gray-400 line-through">${product.original_price.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Add to Cart CTA */}
      <button className="w-full py-2.5 border border-black text-sm font-medium transition-colors hover:bg-black hover:text-white">
        Add to Cart
      </button>
    </div>
  );
}