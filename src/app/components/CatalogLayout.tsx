"use client";
import { useState } from "react";
import FilterSidebar from "./FilterSideBar";
import ProductCard from "./ProductCard";
import { mockCatalogProducts } from "@/lib/mock/dummyData";

export default function CatalogLayout({ initialCategory }: { initialCategory?: string }) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  
  // Dummy filtering logic
  const filteredProducts = initialCategory 
    ? mockCatalogProducts.filter(p => p.category.toLowerCase() === initialCategory.toLowerCase())
    : mockCatalogProducts;

  const categories = Array.from(new Set(mockCatalogProducts.map(p => p.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold capitalize">{initialCategory || "All Products"}</h1>
          <p className="text-gray-500 mt-2">Showing {filteredProducts.length} results</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex-1 border border-black py-2 px-4 font-medium flex justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters
          </button>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 md:w-48 border border-gray-300 py-2 px-4 bg-white outline-none focus:border-black"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Active Chips */}
      {initialCategory && (
        <div className="flex gap-2 mb-6">
          <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 text-sm rounded-full">
            Category: {initialCategory} 
            <button className="ml-1 text-gray-500 hover:text-black">✕</button>
          </span>
          <button className="text-sm underline text-gray-500 hover:text-black">Clear all</button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar */}
        <FilterSidebar 
          isOpen={isMobileFilterOpen} 
          setIsOpen={setIsMobileFilterOpen} 
          categories={categories}
          activeCategory={initialCategory || null}
        />

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center items-center gap-2">
            <button className="p-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="w-10 h-10 bg-black text-white font-medium">1</button>
            <button className="w-10 h-10 border border-gray-300 hover:bg-gray-50 font-medium">2</button>
            <span className="px-2">...</span>
            <button className="p-2 border border-gray-300 hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}