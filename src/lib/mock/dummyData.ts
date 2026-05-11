export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  images?: string[];
  slug: string;
  category: string;
  badge?: "New" | "Sale" | "Bestseller";
  rating: number;
  review_count: number;
  description?: string;
  variants?: {
    sizes: string[];
    colors: { name: string; hex: string }[];
  };
  attributes?: Record<string, string>;
  stock_status?: Record<string, boolean>;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface HeroSlide {
  id: string;
  headline: string;
  subtext: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export const mockProducts: Product[] = [
  { id: "1", name: "Linen Blend Shirt", price: 39.99, original_price: 59.99, image: "https://picsum.photos/seed/p1/400/500", slug: "linen-blend-shirt", category: "Women", badge: "Sale", rating: 4.5, review_count: 128 },
  { id: "2", name: "Classic Leather Sneaker", price: 89.99, image: "https://picsum.photos/seed/p2/400/500", slug: "classic-leather-sneaker", category: "Men", badge: "Bestseller", rating: 4.8, review_count: 342 },
  { id: "3", name: "Minimalist Watch", price: 120.00, original_price: 150.00, image: "https://picsum.photos/seed/p3/400/500", slug: "minimalist-watch", category: "Accessories", rating: 4.2, review_count: 56 },
  { id: "4", name: "Denim Jacket", price: 65.00, image: "https://picsum.photos/seed/p4/400/500", slug: "denim-jacket", category: "Men", badge: "New", rating: 4.9, review_count: 12 },
  { id: "5", name: "Summer Floral Dress", price: 45.00, original_price: 70.00, image: "https://picsum.photos/seed/p5/400/500", slug: "summer-floral-dress", category: "Women", badge: "Sale", rating: 4.6, review_count: 89 },
  { id: "6", name: "Canvas Tote Bag", price: 25.00, image: "https://picsum.photos/seed/p6/400/500", slug: "canvas-tote-bag", category: "Accessories", rating: 4.1, review_count: 234 },
];

export const mockCategories: Category[] = [
  { id: "c1", name: "Women", image: "https://picsum.photos/seed/c1/300/400", slug: "women" },
  { id: "c2", name: "Men", image: "https://picsum.photos/seed/c2/300/400", slug: "men" },
  { id: "c3", name: "Accessories", image: "https://picsum.photos/seed/c3/300/400", slug: "accessories" },
  { id: "c4", name: "Shoes", image: "https://picsum.photos/seed/c4/300/400", slug: "shoes" },
  { id: "c5", name: "Beauty", image: "https://picsum.photos/seed/c5/300/400", slug: "beauty" },
  { id: "c6", name: "Kids", image: "https://picsum.photos/seed/c6/300/400", slug: "kids" },
  { id: "c7", name: "Sport", image: "https://picsum.photos/seed/c7/300/400", slug: "sport" },
];

export const mockHeroSlides: HeroSlide[] = [
  { id: "s1", headline: "Summer Sale Collections", subtext: "Sale! Up to 50% off!", image: "https://picsum.photos/seed/s1/1920/800", ctaText: "SHOP NOW", ctaLink: "/shop/sale" },
  { id: "s2", headline: "New Arrivals", subtext: "Refresh your wardrobe with our latest styles.", image: "https://picsum.photos/seed/s2/1920/800", ctaText: "DISCOVER", ctaLink: "/shop/new" },
  { id: "s3", headline: "Sustainable Basics", subtext: "Eco-friendly materials, designed for everyday wear.", image: "https://picsum.photos/seed/s3/1920/800", ctaText: "LEARN MORE", ctaLink: "/shop/sustainable" },
];

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export const mockCatalogProducts: Product[] = Array.from({ length: 24 }).map((_, i) => {
  const categories = ["Women", "Men", "Accessories", "Shoes", "Beauty", "Electronics"];
  const category = categories[i % categories.length];
  const price = Math.floor(Math.random() * 150) + 20;
  
  return {
    id: `prod-${i + 1}`,
    name: `${category} Item ${i + 1}`,
    price: price,
    original_price: i % 3 === 0 ? price + 20 : undefined,
    image: `https://picsum.photos/seed/${i + 100}/400/500`,
    images: [
      `https://picsum.photos/seed/${i + 100}/800/1000`,
      `https://picsum.photos/seed/${i + 101}/800/1000`,
      `https://picsum.photos/seed/${i + 102}/800/1000`
    ],
    slug: `${category.toLowerCase()}-item-${i + 1}`,
    category: category,
    badge: i % 5 === 0 ? "New" : i % 7 === 0 ? "Sale" : undefined,
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    review_count: Math.floor(Math.random() * 200),
    description: "This is a detailed product description that outlines the materials, fit, and care instructions. Perfect for everyday wear, this item combines comfort with modern aesthetics.",
    variants: {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" },
        { name: "Navy", hex: "#000080" }
      ]
    },
    attributes: {
      "Material": "100% Cotton",
      "Care": "Machine wash cold",
      "Fit": "Regular fit",
      "Origin": "Made in Portugal"
    },
    stock_status: { "Black-S": true, "White-M": false, "Navy-L": true }
  };
});

export const mockReviews: Review[] = [
  { id: "r1", author: "Sarah J.", rating: 5, date: "October 12, 2025", comment: "Absolutely love this! The quality is amazing and it fits perfectly." },
  { id: "r2", author: "Mike T.", rating: 4, date: "September 28, 2025", comment: "Great product, but shipping took a little longer than expected." },
  { id: "r3", author: "Elena R.", rating: 5, date: "September 15, 2025", comment: "Exceeded my expectations. Will definitely be buying in other colors." },
];