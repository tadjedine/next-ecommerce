"use client";
import { useEffect, useState } from "react";
import CatalogLayout from "../../components/catalog/CatalogLayout";
import { clothingFilters } from "@/lib/mock/filters";
import { ApiProduct } from "@/lib/api";

export default function ShopPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/products?per_page=24`
        );
        const json = await res.json();
        setProducts(json.data as ApiProduct[]);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base pt-20 pb-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <CatalogLayout
      title="All Products"
      breadcrumb="Home > Shop"
      productCount={products.length}
      filters={clothingFilters}
      products={products}
    />
  );
}