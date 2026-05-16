"use client";
import { useState } from "react";
import { FilterGroup } from "@/lib/mock/filters";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

const AccordionItem = ({ filter }: { filter: FilterGroup }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-border-soft py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-bold text-text-primary mb-2"
      >
        {filter.label}
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
            <div className="pt-3 pb-2">
              {filter.type === "checkbox" && filter.options?.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 mb-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-border-soft flex items-center justify-center group-hover:border-primary transition-colors">
                    {/* Simulated checkbox */}
                  </div>
                  <span className="text-text-muted group-hover:text-text-primary transition-colors flex-1">{opt.label}</span>
                  {opt.count && <span className="text-xs text-text-muted">({opt.count})</span>}
                </label>
              ))}

              {filter.type === "color-swatch" && (
                <div className="flex flex-wrap gap-3">
                  {filter.options?.map((opt) => (
                    <button 
                      key={opt.value}
                      className="w-8 h-8 rounded-full border border-border-soft shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: opt.hex }}
                      title={opt.label}
                    />
                  ))}
                </div>
              )}

              {filter.type === "range" && (
                <div className="flex items-center gap-2">
                  <input type="number" placeholder={`Min ($${filter.min})`} className="w-full px-3 py-2 border border-border-soft rounded-lg text-sm" />
                  <span>-</span>
                  <input type="number" placeholder={`Max ($${filter.max})`} className="w-full px-3 py-2 border border-border-soft rounded-lg text-sm" />
                </div>
              )}

              {filter.type === "rating" && (
                <div className="flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                      <div className="w-5 h-5 rounded border border-border-soft flex items-center justify-center group-hover:border-primary transition-colors" />
                      <div className="flex gap-1 text-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} strokeWidth={i < rating ? 0 : 2} />
                        ))}
                      </div>
                      <span className="text-sm text-text-muted">& Up</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FilterSidebar({ filters }: { filters: FilterGroup[] }) {
  return (
    <div className="w-64 shrink-0 pr-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-extrabold text-lg text-text-primary">Filters</h3>
        <button className="text-primary text-sm font-medium hover:underline">Clear all</button>
      </div>
      <div>
        {filters.map(f => <AccordionItem key={f.id} filter={f} />)}
      </div>
    </div>
  );
}
