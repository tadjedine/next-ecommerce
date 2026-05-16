"use client";
import { useEffect, useState } from "react";
import CatalogLayout from "../../../components/catalog/CatalogLayout";
import { clothingFilters, electronicsFilters } from "@/lib/mock/filters";
import { ApiProduct } from "@/lib/api";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to find the category ID by slug — for now, fetch all and filter
        // In the future, the API could support filtering by slug directly
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
  }, [category]);

  // Choose filters based on category
  const filters = category === "electronics" ? electronicsFilters : clothingFilters;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base pt-20 pb-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <CatalogLayout
      title={categoryName}
      breadcrumb={`Home > Shop > ${categoryName}`}
      productCount={products.length}
      filters={filters}
      products={products}
    />
  );
}
