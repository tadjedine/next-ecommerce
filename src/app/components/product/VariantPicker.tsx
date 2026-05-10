"use client";
import { useState } from "react";
import { Product } from "@/lib/mock/dummyData";

export default function VariantPicker({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-6 my-8">
      {/* Colors */}
      {product.colors && (
        <div>
          <span className="text-sm font-semibold mb-3 block">Color: <span className="font-normal text-gray-600">{selectedColor}</span></span>
          <div className="flex gap-3">
            {product.colors.map(color => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-8 h-8 rounded-full border-2 ring-offset-2 transition-all ${selectedColor === color.name ? "ring-2 ring-black border-white" : "border-gray-200"}`}
                style={{ backgroundColor: color.hex }}
                aria-label={`Select ${color.name}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold">Size</span>
            <button className="text-xs text-gray-500 underline">Size Guide</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.sizes.map(size => {
              // Mock stock check based on combination
              const isOutOfStock = selectedColor ? !product.stock_status?.[`${selectedColor}-${size}`] : false;
              
              return (
                <button
                  key={size}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border text-sm font-medium transition-colors ${
                    isOutOfStock 
                      ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed line-through" 
                      : selectedSize === size 
                        ? "border-black bg-black text-white" 
                        : "border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 mt-4">
        {/* Quantity */}
        <div className="flex border border-gray-300 items-center w-32 shrink-0">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50">-</button>
          <span className="flex-1 text-center font-medium">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50">+</button>
        </div>
        
        <button className="flex-1 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
          Add to Cart
        </button>
        
        <button className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:border-black transition-colors shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
      </div>
    </div>
  );
}