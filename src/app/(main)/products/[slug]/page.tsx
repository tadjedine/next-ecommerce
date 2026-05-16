"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, ImageOff, Loader2 } from "lucide-react";
import { mockReviews } from "@/lib/mock/dummyData";
import { FadeUpOnScroll } from "../../../components/motion/FadeUpOnScroll";
import ProductCard from "../../../components/ProductCard";
import { ApiProduct, ApiProductImage } from "@/lib/api";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch all products and find by slug (in future, add a slug endpoint)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/products?per_page=100`
        );
        const json = await res.json();
        const products = json.data as ApiProduct[];
        const found = products.find((p) => p.slug === slug) || products[0];

        if (found) {
          setProduct(found);

          // Fetch product images
          try {
            const imgRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/products/${found.id}/images`
            );
            const imgJson = await imgRes.json();
            const images = (imgJson.data as ApiProductImage[]).map(
              (img) => img.urls?.home || img.url
            );
            setAllImages(images.length > 0 ? images : []);
            setActiveImage(images[0] || "");
          } catch {
            // If images fetch fails, use cover image
            if (found.cover_image) {
              setAllImages([found.cover_image.urls?.home || found.cover_image.url]);
              setActiveImage(found.cover_image.urls?.home || found.cover_image.url);
            }
          }

          // Get related products (same category)
          const relatedProducts = products
            .filter((p) => p.category_id === found.category_id && p.id !== found.id)
            .slice(0, 4);
          setRelated(relatedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-surface min-h-screen pt-24 pb-24 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-surface min-h-screen pt-24 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-text-primary mb-4">Product Not Found</h1>
          <p className="text-text-muted">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Gallery & Info */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          
          {/* Left: Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-bg-base border border-border-soft">
              {product.on_sale && (
                <div className="absolute top-4 left-4 z-10 bg-accent text-white px-3 py-1 text-sm font-bold rounded-full uppercase tracking-wider shadow-md">
                  Promo
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
                  {activeImage ? (
                    <Image src={activeImage} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                      <ImageOff size={48} className="mb-2 opacity-40" />
                      <span className="text-sm opacity-60">No image available</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
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
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="text-sm font-medium text-text-muted mb-4">
              Home / Shop / {product.name}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              {product.quantity > 0 ? (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  ✓ In Stock ({product.quantity} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                  ✗ Out of Stock
                </span>
              )}
              {product.reference && (
                <span className="text-sm text-text-muted">Ref: {product.reference}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-extrabold text-primary">{product.price.toFixed(2)} €</span>
            </div>
            
            {product.description_short && (
              <div
                className="text-text-muted text-lg mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description_short }}
              />
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
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="w-12 h-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.97 }}
                disabled={product.quantity <= 0}
                className="flex-1 h-14 bg-primary text-white rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} /> Add to Cart
              </motion.button>
              
              <button className="w-14 h-14 rounded-full border border-border-soft flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0">
                <Heart size={20} />
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-t border-border-soft text-xs font-semibold text-text-muted">
              <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-primary"/> Paiement Sécurisé</div>
              <div className="flex items-center gap-2"><Truck size={18} className="text-primary"/> Livraison Gratuite</div>
              <div className="flex items-center gap-2"><RefreshCw size={18} className="text-primary"/> Retours 30 Jours</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex items-center gap-8 border-b border-border-soft mb-8 overflow-x-auto scrollbar-hide">
            {["Description", "Shipping & Returns", "Reviews"].map((tab) => (
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
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>No description available for this product.</p>
                )}
              </div>
            )}
            
            {activeTab === "Shipping & Returns" && (
              <div className="text-text-muted text-lg leading-relaxed max-w-3xl">
                <p className="mb-4"><strong className="text-text-primary">Livraison Standard Gratuite :</strong> 3-5 jours ouvrés.</p>
                <p className="mb-4"><strong className="text-text-primary">Livraison Express :</strong> 1-2 jours ouvrés (15,00 €).</p>
                <p><strong className="text-text-primary">Retours :</strong> Nous acceptons les retours sous 30 jours. Les articles doivent être en état neuf avec les étiquettes attachées.</p>
              </div>
            )}
            
            {activeTab === "Reviews" && (
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
                      <p className="text-text-muted leading-relaxed">&quot;{r.comment}&quot;</p>
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
