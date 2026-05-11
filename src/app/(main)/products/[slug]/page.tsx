"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { mockCatalogProducts, mockReviews } from "@/lib/mock/dummyData";
import { FadeUpOnScroll } from "../../../components/motion/FadeUpOnScroll";
import ProductCard from "../../../components/ProductCard";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = mockCatalogProducts.find(p => p.slug === params.slug) || mockCatalogProducts[0];
  const allImages = product.images ? [product.image, ...product.images] : [product.image];
  
  const [activeImage, setActiveImage] = useState(allImages[0]);
  const [selectedColor, setSelectedColor] = useState(product.variants?.colors?.[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState(product.variants?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");

  const related = mockCatalogProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-surface min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Gallery & Info */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          
          {/* Left: Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-bg-base border border-border-soft">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 bg-accent text-white px-3 py-1 text-sm font-bold rounded-full uppercase tracking-wider shadow-md">
                  {product.badge}
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image src={activeImage} alt={product.name} fill className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="text-sm font-medium text-text-muted mb-4">
              Home / Shop / {product.category} / {product.name}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={i < Math.floor(product.rating) ? 0 : 2} />
                ))}
              </div>
              <span className="text-text-muted text-sm font-medium hover:underline cursor-pointer">
                {product.review_count} Reviews
              </span>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-extrabold text-primary">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-lg text-text-muted line-through">${product.original_price.toFixed(2)}</span>
              )}
            </div>
            
            <p className="text-text-muted text-lg mb-8 leading-relaxed">
              {product.description}
            </p>
            
            {/* Color Picker */}
            {product.variants?.colors && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-text-primary">Color: <span className="font-medium text-text-muted">{selectedColor}</span></span>
                </div>
                <div className="flex gap-3">
                  {product.variants.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === c.name ? "border-primary ring-2 ring-primary/30 scale-110" : "border-border-soft hover:scale-110"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Picker */}
            {product.variants?.sizes && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-text-primary">Size: <span className="font-medium text-text-muted">{selectedSize}</span></span>
                  <span className="text-sm text-primary font-medium hover:underline cursor-pointer">Size Guide</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {product.variants.sizes.map((s) => {
                    const inStock = product.stock_status ? product.stock_status[`${selectedColor}-${s}`] !== false : true;
                    return (
                      <button
                        key={s}
                        disabled={!inStock}
                        onClick={() => setSelectedSize(s)}
                        className={`py-3 rounded-xl border font-semibold transition-all ${
                          !inStock ? "border-border-soft text-text-muted line-through opacity-40 cursor-not-allowed" 
                          : selectedSize === s ? "border-primary bg-primary text-white shadow-md" 
                          : "border-border-soft text-text-primary hover:border-primary"
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border-soft rounded-full h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center font-bold text-text-primary">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.97 }}
                className="flex-1 h-14 bg-primary text-white rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
              >
                <ShoppingBag size={20} /> Add to Cart
              </motion.button>
              
              <button className="w-14 h-14 rounded-full border border-border-soft flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0">
                <Heart size={20} />
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-t border-border-soft text-xs font-semibold text-text-muted">
              <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-primary"/> Secure Payment</div>
              <div className="flex items-center gap-2"><Truck size={18} className="text-primary"/> Free Shipping</div>
              <div className="flex items-center gap-2"><RefreshCw size={18} className="text-primary"/> 30-Day Returns</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex items-center gap-8 border-b border-border-soft mb-8 overflow-x-auto scrollbar-hide">
            {["Description", "Shipping & Returns", `Reviews (${product.review_count})`].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-lg font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab ? "text-primary" : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="pdp-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
          
          <div className="min-h-[200px]">
            {activeTab === "Description" && (
              <div className="text-text-muted text-lg leading-relaxed max-w-3xl">
                {product.description}
                {product.attributes && (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b border-border-soft pb-2">
                        <span className="font-semibold text-text-primary">{key}</span>
                        <span className="text-text-muted">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "Shipping & Returns" && (
              <div className="text-text-muted text-lg leading-relaxed max-w-3xl">
                <p className="mb-4"><strong className="text-text-primary">Free Standard Shipping:</strong> 3-5 business days.</p>
                <p className="mb-4"><strong className="text-text-primary">Express Shipping:</strong> 1-2 business days ($15.00).</p>
                <p><strong className="text-text-primary">Returns:</strong> We accept returns within 30 days of delivery. Items must be unworn and unwashed with tags attached.</p>
              </div>
            )}
            
            {activeTab.startsWith("Reviews") && (
              <div className="space-y-6 max-w-3xl">
                {mockReviews.map(r => (
                  <div key={r.id} className="p-6 rounded-2xl border border-border-soft bg-surface flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center sm:items-start shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-bg-base relative mb-2">
                        <Image src={`https://ui-avatars.com/api/?name=${r.author}&background=2B7FFF&color=fff`} alt={r.author} fill />
                      </div>
                      <span className="font-bold text-text-primary">{r.author}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex gap-1 text-accent">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={i < r.rating ? 0 : 2} />
                          ))}
                        </div>
                        <span className="text-sm text-text-muted">{r.date}</span>
                      </div>
                      <p className="text-text-muted leading-relaxed">"{r.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <FadeUpOnScroll>
            <h2 className="text-3xl font-extrabold text-text-primary mb-8">You Might Also Like</h2>
            <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-8 snap-x snap-mandatory">
              {related.map(p => (
                <div key={p.id} className="w-[280px] sm:w-[300px] shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </FadeUpOnScroll>
        )}
        
      </div>
    </div>
  );
}
