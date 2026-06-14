"use client";
import { motion } from "framer-motion";
import { ApiAttributeGroup, ApiCombination } from "@/lib/api";

interface VariantSelectorProps {
  attributeGroups: ApiAttributeGroup[];
  combinations: ApiCombination[];
  selectedAttributes: Record<string, number>; // groupName → attributeId
  onAttributeChange: (groupName: string, attributeId: number) => void;
}

export default function VariantSelector({
  attributeGroups,
  combinations,
  selectedAttributes,
  onAttributeChange,
}: VariantSelectorProps) {
  // Determine which attribute values are available given current selections
  const getAvailableValues = (groupName: string): Set<number> => {
    const available = new Set<number>();
    // Check each combination to see if it's compatible with current selections
    // (excluding the group we're checking — so we show what's possible for that group)
    for (const combo of combinations) {
      const isCompatible = Object.entries(selectedAttributes).every(
        ([selGroup, selAttrId]) => {
          if (selGroup === groupName) return true; // skip self
          return combo.attributes[selGroup]?.id === selAttrId;
        }
      );
      if (isCompatible && combo.attributes[groupName]) {
        available.add(combo.attributes[groupName].id);
      }
    }
    return available;
  };

  // Check if a specific value has stock given current selections
  const hasStock = (groupName: string, attrId: number): boolean => {
    return combinations.some((combo) => {
      const matchesThis = combo.attributes[groupName]?.id === attrId;
      const matchesOthers = Object.entries(selectedAttributes).every(
        ([selGroup, selAttrId]) => {
          if (selGroup === groupName) return true;
          return combo.attributes[selGroup]?.id === selAttrId;
        }
      );
      return matchesThis && matchesOthers && combo.quantity > 0;
    });
  };

  return (
    <div className="space-y-6">
      {attributeGroups.map((group) => {
        const available = getAvailableValues(group.name);
        const selectedId = selectedAttributes[group.name];

        return (
          <div key={group.id}>
            <label className="block text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">
              {group.name}
              {selectedId && (
                <span className="ml-2 text-text-muted font-normal normal-case tracking-normal">
                  — {group.values.find((v) => v.id === selectedId)?.name}
                </span>
              )}
            </label>

            {group.is_color ? (
              /* ── Color swatches ── */
              <div className="flex flex-wrap gap-3">
                {group.values.map((val) => {
                  const isSelected = selectedId === val.id;
                  const isAvailable = available.has(val.id);
                  const inStock = hasStock(group.name, val.id);

                  return (
                    <motion.button
                      key={val.id}
                      whileHover={isAvailable ? { scale: 1.1 } : undefined}
                      whileTap={isAvailable ? { scale: 0.95 } : undefined}
                      onClick={() =>
                        isAvailable && onAttributeChange(group.name, val.id)
                      }
                      className={`relative w-10 h-10 rounded-full transition-all ${
                        isSelected
                          ? "ring-2 ring-primary ring-offset-2"
                          : "ring-1 ring-border-soft hover:ring-primary"
                      } ${
                        !isAvailable
                          ? "opacity-30 cursor-not-allowed"
                          : !inStock
                          ? "opacity-50"
                          : "cursor-pointer"
                      }`}
                      style={{ backgroundColor: val.color || "#ccc" }}
                      title={`${val.name}${!inStock ? " (Out of stock)" : ""}`}
                    >
                      {/* Border for white swatches */}
                      {val.color?.toLowerCase() === "#ffffff" && (
                        <span className="absolute inset-0 rounded-full border border-gray-200" />
                      )}
                      {/* Out of stock diagonal line */}
                      {isAvailable && !inStock && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-full h-px bg-red-400 rotate-45 absolute" />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              /* ── Pill / button selectors ── */
              <div className="flex flex-wrap gap-2">
                {group.values.map((val) => {
                  const isSelected = selectedId === val.id;
                  const isAvailable = available.has(val.id);
                  const inStock = hasStock(group.name, val.id);

                  return (
                    <motion.button
                      key={val.id}
                      whileHover={isAvailable ? { scale: 1.03 } : undefined}
                      whileTap={isAvailable ? { scale: 0.97 } : undefined}
                      onClick={() =>
                        isAvailable && onAttributeChange(group.name, val.id)
                      }
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                          : "bg-surface text-text-primary border-border-soft hover:border-primary hover:text-primary"
                      } ${
                        !isAvailable
                          ? "opacity-30 cursor-not-allowed line-through"
                          : !inStock
                          ? "opacity-50 line-through"
                          : "cursor-pointer"
                      }`}
                      title={`${val.name}${!inStock ? " (Out of stock)" : ""}`}
                    >
                      {val.name}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
