"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { mockCatalogProducts } from "@/lib/mock/dummyData";

const TABS = ["Featured", "New Arrivals", "Best Sellers"];

export default function OurProducts() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  
  // Fake filtering for demonstration
  const filteredProducts = mockCatalogProducts
    .slice(0, 8)
    .sort(() => 0.5 - Math.random());

  return (
    <div className="py-24 bg-bg-base">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">Our Products</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto mb-10">
            Handpicked favorites from our exclusive collections.
          </p>

          <div className="flex justify-center mb-12 border-b border-border-soft overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab ? "text-primary" : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="products-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </FadeUpOnScroll>

        <StaggerContainer key={activeTab} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-16 text-center">
          <Link 
            href="/shop"
            className="inline-block rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors px-10 py-3.5 font-bold"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
