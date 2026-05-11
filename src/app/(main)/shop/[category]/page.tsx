import CatalogLayout from "../../../components/catalog/CatalogLayout";
import { clothingFilters, electronicsFilters } from "@/lib/mock/filters";
import { mockCatalogProducts } from "@/lib/mock/dummyData";

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const products = mockCatalogProducts.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
  
  // Choose filters based on category
  const filters = params.category === "electronics" ? electronicsFilters : clothingFilters;

  return (
    <CatalogLayout
      title={categoryName}
      breadcrumb={`Home > Shop > ${categoryName}`}
      productCount={products.length > 0 ? products.length : mockCatalogProducts.length}
      filters={filters}
      products={products.length > 0 ? products : mockCatalogProducts} // fallback to all if empty
    />
  );
}
