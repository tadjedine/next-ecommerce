"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ApiProduct } from "@/lib/api";

export default function OurProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/products?per_page=8`
        );
        const json = await res.json();
        setProducts(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Skeleton loader
  if (loading) {
    return (
      <div className="py-24 bg-bg-base">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUpOnScroll className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">Our Products</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto mb-10">
              Handpicked favorites from our exclusive collections.
            </p>
          </FadeUpOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface border border-border-soft rounded-2xl p-3 animate-pulse">
                <div className="aspect-[4/5] w-full bg-bg-base rounded-xl mb-3" />
                <div className="h-4 bg-bg-base rounded w-3/4 mb-2" />
                <div className="h-4 bg-bg-base rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 bg-bg-base">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">Our Products</h2>
          <p className="text-text-muted text-lg">No products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-bg-base">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">Our Products</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto mb-10">
            Handpicked favorites from our exclusive collections.
          </p>
        </FadeUpOnScroll>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-block rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors px-10 py-3.5 font-bold"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
