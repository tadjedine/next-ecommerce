"use client";
import { useEffect, useState, useCallback } from "react";
import CatalogLayout from "../../../components/catalog/CatalogLayout";
import { FilterState } from "../../../components/catalog/FilterSidebar";
import { ApiProduct, ApiCategory, ApiFiltersResponse, getProducts, getFilters } from "@/lib/api";
import { useParams } from "next/navigation";

const initialFilterState: FilterState = {
  attributes: {},
  features: {},
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [apiFilters, setApiFilters] = useState<ApiFiltersResponse | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [sort, setSort] = useState<string>("newest");
  const [categoryName, setCategoryName] = useState(
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
  );
  const [loading, setLoading] = useState(true);

  // Fetch API filters configuration scoped to this category
  useEffect(() => {
    const fetchFiltersConfig = async () => {
      try {
        const filters = await getFilters({ category_slug: categorySlug });
        setApiFilters(filters);
      } catch (err) {
        console.error("Failed to fetch category filters config:", err);
      }
    };
    fetchFiltersConfig();
  }, [categorySlug]);

  // Fetch category name
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
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
        console.error("Failed to fetch category name:", err);
      }
    };
    fetchCategoryName();
  }, [categorySlug]);

  // Fetch products whenever filters, sort, or category slug change
  const fetchFilteredProducts = useCallback(async () => {
    try {
      const res = await getProducts({
        category_slug: categorySlug,
        per_page: 24,
        sort,
        price_min: filterState.price_min,
        price_max: filterState.price_max,
        attributes: filterState.attributes,
        features: filterState.features,
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch category products:", err);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, filterState, sort]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  if (loading || !apiFilters) {
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
      apiFilters={apiFilters}
      filterState={filterState}
      onFilterChange={setFilterState}
      onClearFilters={() => setFilterState(initialFilterState)}
      sort={sort}
      onSortChange={setSort}
      products={products}
    />
  );
}
