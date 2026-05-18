"use client";
import { useEffect, useState } from "react";
import CatalogLayout from "../../../components/catalog/CatalogLayout";
import { clothingFilters, electronicsFilters } from "@/lib/mock/filters";
import { ApiProduct, ApiCategory } from "@/lib/api";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categoryName, setCategoryName] = useState(
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products filtered by category slug
        const productsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/products?category_slug=${encodeURIComponent(categorySlug)}&per_page=24`
        );
        const productsJson = await productsRes.json();
        setProducts(productsJson.data as ApiProduct[]);

        // Fetch categories to resolve the display name
        const catsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/categories?per_page=50`
        );
        const catsJson = await catsRes.json();
        const matchedCat = (catsJson.data as ApiCategory[]).find(
          (c) => c.slug === categorySlug
        );
        if (matchedCat) {
          setCategoryName(matchedCat.name);
        }
      } catch (err) {
        console.error("Failed to fetch category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  // Choose filters based on category
  const filters = categorySlug === "electronics" ? electronicsFilters : clothingFilters;

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

