"use client";

import { useEffect, useState } from "react";
import { ApiCategory } from "@/lib/api";

export default function Marquee() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cookies = document.cookie.split("; ");
        const localeCookie = cookies.find((row) => row.startsWith("locale="));
        const locale = localeCookie ? localeCookie.split("=")[1] : "en";

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/categories?per_page=50`,
          {
            headers: {
              "Accept-Language": locale,
            },
          }
        );
        const json = await res.json();
        const items = Array.isArray(json.data) ? json.data : [];
        // Filter out root categories and unnamed ones
        const filtered = items.filter(
          (c: ApiCategory) => !c.is_root && c.name && c.name !== "Unnamed Category"
        );
        setCategories(filtered);
      } catch (err) {
        console.error("Failed to fetch categories for marquee:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading || categories.length === 0) {
    return (
      <div className="w-full border-y border-border-soft bg-surface overflow-hidden py-4 flex relative">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, arrayIndex) => (
            <div key={arrayIndex} className="flex shrink-0">
              {["Loading…"].map((item, i) => (
                <div key={`${arrayIndex}-${i}`} className="flex items-center">
                  <span className="text-sm font-semibold text-text-muted uppercase tracking-widest px-8">
                    {item}
                  </span>
                  <span className="text-border-soft">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-y border-border-soft bg-surface overflow-hidden py-4 flex relative">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(2)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex shrink-0">
            {categories.map((cat, i) => (
              <div key={`${arrayIndex}-${i}`} className="flex items-center">
                <span className="text-sm font-semibold text-text-muted uppercase tracking-widest px-8">
                  {cat.name}
                </span>
                <span className="text-border-soft">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
