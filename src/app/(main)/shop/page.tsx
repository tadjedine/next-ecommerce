"use client";
import { useEffect, useState, useCallback } from "react";
import CatalogLayout from "../../components/catalog/CatalogLayout";
import { FilterState } from "../../components/catalog/FilterSidebar";
import { ApiProduct, ApiFiltersResponse, getProducts, getFilters } from "@/lib/api";

const initialFilterState: FilterState = {
  attributes: {},
  features: {},
};

export default function ShopPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [apiFilters, setApiFilters] = useState<ApiFiltersResponse | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [sort, setSort] = useState<string>("newest");
  const [loading, setLoading] = useState(true);

  // Fetch API filters configuration on mount
  useEffect(() => {
    const fetchFiltersConfig = async () => {
      try {
        const filters = await getFilters();
        setApiFilters(filters);
      } catch (err) {
        console.error("Failed to fetch filters config:", err);
      }
    };
    fetchFiltersConfig();
  }, []);

  // Fetch products whenever filters or sort change
  const fetchFilteredProducts = useCallback(async () => {
    try {
      const res = await getProducts({
        per_page: 24,
        sort,
        price_min: filterState.price_min,
        price_max: filterState.price_max,
        attributes: filterState.attributes,
        features: filterState.features,
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch filtered products:", err);
    } finally {
      setLoading(false);
    }
  }, [filterState, sort]);

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
      title="All Products"
      breadcrumb="Home > Shop"
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