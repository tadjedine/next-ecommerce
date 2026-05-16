"use client";
import { useState } from "react";

interface FilterSidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  categories: string[];
  activeCategory: string | null;
}

export default function FilterSidebar({ isOpen, setIsOpen, categories, activeCategory }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState(150);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 lg:block lg:w-64 lg:p-0 lg:z-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close filters">✕</button>
        </div>

        <div className="space-y-8">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={activeCategory === cat} readOnly className="w-4 h-4 accent-black" />
                    <span className="text-sm">{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-4">Price: Under ${priceRange}</h3>
            <input 
              type="range" 
              min="0" max="200" 
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-black"
            />
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-semibold mb-4">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button key={size} className="border border-gray-300 py-1 text-sm hover:border-black transition-colors">{size}</button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}