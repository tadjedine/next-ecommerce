"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ApiProduct } from "@/lib/api";

export default function NewArrivals() {
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/products?per_page=6`);
        const json = await res.json();
        setProducts(json.data as ApiProduct[]);
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      }
    };
    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-bold">New Arrivals</h2>
        <a href="/shop/new" className="text-sm font-medium underline hover:text-gray-600">View All</a>
      </div>
      <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="snap-start shrink-0 w-[280px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}