"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, ImageOff, Loader2, Check } from "lucide-react";
import { mockReviews } from "@/lib/mock/dummyData";
import { FadeUpOnScroll } from "../../../components/motion/FadeUpOnScroll";
import ProductCard from "../../../components/ProductCard";
import VariantSelector from "../../../components/product/VariantSelector";
import { ApiProduct, ApiProductImage, ApiCombination } from "@/lib/api";
import { useParams } from "next/navigation";
import { useCart } from "@/lib/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [imageMap, setImageMap] = useState<Record<number, string>>({}); // id_image → url
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  // Combination selection state
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, number>>({});

  const hasCombinations = !!(product?.combinations && product.combinations.length > 0);

  // Find the combination matching current selections
  const selectedCombination = useMemo<ApiCombination | null>(() => {
    if (!hasCombinations || !product?.combinations || !product?.attribute_groups) return null;
    // Only look for a match when all groups have been selected
    const allGroupsSelected = product.attribute_groups.every(
      (g) => selectedAttributes[g.name] !== undefined
    );
    if (!allGroupsSelected) return null;

    return (
      product.combinations.find((combo) =>
        Object.entries(selectedAttributes).every(
          ([groupName, attrId]) => combo.attributes[groupName]?.id === attrId
        )
      ) || null
    );
  }, [hasCombinations, product, selectedAttributes]);

  // Derived values based on combination selection
  const displayPrice = selectedCombination ? selectedCombination.final_price : product?.price ?? 0;
  const displayQuantity = selectedCombination ? selectedCombination.quantity : product?.quantity ?? 0;
  const displayReference = selectedCombination?.reference || product?.reference;
  const canAddToCart = hasCombinations ? (selectedCombination !== null && displayQuantity > 0) : displayQuantity > 0;
  const needsSelection = hasCombinations && !selectedCombination;

  // Initialize default combination selection
  useEffect(() => {
    if (product?.combinations && product?.attribute_groups) {
      const defaultCombo = product.combinations.find((c) => c.is_default) || product.combinations[0];
      if (defaultCombo) {
        const defaults: Record<string, number> = {};
        for (const [groupName, attr] of Object.entries(defaultCombo.attributes)) {
          defaults[groupName] = attr.id;
        }
        setSelectedAttributes(defaults);
      }
    }
  }, [product?.combinations, product?.attribute_groups]);

  // Update active image when combination changes (if combo has specific images)
  useEffect(() => {
    if (selectedCombination && selectedCombination.image_ids.length > 0 && Object.keys(imageMap).length > 0) {
      const comboImageUrl = imageMap[selectedCombination.image_ids[0]];
      if (comboImageUrl) {
        setActiveImage(comboImageUrl);
      }
    }
  }, [selectedCombination, imageMap]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch all products list to find by slug
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/products?per_page=100`
        );
        const json = await res.json();
        const products = json.data as ApiProduct[];
        const found = products.find((p) => p.slug === slug) || products[0];

        if (found) {
          // Fetch full product detail (with combinations) by ID
          const detailRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/products/${found.id}`,
            { headers: { Accept: "application/json" } }
          );
          const detailJson = await detailRes.json();
          const fullProduct = detailJson.data as ApiProduct;
          setProduct(fullProduct);

          // Fetch product images
          try {
            const imgRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/products/${found.id}/images`
            );
            const imgJson = await imgRes.json();
            const imageData = imgJson.data as ApiProductImage[];
            const images = imageData.map(
              (img) => img.urls?.home || img.url
            );
            // Build id → url mapping for combination image switching
            const idToUrl: Record<number, string> = {};
            imageData.forEach((img) => {
              idToUrl[img.id] = img.urls?.home || img.url;
            });
            setImageMap(idToUrl);
            setAllImages(images.length > 0 ? images : []);
            setActiveImage(images[0] || "");
          } catch {
            // If images fetch fails, use cover image
            if (fullProduct.cover_image) {
              setAllImages([fullProduct.cover_image.urls?.home || fullProduct.cover_image.url]);
              setActiveImage(fullProduct.cover_image.urls?.home || fullProduct.cover_image.url);
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

  const handleAttributeChange = (groupName: string, attrId: number) => {
    setSelectedAttributes((prev) => ({ ...prev, [groupName]: attrId }));
    setQuantity(1); // Reset quantity when variant changes
  };

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
    <div className="bg-surface min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Top Section: Gallery & Info */}
        <div className="flex flex-col lg:flex-row gap-16 mb-20">
          
          {/* Left: Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-bg-base border border-border-soft">
              {product.on_sale && (
                <div className="absolute top-4 left-4 z-10 bg-accent text-white px-3 py-1 text-sm font-bold rounded-full uppercase tracking-wider shadow-md">
                  Sale
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
          <div className="w-full lg:w-1/2 flex flex-col max-w-[520px]">
            <div className="text-sm font-medium text-text-muted mb-4">
              Home / Shop / {product.name}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              {displayQuantity > 0 ? (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  ✓ In Stock ({displayQuantity} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                  ✗ Out of Stock
                </span>
              )}
              {displayReference && (
                <span className="text-sm text-text-muted">Ref: {displayReference}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-extrabold text-primary">{displayPrice.toFixed(2)} €</span>
              {selectedCombination && selectedCombination.price_impact !== 0 && (
                <span className="text-sm text-text-muted line-through">{product.price.toFixed(2)} €</span>
              )}
            </div>
            
            {product.description_short && (
              <div
                className="text-text-muted text-lg mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description_short }}
              />
            )}

            {/* Variant Selectors */}
            {hasCombinations && product.attribute_groups && product.combinations && (
              <div className="mb-8">
                <VariantSelector
                  attributeGroups={product.attribute_groups}
                  combinations={product.combinations}
                  selectedAttributes={selectedAttributes}
                  onAttributeChange={handleAttributeChange}
                />
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
                  onClick={() => setQuantity(Math.min(displayQuantity, quantity + 1))}
                  className="w-12 h-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.97 }}
                disabled={!canAddToCart || addingToCart}
                onClick={async () => {
                  if (addingToCart) return;
                  setAddingToCart(true);
                  try {
                    const attrId = selectedCombination?.id ?? 0;
                    await addItem(product.id, quantity, attrId);
                    setAddedToCart(true);
                    setQuantity(1);
                    setTimeout(() => setAddedToCart(false), 2000);
                  } catch (err) {
                    console.error("Failed to add to cart:", err);
                  } finally {
                    setAddingToCart(false);
                  }
                }}
                className={`flex-1 h-14 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  addedToCart
                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                    : "bg-primary text-white shadow-primary/20 hover:bg-primary-dark"
                }`}
              >
                {addingToCart ? (
                  <><Loader2 size={20} className="animate-spin" /> Adding...</>
                ) : addedToCart ? (
                  <><Check size={20} /> Added to Cart!</>
                ) : needsSelection ? (
                  <>Select Options</>
                ) : (
                  <><ShoppingBag size={20} /> Add to Cart</>
                )}
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
                <p className="mb-4"><strong className="text-text-primary">Free Standard Shipping:</strong> 3–5 business days.</p>
                <p className="mb-4"><strong className="text-text-primary">Express Shipping:</strong> 1–2 business days ($15.00).</p>
                <p><strong className="text-text-primary">Returns:</strong> We accept returns within 30 days. Items must be in new condition with tags attached.</p>
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
