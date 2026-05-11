"use client";
import { motion } from "framer-motion";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { mockCategories } from "@/lib/mock/dummyData";
import Link from "next/link";
import Image from "next/image";

export default function BrowseCategories() {
  return (
    <div className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <FadeUpOnScroll>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">Shop by Category</h2>
          <p className="text-text-muted text-lg">Find exactly what you're looking for.</p>
        </FadeUpOnScroll>
      </div>

      <div className="w-full flex overflow-x-auto scrollbar-hide pb-8 px-6 md:px-12 gap-6 snap-x snap-mandatory">
        {mockCategories.map((cat, i) => (
          <Link key={cat.id} href={`/shop/${cat.slug}`} className="shrink-0 snap-start">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-40 h-48 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <Image 
                src={cat.image} 
                alt={cat.name} 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-white font-semibold tracking-wide">{cat.name}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
