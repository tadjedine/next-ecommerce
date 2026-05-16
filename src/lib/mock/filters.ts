export interface FilterGroup {
  id: string;
  label: string;
  type: "checkbox" | "color-swatch" | "range" | "rating";
  options?: { value: string; label: string; count?: number; hex?: string }[];
  min?: number;
  max?: number;
}

export const clothingFilters: FilterGroup[] = [
  {
    id: "size",
    label: "Size",
    type: "checkbox",
    options: [
      { value: "s", label: "Small", count: 42 },
      { value: "m", label: "Medium", count: 86 },
      { value: "l", label: "Large", count: 75 },
      { value: "xl", label: "X-Large", count: 24 },
    ]
  },
  {
    id: "color",
    label: "Color",
    type: "color-swatch",
    options: [
      { value: "black", label: "Black", hex: "#000000" },
      { value: "white", label: "White", hex: "#FFFFFF" },
      { value: "blue", label: "Blue", hex: "#2B7FFF" },
      { value: "red", label: "Red", hex: "#EF4444" },
      { value: "green", label: "Green", hex: "#10B981" },
    ]
  },
  {
    id: "price",
    label: "Price Range",
    type: "range",
    min: 0,
    max: 200
  },
  {
    id: "rating",
    label: "Customer Rating",
    type: "rating"
  }
];

export const electronicsFilters: FilterGroup[] = [
  {
    id: "brand",
    label: "Brand",
    type: "checkbox",
    options: [
      { value: "apple", label: "Apple", count: 120 },
      { value: "samsung", label: "Samsung", count: 95 },
      { value: "sony", label: "Sony", count: 45 },
      { value: "bose", label: "Bose", count: 32 },
    ]
  },
  {
    id: "storage",
    label: "Storage",
    type: "checkbox",
    options: [
      { value: "64gb", label: "64 GB", count: 12 },
      { value: "128gb", label: "128 GB", count: 45 },
      { value: "256gb", label: "256 GB", count: 86 },
      { value: "512gb", label: "512 GB", count: 34 },
    ]
  },
  {
    id: "price",
    label: "Price Range",
    type: "range",
    min: 0,
    max: 2000
  },
  {
    id: "rating",
    label: "Customer Rating",
    type: "rating"
  }
];
