export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  slug: string;
  category: string;
  badge?: "New" | "Sale" | "Bestseller";
  rating: number;
  review_count: number;
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
  { id: "c1", name: "Women", image: "https://picsum.photos/seed/c1/300/300", slug: "women" },
  { id: "c2", name: "Men", image: "https://picsum.photos/seed/c2/300/300", slug: "men" },
  { id: "c3", name: "Accessories", image: "https://picsum.photos/seed/c3/300/300", slug: "accessories" },
  { id: "c4", name: "Shoes", image: "https://picsum.photos/seed/c4/300/300", slug: "shoes" },
  { id: "c5", name: "Beauty", image: "https://picsum.photos/seed/c5/300/300", slug: "beauty" },
  { id: "c6", name: "Kids", image: "https://picsum.photos/seed/c6/300/300", slug: "kids" },
];

export const mockHeroSlides: HeroSlide[] = [
  { id: "s1", headline: "Summer Sale Collections", subtext: "Sale! Up to 50% off!", image: "https://picsum.photos/seed/s1/1920/800", ctaText: "SHOP NOW", ctaLink: "/shop/sale" },
  { id: "s2", headline: "New Arrivals", subtext: "Refresh your wardrobe with our latest styles.", image: "https://picsum.photos/seed/s2/1920/800", ctaText: "DISCOVER", ctaLink: "/shop/new" },
  { id: "s3", headline: "Sustainable Basics", subtext: "Eco-friendly materials, designed for everyday wear.", image: "https://picsum.photos/seed/s3/1920/800", ctaText: "LEARN MORE", ctaLink: "/shop/sustainable" },
];