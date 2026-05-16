"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ApiProduct } from "@/lib/api";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/products?per_page=4`);
        const json = await res.json();
        setProducts(json.data as ApiProduct[]);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      }
    };
    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}