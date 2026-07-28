"use client";
import { useState, useMemo } from "react";
import FilterSidebar, { FilterState } from "./FilterSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { StaggerContainer, StaggerItem } from "../motion/Stagger";
import ProductCard from "../ProductCard";
import { ApiProduct, ApiFiltersResponse } from "@/lib/api";

interface CatalogLayoutProps {
  title: string;
  breadcrumb: string;
  productCount: number;
  apiFilters: ApiFiltersResponse;
  filterState: FilterState;
  onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearFilters: () => void;
  sort: string;
  onSortChange: (sort: string) => void;
  products: ApiProduct[];
}

export default function CatalogLayout({
  title,
  breadcrumb,
  productCount,
  apiFilters,
  filterState,
  onFilterChange,
  onClearFilters,
  sort,
  onSortChange,
  products
}: CatalogLayoutProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Calculate active filter count for the badge
  const activeFilterCount = 
    Object.values(filterState.attributes).flat().length + 
    Object.values(filterState.features).flat().length +
    (filterState.price_min !== undefined || filterState.price_max !== undefined ? 1 : 0);

  // Generate tags for selected filters
  const activeTags = useMemo(() => {
    const tags: { id: string; label: string; onRemove: () => void }[] = [];

    // Attributes
    for (const [groupIdStr, valueIds] of Object.entries(filterState.attributes)) {
      const groupId = parseInt(groupIdStr, 10);
      const group = apiFilters.attributes.find((g) => g.id === groupId);
      if (group) {
        for (const valId of valueIds) {
          const val = group.values.find((v) => v.id === valId);
          if (val) {
            tags.push({
              id: `attr-${groupId}-${valId}`,
              label: `${group.name}: ${val.name}`,
              onRemove: () => {
                const newValues = filterState.attributes[groupId].filter((id) => id !== valId);
                onFilterChange((prev) => ({
                  ...prev,
                  attributes: { ...prev.attributes, [groupId]: newValues }
                }));
              }
            });
          }
        }
      }
    }

    // Features
    for (const [featureIdStr, valueIds] of Object.entries(filterState.features)) {
      const featureId = parseInt(featureIdStr, 10);
      const feature = apiFilters.features.find((f) => f.id === featureId);
      if (feature) {
        for (const valId of valueIds) {
          const val = feature.values.find((v) => v.id === valId);
          if (val) {
            tags.push({
              id: `feat-${featureId}-${valId}`,
              label: `${feature.name}: ${val.name}`,
              onRemove: () => {
                const newValues = filterState.features[featureId].filter((id) => id !== valId);
                onFilterChange((prev) => ({
                  ...prev,
                  features: { ...prev.features, [featureId]: newValues }
                }));
              }
            });
          }
        }
      }
    }

    // Price
    if (filterState.price_min !== undefined || filterState.price_max !== undefined) {
      const min = filterState.price_min ?? apiFilters.price_range.min;
      const max = filterState.price_max ?? apiFilters.price_range.max;
      tags.push({
        id: 'price',
        label: `Price: $${min} - $${max}`,
        onRemove: () => {
          onFilterChange((prev) => ({
            ...prev,
            price_min: undefined,
            price_max: undefined
          }));
        }
      });
    }

    return tags;
  }, [filterState, apiFilters, onFilterChange]);

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
          <FilterSidebar 
            apiFilters={apiFilters} 
            filterState={filterState} 
            onFilterChange={onFilterChange} 
            onClearAll={onClearFilters} 
          />
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
                <FilterSidebar 
                  apiFilters={apiFilters} 
                  filterState={filterState} 
                  onFilterChange={onFilterChange} 
                  onClearAll={onClearFilters} 
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 rounded-full border border-border-soft px-4 py-2 bg-surface shadow-sm font-semibold"
              >
                <SlidersHorizontal size={18} /> Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
                )}
              </button>
              
              {/* Active Filter Tags */}
              <div className="hidden sm:flex flex-wrap gap-2">
                {activeTags.map((tag) => (
                  <span 
                    key={tag.id}
                    onClick={tag.onRemove}
                    className="rounded-full bg-primary/10 text-primary text-xs px-3 py-1.5 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-primary/20 transition-colors"
                  >
                    {tag.label} <X size={12} strokeWidth={3} />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-text-muted text-sm hidden sm:block">Showing {products.length} results</span>
              <select 
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="rounded-xl border border-border-soft bg-surface px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-2xl border border-border-soft">
              <h3 className="text-2xl font-bold text-text-primary mb-2">No products found</h3>
              <p className="text-text-muted mb-6">Try adjusting your filters or search terms.</p>
              <button 
                onClick={onClearFilters}
                className="px-6 py-2 bg-primary text-white font-bold rounded-full shadow-md hover:bg-primary-dark transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <StaggerContainer key={products.map(p => p.id).join('-')} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

        </div>
      </div>
    </div>
  );
}
