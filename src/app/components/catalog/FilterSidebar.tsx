"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { ApiFiltersResponse, ApiFilterGroup } from "@/lib/api";

export interface FilterState {
  attributes: Record<number, number[]>; // groupId -> array of valueIds
  features: Record<number, number[]>; // featureId -> array of valueIds
  price_min?: number;
  price_max?: number;
}

interface FilterSidebarProps {
  apiFilters: ApiFiltersResponse;
  filterState: FilterState;
  onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearAll: () => void;
}

// ─── Reusable Accordion Wrapper ───────────────────────────────────────
const AccordionWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-border-soft py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-bold text-text-primary mb-2 uppercase tracking-wider text-sm"
      >
        {title}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── FilterSidebar Component ──────────────────────────────────────────
export default function FilterSidebar({ apiFilters, filterState, onFilterChange, onClearAll }: FilterSidebarProps) {
  
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [localPriceMin, setLocalPriceMin] = useState(filterState.price_min?.toString() ?? "");
  const [localPriceMax, setLocalPriceMax] = useState(filterState.price_max?.toString() ?? "");

  useEffect(() => {
    setLocalPriceMin(filterState.price_min?.toString() ?? "");
    setLocalPriceMax(filterState.price_max?.toString() ?? "");
  }, [filterState.price_min, filterState.price_max]);

  const handleAttributeChange = (groupId: number, valueId: number) => {
    onFilterChange((prev) => {
      const currentValues = prev.attributes[groupId] || [];
      const newValues = currentValues.includes(valueId)
        ? currentValues.filter((id) => id !== valueId)
        : [...currentValues, valueId];

      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          [groupId]: newValues,
        },
      };
    });
  };

  const handleFeatureChange = (featureId: number, valueId: number) => {
    onFilterChange((prev) => {
      const currentValues = prev.features[featureId] || [];
      const newValues = currentValues.includes(valueId)
        ? currentValues.filter((id) => id !== valueId)
        : [...currentValues, valueId];

      return {
        ...prev,
        features: {
          ...prev.features,
          [featureId]: newValues,
        },
      };
    });
  };

  const handlePriceChange = (minStr: string, maxStr: string) => {
    setLocalPriceMin(minStr);
    setLocalPriceMax(maxStr);

    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    
    priceTimeoutRef.current = setTimeout(() => {
      const min = minStr ? parseFloat(minStr) : undefined;
      const max = maxStr ? parseFloat(maxStr) : undefined;
      onFilterChange((prev) => ({
        ...prev,
        price_min: min,
        price_max: max,
      }));
    }, 600); // Small delay to debounce typing
  };

  const totalSelected = 
    Object.values(filterState.attributes).flat().length + 
    Object.values(filterState.features).flat().length +
    (filterState.price_min !== undefined || filterState.price_max !== undefined ? 1 : 0);

  return (
    <div className="w-64 shrink-0 pr-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-extrabold text-lg text-text-primary">Filters</h3>
        {totalSelected > 0 && (
          <button onClick={onClearAll} className="text-primary text-sm font-medium hover:underline">
            Clear all ({totalSelected})
          </button>
        )}
      </div>

      <div>
        {/* Price Filter */}
        {apiFilters.price_range.max > 0 && (
          <AccordionWrapper title="Price">
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder={`Min (€${apiFilters.price_range.min})`} 
                value={localPriceMin}
                onChange={(e) => handlePriceChange(e.target.value, localPriceMax)}
                className="w-full px-3 py-2 border border-border-soft rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              />
              <span className="text-text-muted">-</span>
              <input 
                type="number" 
                placeholder={`Max (€${apiFilters.price_range.max})`} 
                value={localPriceMax}
                onChange={(e) => handlePriceChange(localPriceMin, e.target.value)}
                className="w-full px-3 py-2 border border-border-soft rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              />
            </div>
          </AccordionWrapper>
        )}

        {/* Attribute Filters */}
        {apiFilters.attributes.map((group) => (
          <AccordionWrapper key={`attr-${group.id}`} title={group.name}>
            {group.is_color ? (
              <div className="flex flex-wrap gap-3">
                {group.values.map((opt) => {
                  const isSelected = (filterState.attributes[group.id] || []).includes(opt.id);
                  return (
                    <button 
                      key={opt.id}
                      onClick={() => handleAttributeChange(group.id, opt.id)}
                      className={`relative w-8 h-8 rounded-full border shadow-sm hover:scale-110 transition-transform ${isSelected ? 'ring-2 ring-primary ring-offset-1 border-transparent' : 'border-border-soft'}`}
                      style={{ backgroundColor: opt.color || "#ccc" }}
                      title={`${opt.name} (${opt.count})`}
                    >
                      {/* Inner border for white swatches */}
                      {opt.color?.toLowerCase() === "#ffffff" && (
                         <span className="absolute inset-0 rounded-full border border-gray-200" />
                      )}
                      {isSelected && (
                         <span className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference drop-shadow-md">
                           <Check size={14} />
                         </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                {group.values.map((opt) => {
                  const isSelected = (filterState.attributes[group.id] || []).includes(opt.id);
                  return (
                    <label key={opt.id} onClick={() => handleAttributeChange(group.id, opt.id)} className="flex items-center gap-3 mb-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-border-soft group-hover:border-primary'}`}>
                        {isSelected && <Check size={14} />}
                      </div>
                      <span className={`transition-colors flex-1 ${isSelected ? 'text-text-primary font-semibold' : 'text-text-muted group-hover:text-text-primary'}`}>
                        {opt.name}
                      </span>
                      <span className="text-xs text-text-muted bg-surface px-2 py-0.5 rounded-full border border-border-soft">{opt.count}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </AccordionWrapper>
        ))}

        {/* Feature Filters */}
        {apiFilters.features.map((feature) => (
          <AccordionWrapper key={`feat-${feature.id}`} title={feature.name}>
            <div>
              {feature.values.map((opt) => {
                const isSelected = (filterState.features[feature.id] || []).includes(opt.id);
                return (
                  <label key={opt.id} onClick={() => handleFeatureChange(feature.id, opt.id)} className="flex items-center gap-3 mb-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-border-soft group-hover:border-primary'}`}>
                      {isSelected && <Check size={14} />}
                    </div>
                    <span className={`transition-colors flex-1 ${isSelected ? 'text-text-primary font-semibold' : 'text-text-muted group-hover:text-text-primary'}`}>
                      {opt.name}
                    </span>
                    <span className="text-xs text-text-muted bg-surface px-2 py-0.5 rounded-full border border-border-soft">{opt.count}</span>
                  </label>
                );
              })}
            </div>
          </AccordionWrapper>
        ))}
      </div>
    </div>
  );
}
