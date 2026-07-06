"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { ApiCategory } from "@/lib/api";
import Link from "next/link";
import { Layers } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function BrowseCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cookies = document.cookie.split("; ");
        const localeCookie = cookies.find((row) => row.startsWith("locale="));
        const locale = localeCookie ? localeCookie.split("=")[1] : "en";

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/categories/main`,
          {
            headers: {
              "Accept-Language": locale,
            },
          }
        );
        const json = await res.json();
        // Filter out root categories and unnamed
        const filtered = (json.data as ApiCategory[]).filter(
          (c) => c.name && c.name !== "Unnamed Category"
        );
        setCategories(filtered);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Skeleton loader
  if (loading) {
    return (
      <div className="py-24 bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <FadeUpOnScroll className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">
              {t("categories.title")}
            </h2>
            <p className="text-text-muted text-lg">{t("categories.subtitle")}</p>
          </FadeUpOnScroll>
        </div>
        <div className="w-full flex overflow-x-auto md:overflow-visible scrollbar-hide pb-8 px-6 md:px-12 gap-6 snap-x snap-mandatory md:snap-none md:flex-wrap md:justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 snap-start w-40 h-48 rounded-2xl bg-bg-base animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  // Generate a consistent gradient based on the category index
  const gradients = [
    "from-indigo-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-fuchsia-600",
    "from-lime-500 to-green-600",
    "from-red-500 to-rose-600",
  ];

  return (
    <div className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <FadeUpOnScroll className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">
            {t("categories.title")}
          </h2>
          <p className="text-text-muted text-lg">{t("categories.subtitle")}</p>
        </FadeUpOnScroll>
      </div>

      <div className="w-full flex overflow-x-auto md:overflow-visible scrollbar-hide pb-8 px-6 md:px-12 gap-6 snap-x snap-mandatory md:snap-none md:flex-wrap md:justify-center">
        {categories.map((cat, i) => (
          <Link key={cat.id} href={`/shop/${cat.slug}`} className="shrink-0 snap-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-40 h-48 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {/* Gradient background since categories have no images in PrestaShop */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]}`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

              {/* Category icon */}
              <div className="absolute top-4 right-4 opacity-20 text-white">
                <Layers size={48} />
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-white font-semibold tracking-wide text-sm leading-tight block">
                  {cat.name}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
