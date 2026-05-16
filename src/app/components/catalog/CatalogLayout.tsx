"use client";
import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import { FilterGroup } from "@/lib/mock/filters";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { StaggerContainer, StaggerItem } from "../motion/Stagger";
import ProductCard from "../ProductCard";
import { ApiProduct } from "@/lib/api";

interface CatalogLayoutProps {
  title: string;
  breadcrumb: string;
  productCount: number;
  filters: FilterGroup[];
  products: ApiProduct[];
}

export default function CatalogLayout({ title, breadcrumb, productCount, filters, products }: CatalogLayoutProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base pt-20 pb-24">
      {/* Page Header */}
      <div className="bg-hero py-12 mb-8 border-b border-border-soft">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-sm text-text-muted font-medium mb-4">{breadcrumb}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-2">{title}</h1>
          <p className="text-text-muted">{productCount} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} />
        </div>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              />
              <motion.div 
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-surface z-50 p-6 overflow-y-auto lg:hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-extrabold text-xl text-text-primary">Filters</h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-bg-base rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebar filters={filters} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 rounded-full border border-border-soft px-4 py-2 bg-surface shadow-sm font-semibold"
              >
                <SlidersHorizontal size={18} /> Filters
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">3</span>
              </button>
              <div className="hidden sm:flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 text-primary text-xs px-3 py-1 font-semibold flex items-center gap-1 cursor-pointer">
                  Size: M <X size={12} />
                </span>
                <span className="rounded-full bg-primary/10 text-primary text-xs px-3 py-1 font-semibold flex items-center gap-1 cursor-pointer">
                  Color: Black <X size={12} />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-text-muted text-sm hidden sm:block">Showing 1-12 of {productCount} results</span>
              <select className="rounded-xl border border-border-soft bg-surface px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Most Popular</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Pagination */}
          <div className="flex justify-center mt-12 gap-2">
            <button className="border border-border-soft rounded-full w-10 h-10 flex items-center justify-center font-bold text-text-muted hover:border-primary hover:text-primary transition-colors">&lt;</button>
            <button className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md">1</button>
            <button className="border border-border-soft rounded-full w-10 h-10 flex items-center justify-center font-bold text-text-muted hover:border-primary hover:text-primary transition-colors">2</button>
            <button className="border border-border-soft rounded-full w-10 h-10 flex items-center justify-center font-bold text-text-muted hover:border-primary hover:text-primary transition-colors">3</button>
            <button className="border border-border-soft rounded-full w-10 h-10 flex items-center justify-center font-bold text-text-muted hover:border-primary hover:text-primary transition-colors">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
