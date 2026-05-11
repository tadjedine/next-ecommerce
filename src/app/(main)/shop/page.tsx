import CatalogLayout from "../../components/catalog/CatalogLayout";
import { clothingFilters } from "@/lib/mock/filters";
import { mockCatalogProducts } from "@/lib/mock/dummyData";

export default function ShopPage() {
  return (
    <CatalogLayout
      title="All Products"
      breadcrumb="Home > Shop"
      productCount={mockCatalogProducts.length}
      filters={clothingFilters}
      products={mockCatalogProducts}
    />
  );
}